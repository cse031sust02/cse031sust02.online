"use client";

import { MatrixRain } from "./MatrixRain";
import { useNerd } from "./NerdProvider";

/** Full-screen matrix rain behind the page, toggled by the Konami code or the palette. */
export function MatrixMode() {
  const { matrix } = useNerd();
  if (!matrix) return null;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-40" data-testid="matrix-mode">
      <MatrixRain className="size-full" />
    </div>
  );
}
