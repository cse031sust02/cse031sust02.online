import { NAV_ITEMS } from "@/config/nav";

export type PaletteAction =
  | { type: "scroll"; target: string }
  | { type: "open"; url: string }
  | { type: "open-twin" }
  | { type: "toggle-crt" }
  | { type: "cycle-theme" }
  | { type: "toggle-matrix" };

export type PaletteItem = {
  id: string;
  label: string;
  hint: string;
  action: PaletteAction;
};

/** Palette entries: every nav section, the profile links, and the nerd toggles. */
export function buildPaletteItems(links: { label: string; url: string }[]): PaletteItem[] {
  return [
    ...NAV_ITEMS.map((item) => ({
      id: `go-${item.id}`,
      label: `Go to ${item.label}`,
      hint: item.command,
      action: { type: "scroll", target: item.id } as const,
    })),
    ...links.map((link) => ({
      id: `open-${link.label.toLowerCase()}`,
      label: `open ${link.label.toLowerCase()}`,
      hint: link.url.replace(/^https?:\/\//, ""),
      action: { type: "open", url: link.url } as const,
    })),
    {
      id: "contact",
      label: "contact: send me a message",
      hint: "ping talha",
      action: { type: "scroll", target: "contact" },
    },
    {
      id: "twin",
      label: "agent: chat with my AI agent",
      hint: "./agent --chat",
      action: { type: "open-twin" },
    },
    {
      id: "theme",
      label: "theme: switch Terminal ⇄ Mirage",
      hint: "theme",
      action: { type: "cycle-theme" },
    },
    {
      id: "theme-crt",
      label: "crt: toggle CRT scanlines",
      hint: "crt",
      action: { type: "toggle-crt" },
    },
    {
      id: "matrix",
      label: "matrix: toggle matrix mode",
      hint: "↑↑↓↓←→←→BA",
      action: { type: "toggle-matrix" },
    },
  ];
}
