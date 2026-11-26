import { KHATAM_RATIO, starField, starPoints } from "@/lib/theme/geometry";

/*
 * Mirage hero art: a pointed (two-centred) arch framing a desert night — dusk sky, crescent,
 * a distant skyline, layered dunes — overlaid with a turquoise "constellation network" and
 * flowing data lines over the sand: heritage meets technology.
 * Decorative only. Colours come from theme tokens (--scene-*, --color-*) via inline styles.
 * Animations are CSS (globals.css, .mirage-*) and stop under prefers-reduced-motion.
 */

const W = 400;
const H = 520;

// Outer and inner pointed-arch outlines.
const ARCH_OUTER = `M14 ${H} V214 C14 118 104 50 200 14 C296 50 386 118 386 214 V${H} Z`;
const ARCH_INNER = `M28 ${H} V218 C28 128 112 66 200 32 C288 66 372 128 372 218 V${H} Z`;

const STARS = starField(46, { x: 40, y: 60, width: 320, height: 250 }, 31);

// Constellation network (tech layer): nodes and the edges between them.
const NODES: [number, number][] = [
  [86, 168],
  [132, 126],
  [178, 156],
  [226, 108],
  [250, 182],
  [306, 150],
  [154, 222],
  [286, 236],
];
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 5],
  [2, 4],
  [4, 5],
  [2, 6],
  [4, 7],
  [0, 6],
];

const DUNE_FAR = `M0 352 C70 328 132 336 196 350 C258 362 330 330 ${W} 340 V${H} H0 Z`;
const DUNE_MID = `M0 398 C84 370 166 384 246 402 C312 416 360 392 ${W} 396 V${H} H0 Z`;
const DUNE_NEAR = `M0 446 C76 424 160 432 232 456 C300 476 352 462 ${W} 440 V${H} H0 Z`;

// Data lines following the dune contours.
const FLOWS = [
  `M0 418 C84 394 166 404 246 420 C312 434 360 412 ${W} 414`,
  `M0 466 C76 446 160 452 232 474 C300 492 352 480 ${W} 460`,
  `M0 492 C90 474 170 480 240 498 C306 512 356 502 ${W} 486`,
];

// A low skyline on the horizon: domes and slender minarets.
const SKYLINE = [
  "M118 352 V338 H124 V352 Z", // base block
  "M121 338 V300 L122.5 290 L124 300 V338 Z", // minaret
  "M150 352 V336 C150 318 186 318 186 336 V352 Z", // dome drum
  "M168 318 V312",
  "M196 352 V342 C196 334 214 334 214 342 V352 Z",
  "M262 352 V340 H268 V352 Z",
  "M264 340 V306 L265 298 L266 306 V340 Z",
].join(" ");

const ROSETTE_C = { x: 200, y: 214 };

export function MirageScene() {
  const { x: rx, y: ry } = ROSETTE_C;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="mirage-scene h-auto w-full"
      data-testid="mirage-scene"
    >
      <defs>
        <linearGradient id="mirage-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--scene-sky-top)" }} />
          <stop offset="0.45" style={{ stopColor: "var(--scene-sky-mid)" }} />
          <stop offset="0.66" style={{ stopColor: "var(--scene-sky-low)" }} />
          <stop offset="0.72" style={{ stopColor: "var(--scene-horizon)" }} />
        </linearGradient>
        <radialGradient id="mirage-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "var(--scene-horizon)", stopOpacity: 0.9 }} />
          <stop offset="1" style={{ stopColor: "var(--scene-horizon)", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="mirage-dune-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--scene-dune-far)" }} />
          <stop offset="1" style={{ stopColor: "var(--scene-dune-shadow)" }} />
        </linearGradient>
        <linearGradient id="mirage-dune-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--scene-dune-mid)" }} />
          <stop offset="1" style={{ stopColor: "var(--scene-dune-shadow)" }} />
        </linearGradient>
        <linearGradient id="mirage-dune-near" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--scene-dune-near)" }} />
          <stop offset="1" style={{ stopColor: "var(--scene-dune-mid)" }} />
        </linearGradient>
        <linearGradient id="mirage-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-gold-light)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--color-accent)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-gold-deep)" }} />
        </linearGradient>
        <mask id="mirage-crescent">
          <circle cx="292" cy="104" r="22" fill="white" />
          <circle cx="303" cy="97" r="19" fill="black" />
        </mask>
        <clipPath id="mirage-arch">
          <path d={ARCH_INNER} />
        </clipPath>
        <filter id="mirage-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Rotating rosette halo behind the arch (mashrabiya / oculus). */}
      <g className="mirage-rosette" style={{ transformOrigin: `${rx}px ${ry}px` }}>
        <polygon
          points={starPoints(rx, ry, 196, 196 * 0.86, 16)}
          fill="none"
          stroke="url(#mirage-gold)"
          strokeWidth="0.8"
          opacity="0.35"
        />
        <polygon
          points={starPoints(rx, ry, 176, 176 * KHATAM_RATIO, 8)}
          fill="none"
          stroke="url(#mirage-gold)"
          strokeWidth="0.8"
          opacity="0.3"
        />
        <polygon
          points={starPoints(rx, ry, 176, 176 * KHATAM_RATIO, 8, -67.5)}
          fill="none"
          stroke="url(#mirage-gold)"
          strokeWidth="0.6"
          opacity="0.22"
        />
        <circle cx={rx} cy={ry} r="188" fill="none" stroke="url(#mirage-gold)" opacity="0.18" />
      </g>

      {/* Inside the arch: the desert night. */}
      <g clipPath="url(#mirage-arch)">
        <rect width={W} height={H} fill="url(#mirage-sky)" />
        <ellipse cx="200" cy="356" rx="190" ry="70" fill="url(#mirage-glow)" opacity="0.55" />

        <g style={{ fill: "var(--scene-star)" }}>
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              className="mirage-twinkle"
              style={{ animationDelay: `${s.delay}s` }}
            />
          ))}
        </g>

        {/* Crescent with a soft glow. */}
        <circle
          cx="292"
          cy="104"
          r="22"
          style={{ fill: "var(--scene-moon)" }}
          mask="url(#mirage-crescent)"
          filter="url(#mirage-blur)"
          opacity="0.6"
        />
        <circle
          cx="292"
          cy="104"
          r="22"
          style={{ fill: "var(--scene-moon)" }}
          mask="url(#mirage-crescent)"
        />

        {/* Constellation network. */}
        <g
          className="mirage-network"
          style={{ stroke: "var(--color-accent-2)" }}
          strokeWidth="0.8"
          fill="none"
        >
          {EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={NODES[a][0]}
              y1={NODES[a][1]}
              x2={NODES[b][0]}
              y2={NODES[b][1]}
              pathLength={1}
              className="mirage-edge"
              style={{ animationDelay: `${0.4 + i * 0.12}s` }}
            />
          ))}
        </g>
        <g style={{ fill: "var(--color-accent-2)" }}>
          {NODES.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="2" />
              <circle
                cx={x}
                cy={y}
                r="2"
                className="mirage-pulse"
                style={{ animationDelay: `${i * 0.5}s`, transformOrigin: `${x}px ${y}px` }}
                opacity="0.6"
              />
            </g>
          ))}
        </g>

        <path d={SKYLINE} style={{ fill: "var(--scene-skyline)" }} opacity="0.85" />
        <path d={DUNE_FAR} fill="url(#mirage-dune-far)" />
        <path d={DUNE_MID} fill="url(#mirage-dune-mid)" />
        <path d={DUNE_NEAR} fill="url(#mirage-dune-near)" />

        <g fill="none" stroke="url(#mirage-gold)" strokeWidth="0.9" strokeLinecap="round">
          {FLOWS.map((d, i) => (
            <path
              key={i}
              d={d}
              className="mirage-flow"
              style={{ animationDelay: `${i * -1.3}s` }}
              opacity={0.75 - i * 0.15}
            />
          ))}
        </g>
      </g>

      {/* Double gold frame + keystone star. */}
      <path d={ARCH_OUTER} fill="none" stroke="url(#mirage-gold)" strokeWidth="1.6" />
      <path d={ARCH_INNER} fill="none" stroke="url(#mirage-gold)" strokeWidth="0.7" opacity="0.6" />
      <polygon
        points={starPoints(200, 14, 9, 9 * KHATAM_RATIO, 8)}
        fill="url(#mirage-gold)"
        style={{ stroke: "var(--color-bg)" }}
        strokeWidth="1"
      />
    </svg>
  );
}
