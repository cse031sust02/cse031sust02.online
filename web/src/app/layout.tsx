import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { BootSequence } from "@/components/nerd/BootSequence";
import { CommandPalette } from "@/components/nerd/CommandPalette";
import { MatrixMode } from "@/components/nerd/MatrixMode";
import { NerdProvider } from "@/components/nerd/NerdProvider";
import { ScanlineOverlay } from "@/components/nerd/ScanlineOverlay";
import { PREPAINT_SCRIPT } from "@/components/nerd/storage";
import { TwinLauncher } from "@/components/twin/TwinLauncher";
import { TwinProvider } from "@/components/twin/TwinProvider";
import { getProfile } from "@/lib/content/load-profile";
import { suggestedPrompts } from "@/lib/twin/suggested-prompts";
import "@/styles/globals.css";

const mono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });
const sans = Inter({ variable: "--font-inter", subsets: ["latin"] });

// Loading the profile here validates content/profile.yaml at build time:
// an invalid file fails `npm run build` with a readable error.
export function generateMetadata(): Metadata {
  const { basics } = getProfile();
  return {
    title: `${basics.name} | TalhaOS`,
    description: basics.tagline,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const profile = getProfile();
  const bootLines = [
    `Loading profile: ${profile.basics.name}`,
    `Mounting ~/experience (${profile.experience.length} commits)`,
    `Mounting ~/products (${profile.products.length})`,
    "Starting twin daemon",
    "Welcome to TalhaOS",
  ];
  const links = profile.links.map(({ label, url }) => ({ label, url }));

  return (
    // The pre-paint script sets data-booted / data-crt on <html> before hydration.
    <html
      lang="en"
      className={`${mono.variable} ${sans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body className="min-h-dvh">
        <NerdProvider>
          <TwinProvider
            prompts={suggestedPrompts(profile)}
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
