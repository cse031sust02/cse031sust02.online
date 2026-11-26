import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TwinChat } from "@/components/twin/TwinChat";
import { TwinPageActions } from "@/components/twin/TwinPageActions";
import { getProfile } from "@/lib/content/load-profile";

export function generateMetadata(): Metadata {
  const { basics } = getProfile();
  return {
    title: "AI Agent",
    description: `Chat with ${basics.name}'s AI agent, built from the CV.`,
    alternates: { canonical: "/twin" },
  };
}

export default function TwinPage() {
  const { basics } = getProfile();
  return (
    <>
      <SiteHeader handle={basics.handle} />
      <main
        id="main"
        className="mx-auto flex h-[calc(100dvh-57px)] max-w-4xl flex-col px-0 sm:px-4 sm:py-4"
      >
        <h1 className="sr-only">Chat with the AI agent of {basics.name}</h1>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface shadow-glow sm:rounded-window sm:border sm:border-border">
          <TwinChat autoFocus className="flex-1" actions={<TwinPageActions />} />
        </div>
      </main>
    </>
  );
}
