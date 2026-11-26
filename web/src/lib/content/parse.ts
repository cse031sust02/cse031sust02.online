import { parse as parseYaml } from "yaml";
import type { z } from "zod";
import { type Profile, profileSchema } from "./schema";

export class ProfileValidationError extends Error {
  constructor(
    public readonly issues: string[],
    source: string,
  ) {
    super(`Invalid content in ${source}:\n${issues.map((i) => `  • ${i}`).join("\n")}`);
    this.name = "ProfileValidationError";
  }
}

/** ["experience", 1, "start"] → "experience[1].start" */
export function formatPath(path: ReadonlyArray<PropertyKey>): string {
  return path
    .map((segment, i) =>
      typeof segment === "number" ? `[${segment}]` : `${i === 0 ? "" : "."}${String(segment)}`,
    )
    .join("");
}

function formatIssue(issue: z.core.$ZodIssue): string {
  const path = formatPath(issue.path);
  if (issue.code === "unrecognized_keys") {
    const keys = issue.keys.map((k) => `${path ? `${path}.` : ""}${k}`).join(", ");
    return `${keys}: unknown field (typo?)`;
  }
  const isMissing = issue.code === "invalid_type" && issue.input === undefined;
  return `${path || "(root)"}: ${isMissing ? "required field is missing" : issue.message}`;
}

/** Parse + validate profile YAML text. Throws ProfileValidationError with readable, path-named issues. */
export function parseProfile(yamlText: string, source = "profile.yaml"): Profile {
  let data: unknown;
  try {
    data = parseYaml(yamlText);
  } catch (error) {
    throw new ProfileValidationError([`YAML syntax error: ${(error as Error).message}`], source);
  }
  const result = profileSchema.safeParse(data);
  if (!result.success) {
    throw new ProfileValidationError(result.error.issues.map(formatIssue), source);
  }
  return result.data;
}
