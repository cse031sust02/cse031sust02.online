import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getProfile } from "@/lib/content/load-profile";
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
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
