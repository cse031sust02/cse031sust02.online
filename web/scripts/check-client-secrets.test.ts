// @vitest-environment node
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findLeaks } from "./check-client-secrets.mjs";

function dirWith(content: string) {
  const dir = mkdtempSync(path.join(tmpdir(), "bundle-"));
  writeFileSync(path.join(dir, "chunk.js"), content);
  return dir;
}

describe("check-client-secrets", () => {
  it("passes a clean bundle", () => {
    expect(findLeaks(dirWith("console.log('hi')"), {})).toEqual([]);
  });
  it("flags secret values, env names and key-shaped strings", () => {
    const env = { OPENROUTER_API_KEY: "canary-value-123" };
    expect(findLeaks(dirWith("x='canary-value-123'"), env)).toHaveLength(1);
    expect(findLeaks(dirWith("process.env.SMTP_PASS"), {})).toHaveLength(1);
    expect(findLeaks(dirWith("'sk-or-v1-abcdefghijklmnopqrstuvwxyz'"), {})).toHaveLength(1);
  });
});
