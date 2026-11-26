import nodemailer, { type Transporter } from "nodemailer";

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
  to: string;
};

type Env = Record<string, string | undefined>;

/** SMTP config from env, or null when the contact form isn't configured. */
export function getMailConfig(env: Env = process.env): MailConfig | null {
  const host = env.SMTP_HOST?.trim();
  const to = env.CONTACT_TO_EMAIL?.trim();
  const from = (env.SMTP_FROM || env.SMTP_USER)?.trim();
  if (!host || !to || !from) return null;
  const port = Number(env.SMTP_PORT || 587);
  return {
    host,
    port,
    secure: env.SMTP_SECURE ? env.SMTP_SECURE === "true" : port === 465,
    user: env.SMTP_USER?.trim() || undefined,
    pass: env.SMTP_PASS || undefined,
    from,
    to,
  };
}

/** Removes characters that could break a mail header. */
export function headerSafe(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

export type ContactMessage = { name: string; email: string; message: string };

let cachedTransport: { key: string; transport: Transporter } | undefined;

function transportFor(config: MailConfig): Transporter {
  const key = `${config.host}:${config.port}:${config.user ?? ""}`;
  if (cachedTransport?.key !== key) {
    cachedTransport = {
      key,
      transport: nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.user ? { user: config.user, pass: config.pass } : undefined,
      }),
    };
  }
  return cachedTransport.transport;
}

/** Sends the visitor's message to CONTACT_TO_EMAIL with Reply-To set to the visitor. */
export async function sendContactEmail(config: MailConfig, msg: ContactMessage): Promise<void> {
  const name = headerSafe(msg.name);
  await transportFor(config).sendMail({
    from: { name: "cse031sust02.dev contact form", address: config.from },
    to: config.to,
    replyTo: { name, address: headerSafe(msg.email) },
    subject: `[cse031sust02.dev] Message from ${name}`,
    text: `From: ${name} <${headerSafe(msg.email)}>\n\n${msg.message}\n`,
  });
}
