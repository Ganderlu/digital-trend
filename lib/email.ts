type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export async function sendEmail(payload: EmailPayload) {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const fallbackFrom = process.env.FALLBACK_RESEND_FROM;
  const configuredFrom = process.env.RESEND_FROM || fallbackFrom;
  const from = payload.from || configuredFrom;

  if (!apiKey) {
    throw new Error(
      "Resend is not configured: missing RESEND_API_KEY environment variable.",
    );
  }

  if (!from) {
    throw new Error(
      "Resend sender is not configured: set RESEND_FROM in your environment variables (e.g. 'TeveXtra <help@yourdomain.com>').",
    );
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const result = await resend.emails.send({
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    ...(typeof payload.text === "string" ? { text: payload.text } : {}),
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
    ]
      .filter(Boolean)
      .join("");
    throw new Error(msg);
  }

  return result;
}
