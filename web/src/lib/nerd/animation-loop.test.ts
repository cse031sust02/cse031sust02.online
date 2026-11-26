import { describe, expect, it, vi } from "vitest";
import { createAnimationLoop, createVisibilityHandler } from "./animation-loop";

function fakeRaf() {
  let next = 1;
  const pending = new Map<number, FrameRequestCallback>();
  return {
    raf: (cb: FrameRequestCallback) => {
      pending.set(next, cb);
      return next++;
    },
    caf: (id: number) => pending.delete(id),
    tick(time: number) {
      const cbs = [...pending.values()];
      pending.clear();
      cbs.forEach((cb) => cb(time));
    },
    get size() {
      return pending.size;
    },
  };
}

describe("animation loop", () => {
  it("steps at the capped fps and stops cleanly", () => {
    const clock = fakeRaf();
    const step = vi.fn();
    const loop = createAnimationLoop(step, { fps: 10, raf: clock.raf, caf: clock.caf });
    loop.start();
    clock.tick(0);
    clock.tick(50); // too soon at 10fps
    clock.tick(100);
    expect(step).toHaveBeenCalledTimes(2);
    loop.stop();
    expect(loop.running).toBe(false);
    expect(clock.size).toBe(0);
  });

  it("stops when the tab is hidden and resumes when visible", () => {
    const clock = fakeRaf();
    const loop = createAnimationLoop(() => {}, { raf: clock.raf, caf: clock.caf });
    const doc = { hidden: false };
    const onVisibility = createVisibilityHandler(loop, doc);
    loop.start();

    doc.hidden = true;
    onVisibility();
    expect(loop.running).toBe(false);

    doc.hidden = false;
    onVisibility();
    expect(loop.running).toBe(true);
  });

  it("does not resume when visible but not allowed to run (e.g. off-screen)", () => {
    const clock = fakeRaf();
    const loop = createAnimationLoop(() => {}, { raf: clock.raf, caf: clock.caf });
    const onVisibility = createVisibilityHandler(loop, { hidden: false }, () => false);
    onVisibility();
    expect(loop.running).toBe(false);
  });
});
