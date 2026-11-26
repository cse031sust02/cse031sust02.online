"use client";

import { useRouter } from "next/navigation";
import { useTwin } from "./TwinProvider";

/** Header control on /twin: minimize back to the home page's side-panel chat. */
export function TwinPageActions() {
  const { setOpen, setExpanded } = useTwin();
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        setExpanded(false);
        setOpen(true);
        router.push("/");
      }}
      className="rounded-chip p-1.5 text-muted hover:text-accent"
      title="Minimize"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none">
        <path
          d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">Minimize chat</span>
    </button>
  );
}
