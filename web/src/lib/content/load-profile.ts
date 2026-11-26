import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseProfile } from "./parse";
import type { Profile } from "./schema";

export const PROFILE_PATH = path.join(process.cwd(), "content", "profile.yaml");

let cached: Profile | undefined;

const readProfile = () =>
  parseProfile(readFileSync(PROFILE_PATH, "utf8"), "content/profile.yaml");

/**
 * Reads, validates and caches `content/profile.yaml` for the process lifetime. Server-only.
 * In `next dev` it re-reads on every call, so content edits show up on the next page load.
 */
export function getProfile(): Profile {
  if (process.env.NODE_ENV === "development") return readProfile();
  cached ??= readProfile();
  return cached;
}
