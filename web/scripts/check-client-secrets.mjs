// Fails if server-only secrets leak into client bundles (.next/static) or prerendered
// pages (.html/.rsc under .next/server/app).
// Usage: node scripts/check-client-secrets.mjs [dir ...]
// Checks for: the names of server-only env vars, the current values of those vars
// (when set, e.g. a canary key in CI), and anything shaped like an OpenRouter key.
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SECRET_ENV_NAMES = [
  "OPENROUTER_API_KEY",
  "SMTP_PASS",
  "SMTP_USER",
  "CONTACT_TO_EMAIL",
  "TURNSTILE_SECRET_KEY",
];
const KEY_PATTERN = /sk-or-v1-[A-Za-z0-9]{16,}/;

const PRERENDER_EXT = /\.(html|rsc|body|meta|segments)$/;

function* walk(dir, filter = () => true) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full, filter);
    else if (filter(full)) yield full;
  }
}

/**
 * Returns a list of "file: reason" findings.
 * @param {string} dir
 * @param {Record<string, string | undefined>} [env]
 * @param {(file: string) => boolean} [filter]
 */
export function findLeaks(dir, env = process.env, filter = () => true) {
  const values = SECRET_ENV_NAMES.map((n) => env[n]).filter((v) => v && v.length >= 6);
  const findings = [];
  for (const file of walk(dir, filter)) {
    const text = readFileSync(file, "utf8");
    for (const name of SECRET_ENV_NAMES)
      if (text.includes(name)) findings.push(`${file}: env name ${name}`);
    for (const value of values) if (text.includes(value)) findings.push(`${file}: secret value`);
    if (KEY_PATTERN.test(text)) findings.push(`${file}: OpenRouter-shaped key`);
  }
  return findings;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const findings = process.argv[2]
    ? process.argv.slice(2).flatMap((dir) => findLeaks(dir))
    : [
        ...findLeaks(".next/static"),
        ...findLeaks(".next/server/app", process.env, (f) => PRERENDER_EXT.test(f)),
      ];
  if (findings.length) {
    console.error(`[check-client-secrets] secrets found:\n${findings.join("\n")}`);
    process.exit(1);
  }
  console.log(
    "[check-client-secrets] OK: no server secrets in client bundles or prerendered pages",
  );
}
