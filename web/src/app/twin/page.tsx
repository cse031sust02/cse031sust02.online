import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TwinChat } from "@/components/twin/TwinChat";
import { WindowCard } from "@/components/ui/WindowCard";
import { getProfile } from "@/lib/content/load-profile";

export function generateMetadata(): Metadata {
  const { basics } = getProfile();
  return {
    title: `Digital Twin | ${basics.name}`,
    description: `Chat with an AI twin of ${basics.name}, built from the CV.`,
  };
}

export default function TwinPage() {
  const { basics } = getProfile();
  return (
    <>
      <SiteHeader handle={basics.handle} />
      <main id="main" className="mx-auto flex h-[calc(100dvh-57px)] max-w-3xl flex-col px-4 py-4">
        <h1 className="mb-3 font-mono text-xl font-bold text-fg">
          <span className="text-accent">$</span> ./twin --chat
          <span className="sr-only">: chat with the digital twin of {basics.name}</span>
        </h1>
        <WindowCard
          title="~/twin — chat"
          className="flex min-h-0 flex-1 flex-col [&>div:last-child]:flex [&>div:last-child]:min-h-0 [&>div:last-child]:flex-1 [&>div:last-child]:p-0"
        >
          <TwinChat autoFocus className="flex-1" />
        </WindowCard>
      </main>
    </>
  );
}
