/**
 * Site navigation. Nav, footer and (later) the command palette and sitemap read
 * from this list, so adding /blog or /lab is a config change.
 */
export type NavItem = {
  /** Section id on the home page, or a route key. */
  id: string;
  label: string;
  href: string;
  /** Terminal flavour shown next to the section title. */
  command: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { id: "about", label: "About", href: "/#about", command: "cat about.md" },
  { id: "experience", label: "Experience", href: "/#experience", command: "git log --career" },
  { id: "products", label: "Products", href: "/#products", command: "ls ~/products" },
  { id: "skills", label: "Skills", href: "/#skills", command: "tree ~/skills" },
  { id: "twin", label: "Twin", href: "/#twin", command: "./twin --chat" },
  { id: "credentials", label: "Credentials", href: "/#credentials", command: "cat credentials" },
  { id: "contact", label: "Contact", href: "/#contact", command: "ping talha" },
];

export function navItem(id: string): NavItem {
  const item = NAV_ITEMS.find((i) => i.id === id);
  if (!item) throw new Error(`Unknown nav item: ${id}`);
  return item;
}
