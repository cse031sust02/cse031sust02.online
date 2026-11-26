import type { Metadata } from "next";
import Link from "next/link";
import { WindowCard } from "@/components/ui/WindowCard";

export const metadata: Metadata = { title: "404: command not found" };

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center p-4">
      <WindowCard title="~ — zsh" className="w-full max-w-xl">
        <h1 className="font-mono text-2xl font-bold text-highlight">404: command not found</h1>
        <p className="mt-4 font-mono text-sm text-muted">
          <span className="text-accent">visitor@talhaos</span>:~$ cd this-page
          <br />
          zsh: no such file or directory
        </p>
        <p className="mt-6">
          <Link href="/" className="font-mono text-accent-2 hover:underline">
            cd ~ (back to the home page)
          </Link>
        </p>
      </WindowCard>
    </main>
  );
}
