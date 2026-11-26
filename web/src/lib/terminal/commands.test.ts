import { describe, expect, it } from "vitest";
import { makeFixtureProfile } from "@/test/fixture-profile";
import { runCommand } from "./commands";
import { toTerminalData } from "./data";

const data = toTerminalData(makeFixtureProfile());
const out = (input: string) => runCommand(input, data).lines.join("\n");

describe("terminal commands", () => {
  it("help lists the commands", () => {
    for (const c of [
      "whoami",
      "ls products",
      "cat experience",
      "skills --tree",
      "agent <question>",
      "contact",
      "clear",
    ]) {
      expect(out("help")).toContain(c);
    }
  });

  it("whoami prints name and title from the profile, without the status", () => {
    expect(out("whoami")).toContain("Ada Fixture: Engineering Manager");
    expect(out("whoami")).not.toContain("status:");
    expect(out("whoami")).not.toContain("freelancing");
  });

  it("ls products lists every product", () => {
    expect(out("ls products")).toBe("FixtureGPT/  (Fixture Corp)");
  });

  it("cat experience prints the career log", () => {
    expect(out("cat experience")).toBe(
      "Jan 2021 – Present  Engineering Manager @ Fixture Corp\nMar 2015 – Dec 2020  Developer @ Old Startup",
    );
  });

  it("skills --tree prints a tree", () => {
    expect(out("skills --tree")).toBe(
      [
        "~/skills",
        "├── Leadership/",
        "│   ├── Hiring",
        "│   └── Mentoring",
        "└── Languages/",
        "    ├── Python",
        "    └── TypeScript",
      ].join("\n"),
    );
  });

  it("contact scrolls to the contact form", () => {
    expect(runCommand("contact", data).action).toEqual({ type: "scroll", target: "contact" });
  });

  it("clear clears the screen", () => {
    expect(runCommand("clear", data)).toEqual({ lines: [], action: { type: "clear" } });
  });

  it("agent passes the question on, or prints usage", () => {
    expect(runCommand("agent what do you build?", data).action).toEqual({
      type: "twin",
      question: "what do you build?",
    });
    expect(out("agent")).toBe("usage: agent <question>");
  });

  it("keeps twin as a legacy alias for agent", () => {
    expect(runCommand("twin what do you build?", data).action).toEqual({
      type: "twin",
      question: "what do you build?",
    });
  });

  it("has easter eggs", () => {
    expect(out("sudo make-coffee")).toContain("☕");
    expect(out("rm -rf /")).toContain("nice try");
  });

  it("prints command not found for unknown commands", () => {
    expect(out("hack the planet")).toBe("command not found: hack");
  });

  it("ignores empty input and extra whitespace", () => {
    expect(out("   ")).toBe("");
    expect(out("  ls    products ")).toBe("FixtureGPT/  (Fixture Corp)");
  });
});

describe("theme command", () => {
  const data = {
    name: "N",
    title: "T",
    tagline: "t",
    products: [],
    experience: [],
    skills: [],
  };

  it("lists themes", () => {
    const { lines, action } = runCommand("theme", data);
    expect(action).toBeUndefined();
    expect(lines.join("\n")).toMatch(/terminal/);
    expect(lines.join("\n")).toMatch(/mirage/);
  });

  it("switches to a known theme", () => {
    expect(runCommand("theme mirage", data).action).toEqual({ type: "theme", theme: "mirage" });
  });

  it("rejects an unknown theme", () => {
    const { lines, action } = runCommand("theme neon", data);
    expect(action).toBeUndefined();
    expect(lines[0]).toMatch(/unknown theme/);
  });

  it("is listed in help", () => {
    expect(runCommand("help", data).lines.join("\n")).toMatch(/theme \[name\]/);
  });
});
