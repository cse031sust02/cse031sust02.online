/**
 * Scrolls to a home-page section (honouring reduced motion) and focuses its [data-autofocus] control.
 * Returns false when the section isn't on the current page (caller should navigate to /#id).
 */
export function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
  // Sections can mark the control that should receive focus (e.g. the contact form's first field).
  el.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
  return true;
}
