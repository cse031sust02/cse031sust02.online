import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseProfile } from "./parse";
import type { Profile } from "./schema";

export const PROFILE_PATH = path.join(process.cwd(), "content", "profile.yaml");

let cached: Profile | undefined;

/** Reads, validates and caches `content/profile.yaml` for the process lifetime. Server-only. */
export function getProfile(): Profile {
  cached ??= parseProfile(readFileSync(PROFILE_PATH, "utf8"), "content/profile.yaml");
  return cached;
}
