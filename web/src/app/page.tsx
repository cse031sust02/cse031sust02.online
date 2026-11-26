import { WindowCard } from "@/components/ui/WindowCard";

export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <WindowCard title="~ — zsh" className="w-full max-w-xl">
        <p className="font-mono text-sm sm:text-base">
          <span className="text-accent text-glow">talha@cse031sust02</span>
          <span className="text-muted">:</span>
          <span className="text-accent-2">~</span>
          <span className="text-muted">$ </span>
          <span>booting…</span>
          <span aria-hidden="true" className="cursor-blink text-accent">
            ▋
          </span>
        </p>
      </WindowCard>
    </main>
  );
}
