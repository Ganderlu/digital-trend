type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  listUnsubscribe?: string[];
  headers?: Record<string, string>;
};

export type SendEmailResult = {
  id: string | null;
  fromUsed: string;
};

function isValidEmailLike(v: string) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function extractAddress(raw: string): string | null {
  if (!raw) return null;
  const angle = /<([^<>]+)>/.exec(raw);
  if (angle && angle[1] && isValidEmailLike(angle[1])) return angle[1].trim();
  if (isValidEmailLike(raw)) return raw.trim();
  return null;
}

function extractDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at === -1) return null;
  return email.slice(at + 1).toLowerCase();
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(message: unknown): boolean {
  const s = typeof message === "string" ? message : "";
  return (
    s.includes("HTTP 429") ||
    s.includes("Too many requests") ||
    s.includes("429") ||
    s.includes("rate limit")
  );
}

function extractResultId(result: unknown): string | null {
  if (!result) return null;
  const r = result as { id?: unknown; data?: { id?: unknown } };
  if (typeof r.id === "string" && r.id.length > 0) return r.id;
  if (r.data && typeof (r.data as { id?: unknown }).id === "string") {
    return (r.data as { id: string }).id;
  }
  return null;
}

export async function sendEmail(
  payload: EmailPayload,
  opts?: { max429Retries?: number },
): Promise<SendEmailResult> {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const fallbackFrom = process.env.FALLBACK_RESEND_FROM;
  const configuredFrom = process.env.RESEND_FROM || fallbackFrom;
  const requestedFrom = payload.from || configuredFrom;
  const replyTo = payload.replyTo || process.env.SUPPORT_EMAIL || undefined;
  const maxRetries = Math.max(0, opts?.max429Retries ?? 3);

  if (!apiKey) {
    throw new Error(
      "Resend is not configured: missing RESEND_API_KEY environment variable.",
    );
  }

  if (!requestedFrom) {
    throw new Error(
      "Resend sender is not configured: set RESEND_FROM in your environment variables (e.g. 'TeveXtra <help@yourdomain.com>').",
    );
  }

  const allowedDomains = (process.env.ALLOWED_EMAIL_DOMAINS || "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);

  function validateFrom(candidate: string): {
    ok: boolean;
    reason?: string;
    address: string | null;
  } {
    const address = extractAddress(candidate);
    if (!address)
      return {
        ok: false,
        reason: `Invalid from format: ${candidate}`,
        address: null,
      };
    const domain = extractDomain(address);
    if (!domain)
      return {
        ok: false,
        reason: `Could not parse sender domain from: ${candidate}`,
        address,
      };
    const gmail =
      /gmail\.com$/i.test(domain) || /googlemail\.com$/i.test(domain);
    if (gmail) {
      return {
        ok: false,
        reason: `From address cannot use Gmail (${address}). Resend rejects unverifiable Gmail senders.`,
        address,
      };
    }
    if (allowedDomains.length > 0 && !allowedDomains.includes(domain)) {
      return {
        ok: false,
        reason: `From domain ${domain} is not in ALLOWED_EMAIL_DOMAINS list.`,
        address,
      };
    }
    return { ok: true, address };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const extraHeaders: Record<string, string> = { ...(payload.headers || {}) };
  if (
    Array.isArray(payload.listUnsubscribe) &&
    payload.listUnsubscribe.length > 0
  ) {
    extraHeaders["List-Unsubscribe"] = payload.listUnsubscribe.join(", ");
    extraHeaders["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }
  extraHeaders["X-Entity-Ref-ID"] =
    `tx-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const primaryCheck = validateFrom(requestedFrom);
  const fallbackValue = configuredFrom;
  const fallbackCheck = fallbackValue
    ? validateFrom(fallbackValue)
    : { ok: false, reason: "No fallback configured", address: null };

  const baseParams = {
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    ...(typeof payload.text === "string" ? { text: payload.text } : {}),
    ...(replyTo && isValidEmailLike(replyTo) ? { reply_to: replyTo } : {}),
    ...(Object.keys(extraHeaders).length > 0 ? { headers: extraHeaders } : {}),
  };

  async function attemptOnce(
    fromValue: string,
    attemptLabel: string,
  ): Promise<
    | { ok: true; result: unknown; id: string | null }
    | { ok: false; error: string; result: unknown }
  > {
    try {
      const result = await resend.emails.send({
        from: fromValue,
        ...baseParams,
      });

      if (result && (result as any).error) {
        const err = (result as any).error as {
          message?: string;
          code?: string;
          statusCode?: number;
        };
        const msg = [
          "Resend rejected the email request.",
          err.code ? ` [Code: ${err.code}]` : "",
          err.statusCode ? ` [HTTP ${err.statusCode}]` : "",
          err.message ? ` — ${err.message}` : "",
          ` (${attemptLabel})`,
        ]
          .filter(Boolean)
          .join("");
        return { ok: false, error: msg, result };
      }

      return { ok: true, result, id: extractResultId(result) };
    } catch (thrownErr) {
      const msg =
        thrownErr instanceof Error
          ? `Resend SDK exception (${attemptLabel}): ${thrownErr.message}`
          : `Resend SDK exception (${attemptLabel}): ${String(thrownErr)}`;
      return { ok: false, error: msg, result: null };
    }
  }

  const validSenders: { label: string; from: string }[] = [];
  if (primaryCheck.ok && requestedFrom) {
    validSenders.push({ label: "primary sender", from: requestedFrom });
  } else if (requestedFrom) {
    console.warn(
      `[sendEmail] Skipping primary sender due to validation: ${
        primaryCheck.reason || "Unknown"
      }. Falling back to configured sender.`,
    );
  }
  if (fallbackCheck.ok && fallbackValue) {
    const alreadyAdded = validSenders.some((s) => s.from === fallbackValue);
    if (!alreadyAdded) {
      validSenders.push({ label: "RESEND_FROM fallback", from: fallbackValue });
    }
  }

  if (validSenders.length === 0) {
    const reasons: string[] = [];
    if (requestedFrom)
      reasons.push(
        `Primary="${requestedFrom}": ${primaryCheck.reason || "invalid"}`,
      );
    if (fallbackValue)
      reasons.push(
        `Fallback="${fallbackValue}": ${fallbackCheck.reason || "invalid"}`,
      );
    throw new Error(
      `No valid sender available for newsletters. ${reasons.join(" | ")}. Please verify that NEWSLETTER_FROM / RESEND_FROM uses a verified @tevextra.com address (not Gmail).`,
    );
  }

  let lastError: string = "";
  let lastSenderUsed: string = validSenders[0].from;

  for (let retry = 0; retry <= maxRetries; retry++) {
    if (retry > 0) {
      const baseDelayMs = 1500;
      const backoffMs = baseDelayMs * Math.pow(2, retry - 1);
      const jitterMs = Math.floor(Math.random() * 400);
      const wait = backoffMs + jitterMs;
      console.warn(
        `[sendEmail] Retry ${retry}/${maxRetries} for ${payload.to} after ${wait}ms backoff.`,
      );
      await sleep(wait);
    }

    let chainHadRateLimit = false;

    for (let si = 0; si < validSenders.length; si++) {
      const sender = validSenders[si];
      lastSenderUsed = sender.from;

      const attempt = await attemptOnce(sender.from, sender.label);
      if (attempt.ok) {
        console.log(
          `[sendEmail] ✅ Sent to ${payload.to} via ${sender.label} (from=${sender.from}, resend_id=${attempt.id || "unknown"}).`,
        );
        return { id: attempt.id, fromUsed: sender.from };
      }

      console.warn(
        `[sendEmail] ❌ Failed for ${payload.to} via ${sender.label} (retry=${retry}): ${attempt.error}`,
      );
      lastError = attempt.error;

      if (isRateLimitError(attempt.error)) {
        chainHadRateLimit = true;
        const perSenderCooldown =
          1200 * Math.pow(2, retry) + Math.floor(Math.random() * 500);
        if (si < validSenders.length - 1) {
          console.warn(
            `[sendEmail] 429 hit. Waiting ${perSenderCooldown}ms before trying next sender (${validSenders[si + 1].label}).`,
          );
          await sleep(perSenderCooldown);
        }
      } else {
        break;
      }
    }

    if (!chainHadRateLimit) {
      break;
    }
  }

  throw new Error(
    lastError && lastError.length > 0
      ? lastError
      : `Unable to deliver email to ${payload.to} after ${maxRetries + 1} attempts. Check Resend dashboard for additional details.`,
  );
}
