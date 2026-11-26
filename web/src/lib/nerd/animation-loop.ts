/** A requestAnimationFrame loop with an fps cap that can be paused and resumed. */
export type AnimationLoop = {
  start(): void;
  stop(): void;
  readonly running: boolean;
};

type LoopOptions = {
  fps?: number;
  raf?: (cb: FrameRequestCallback) => number;
  caf?: (id: number) => void;
};

export function createAnimationLoop(
  step: (time: number) => void,
  options: LoopOptions = {},
): AnimationLoop {
  const raf = options.raf ?? ((cb) => requestAnimationFrame(cb));
  const caf = options.caf ?? ((id) => cancelAnimationFrame(id));
  const interval = 1000 / (options.fps ?? 30);
  let id: number | null = null;
  let last = -Infinity;

  const frame = (time: number) => {
    id = raf(frame);
    if (time - last >= interval) {
      last = time;
      step(time);
    }
  };

  return {
    start() {
      if (id === null) id = raf(frame);
    },
    stop() {
      if (id !== null) {
        caf(id);
        id = null;
      }
    },
    get running() {
      return id !== null;
    },
  };
}

/**
 * Builds a `visibilitychange` handler: the loop stops while the tab is hidden and
 * resumes when it is visible again (if `canRun()` still allows it, e.g. in view).
 */
export function createVisibilityHandler(
  loop: AnimationLoop,
  doc: Pick<Document, "hidden">,
  canRun: () => boolean = () => true,
) {
  return () => {
    if (doc.hidden) loop.stop();
    else if (canRun()) loop.start();
  };
}
