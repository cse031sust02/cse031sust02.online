import { renderAscii } from "@/lib/nerd/ascii-font";

const CELL = 10;

/**
 * Decorative block-letter first name (the real name is in the h1 below).
 * Drawn as SVG cells from the ASCII bitmap, so it's crisp at any width and font-independent.
 */
export function AsciiName({ name }: { name: string }) {
  const art = renderAscii(name.split(" ")[0] ?? name, "#");
  if (!art) return null;
  const rows = art.split("\n");
  const cols = rows[0].length;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${cols * CELL} ${rows.length * CELL}`}
      className="h-auto w-full max-w-md text-accent drop-shadow-[0_0_8px_var(--color-accent)]"
      data-testid="ascii-name"
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === "#" ? (
            <rect
              key={`${x}-${y}`}
              x={x * CELL + 0.5}
              y={y * CELL + 0.5}
              width={CELL - 1}
              height={CELL - 1}
              fill="currentColor"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
