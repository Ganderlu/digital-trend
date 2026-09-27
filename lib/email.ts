type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
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

export async function sendEmail(payload: EmailPayload) {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const fallbackFrom = process.env.FALLBACK_RESEND_FROM;
  const configuredFrom = process.env.RESEND_FROM || fallbackFrom;
  const requestedFrom = payload.from || configuredFrom;
  const replyTo = payload.replyTo || process.env.SUPPORT_EMAIL || undefined;

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

  function validateFrom(candidate: string): { ok: boolean; reason?: string; address: string | null } {
    const address = extractAddress(candidate);
    if (!address) return { ok: false, reason: `Invalid from format: ${candidate}`, address: null };
    const domain = extractDomain(address);
    if (!domain) return { ok: false, reason: `Could not parse sender domain from: ${candidate}`, address };
    const gmail = /gmail\.com$/i.test(domain) || /googlemail\.com$/i.test(domain);
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

  const primaryCheck = validateFrom(requestedFrom);
  const baseParams = {
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    ...(typeof payload.text === "string" ? { text: payload.text } : {}),
    ...(replyTo && isValidEmailLike(replyTo) ? { reply_to: replyTo } : {}),
  };

  async function attempt(fromValue: string, attemptLabel: string) {
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
      return { ok: false as const, error: msg, result };
    }
    return { ok: true as const, result };
  }

  if (primaryCheck.ok && requestedFrom) {
    const primaryAttempt = await attempt(requestedFrom, "primary sender");
    if (primaryAttempt.ok) return primaryAttempt.result;
    console.warn(
      `[sendEmail] Primary sender failed. Requested="${requestedFrom}". Reason: ${
        typeof primaryAttempt.error === "string" ? primaryAttempt.error : "Unknown"
      }. Retrying with RESEND_FROM fallback.`,
    );
  } else if (requestedFrom) {
    console.warn(
      `[sendEmail] Skipping primary sender due to validation: ${
        primaryCheck.reason || "Unknown"
      }. Falling back to RESEND_FROM.`,
    );
  }

  const fallbackValue = configuredFrom;
  if (!fallbackValue) {
    throw new Error(
      `No valid sender available. Primary sender validation failed (${
        primaryCheck.reason || "invalid"
      }) and no RESEND_FROM / FALLBACK_RESEND_FROM is set.`,
    );
  }
  const fallbackCheck = validateFrom(fallbackValue);
  if (!fallbackCheck.ok) {
    throw new Error(
      `Fallback sender also invalid. Fallback="${fallbackValue}". Reason: ${
        fallbackCheck.reason || "Invalid format"
      }. Primary sender="${requestedFrom || "(none)"}". Primary reason: ${
        primaryCheck.reason || "—"
      }.`,
    );
  }

  const fallbackAttempt = await attempt(fallbackValue, "RESEND_FROM fallback");
  if (!fallbackAttempt.ok) {
    throw new Error(
      typeof fallbackAttempt.error === "string"
        ? fallbackAttempt.error
        : "Both primary and fallback senders failed.",
    );
  }
  return fallbackAttempt.result;
}
