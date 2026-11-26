import type { Metadata } from "next";
import { Aref_Ruqaa, Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import { BootSequence } from "@/components/nerd/BootSequence";
import { CommandPalette } from "@/components/nerd/CommandPalette";
import { MatrixMode } from "@/components/nerd/MatrixMode";
import { NerdProvider } from "@/components/nerd/NerdProvider";
import { ScanlineOverlay } from "@/components/nerd/ScanlineOverlay";
import { PREPAINT_SCRIPT } from "@/components/nerd/storage";
import { TwinLauncher } from "@/components/twin/TwinLauncher";
import { TwinProvider } from "@/components/twin/TwinProvider";
import { getProfile } from "@/lib/content/load-profile";
import { getSiteUrl } from "@/lib/site";
import { suggestedPrompts } from "@/lib/twin/suggested-prompts";
import "@/styles/globals.css";

const mono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });
const sans = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Mirage theme fonts. Not preloaded: browsers fetch them only when the Mirage theme uses them.
const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  preload: false,
});
const calligraphy = Aref_Ruqaa({
  variable: "--font-aref-ruqaa",
  subsets: ["arabic"],
  weight: ["700"],
  preload: false,
});

// Loading the profile here validates content/profile.yaml at build time:
// an invalid file fails `npm run build` with a readable error.
export function generateMetadata(): Metadata {
  const { basics } = getProfile();
  const defaultTitle = `${basics.name}: ${basics.title} | cse031sust02`;
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: defaultTitle, template: `%s | ${basics.name}` },
    description: `${basics.tagline} ${basics.summary}`.slice(0, 300),
    applicationName: "cse031sust02",
    authors: [{ name: basics.name }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "profile",
      url: "/",
      siteName: "cse031sust02.online",
      title: defaultTitle,
      description: basics.tagline,
    },
    twitter: { card: "summary_large_image", title: defaultTitle, description: basics.tagline },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const profile = getProfile();
  const promptSet = suggestedPrompts(profile);
  const bootLines = [
    `Loading profile: ${profile.basics.name}`,
    `Mounting ~/experience (${profile.experience.length} commits)`,
    `Mounting ~/products (${profile.products.length})`,
    "Starting agent daemon",
    "Welcome to cse031sust02",
  ];
  const links = profile.links.map(({ label, url }) => ({ label, url }));

  return (
    // The pre-paint script sets data-booted / data-crt / data-theme on <html> before hydration.
    <html
      lang="en"
      className={`${mono.variable} ${sans.variable} ${display.variable} ${calligraphy.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body className="min-h-dvh">
        <NerdProvider>
          <TwinProvider
            prompts={promptSet.pool}
            pinnedPrompts={promptSet.pinned}
            ownerName={profile.basics.name.split(" ")[0]}
          >
            <BootSequence lines={bootLines} />
            {children}
            <MatrixMode />
            <TwinLauncher />
            <CommandPalette links={links} />
            <ScanlineOverlay />
          </TwinProvider>
        </NerdProvider>
      </body>
    </html>
  );
}
