import Link from "next/link";
import { PaletteButton } from "@/components/nerd/PaletteButton";
import { ThemeSwitch } from "@/components/nerd/ThemeSwitch";
import { NAV_ITEMS } from "@/config/nav";

export function SiteHeader({ handle }: { handle: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 font-mono text-sm"
      >
        <Link href="/#top" className="brand-mark shrink-0 font-bold text-accent text-glow">
          ~/{handle}
        </Link>
        <ul className="flex min-w-0 flex-1 gap-4 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="text-muted transition-colors hover:text-accent">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ThemeSwitch />
        <PaletteButton />
      </nav>
    </header>
  );
}
