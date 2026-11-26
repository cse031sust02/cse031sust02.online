import { describe, expect, it } from "vitest";
import { emptyHistory, historyDown, historyUp, pushHistory } from "./history";

describe("terminal history", () => {
  it("cycles with up and down", () => {
    let h = pushHistory(pushHistory(emptyHistory, "whoami"), "help");

    let r = historyUp(h);
    expect(r.value).toBe("help");
    r = historyUp(r.history);
    expect(r.value).toBe("whoami");
    r = historyUp(r.history);
    expect(r.value).toBe("whoami"); // stays at the oldest

    let d = historyDown(r.history);
    expect(d.value).toBe("help");
    d = historyDown(d.history);
    expect(d.value).toBe(""); // back to a fresh line
    h = d.history;
    expect(h.index).toBe(2);
  });

  it("skips blanks and consecutive duplicates", () => {
    const h = pushHistory(pushHistory(pushHistory(emptyHistory, "ls"), "ls"), "  ");
    expect(h.entries).toEqual(["ls"]);
  });

  it("up on empty history does nothing", () => {
    expect(historyUp(emptyHistory).value).toBeUndefined();
  });
});
