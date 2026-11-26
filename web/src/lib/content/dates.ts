/** Content dates: "YYYY-MM", "present", or a plain year (number). */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const YEAR_MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export type ContentDate = string | number;

/** "2021-01" → "Jan 2021"; "present" → "Present"; 2014 → "2014". */
export function formatDate(value: ContentDate): string {
  if (typeof value === "number") return String(value);
  if (value === "present") return "Present";
  if (YEAR_MONTH_RE.test(value)) {
    const [year, month] = value.split("-");
    return `${MONTHS[Number(month) - 1]} ${year}`;
  }
  return value;
}

/** formatDateRange("2021-01", "2026-08") → "Jan 2021 – Aug 2026". A missing start shows only the end. */
export function formatDateRange(start: ContentDate | undefined, end: ContentDate): string {
  if (start === undefined) return formatDate(end);
  return `${formatDate(start)} – ${formatDate(end)}`;
}
