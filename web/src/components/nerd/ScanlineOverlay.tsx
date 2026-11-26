/** CRT scanlines. Hidden via CSS when html[data-crt="off"] or prefers-reduced-motion. */
export function ScanlineOverlay() {
  return <div aria-hidden="true" className="crt-overlay" data-testid="scanlines" />;
}
