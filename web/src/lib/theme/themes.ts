/** Site themes. The id is written to <html data-theme>; tokens per theme live in theme.css. */
export const THEMES = [
  { id: "terminal", label: "Terminal", description: "phosphor-green developer OS" },
  { id: "mirage", label: "Mirage", description: "desert night, gold and geometry" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "terminal";

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

/** The theme after `current`, wrapping around (used by the toggle buttons). */
export function nextTheme(current: ThemeId): ThemeId {
  const i = THEMES.findIndex((t) => t.id === current);
  return THEMES[(i + 1) % THEMES.length].id;
}

export function themeLabel(id: ThemeId): string {
  return THEMES.find((t) => t.id === id)!.label;
}
