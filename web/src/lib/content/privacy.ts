/**
 * Privacy guard: the content file is public, so no string in it may look like
 * an email address or a phone number.
 */

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

// A run of digits and phone punctuation that isn't glued to letters/digits
// (so IDs inside URLs or hashes don't match).
const PHONE_CANDIDATE_RE = /(?<![\w+])\+?\(?\d[\d\s().-]{5,}\d(?![\w])/g;

function isUrl(value: string): boolean {
  return /^https?:\/\/\S+$/i.test(value.trim());
}

export function containsEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

export function containsPhone(value: string): boolean {
  if (isUrl(value)) return false;
  for (const match of value.matchAll(PHONE_CANDIDATE_RE)) {
    const candidate = match[0];
    const digits = candidate.replace(/\D/g, "").length;
    // International format (+880…) from 8 digits; otherwise 10+ digits.
    // Year ranges like "2003-2008" (8 digits) are not phone numbers.
    if (candidate.startsWith("+") ? digits >= 8 : digits >= 10) return true;
  }
  return false;
}

/** Returns a reason when the string looks like private contact data, else null. */
export function privacyViolation(value: string): string | null {
  if (containsEmail(value)) return "must not contain an email address (the file is public)";
  if (containsPhone(value)) return "must not contain a phone number (the file is public)";
  return null;
}
