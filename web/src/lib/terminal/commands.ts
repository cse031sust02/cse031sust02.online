import type { TerminalData } from "./data";

export type TerminalAction =
  { type: "clear" } | { type: "scroll"; target: string } | { type: "twin"; question: string };

export type CommandResult = {
  lines: string[];
  action?: TerminalAction;
};

export const HELP_LINES = [
  "Available commands:",
  "  help             show this help",
  "  whoami           who is this?",
  "  ls products      list products",
  "  cat experience   career log",
  "  skills --tree    skills as a tree",
  "  agent <question> ask my AI agent",
  "  contact          open the contact form",
  "  clear            clear the screen",
  "Shortcuts: ↑/↓ history · ⌘K / Ctrl+K command palette",
];

/** Renders skills as a `tree` listing. */
export function skillsTree(skills: TerminalData["skills"]): string[] {
  const lines = ["~/skills"];
  skills.forEach((group, gi) => {
    const lastGroup = gi === skills.length - 1;
    lines.push(`${lastGroup ? "└── " : "├── "}${group.group}/`);
    group.items.forEach((item, ii) => {
      const lastItem = ii === group.items.length - 1;
      lines.push(`${lastGroup ? "    " : "│   "}${lastItem ? "└── " : "├── "}${item}`);
    });
  });
  return lines;
}

/** Pure command interpreter for the interactive terminal. */
export function runCommand(rawInput: string, data: TerminalData): CommandResult {
  const input = rawInput.trim().replace(/\s+/g, " ");
  if (input === "") return { lines: [] };
  const [cmd, ...args] = input.split(" ");
  const rest = args.join(" ");

  switch (cmd) {
    case "help":
      return { lines: HELP_LINES };
    case "whoami":
      return { lines: [`${data.name}: ${data.title}`, data.tagline, `status: ${data.status}`] };
    case "ls":
      if (rest === "products" || rest === "~/products") {
        return { lines: data.products.map((p) => `${p.name}/  (${p.company})`) };
      }
      if (rest === "") return { lines: ["products/  experience  skills  about.md  credentials"] };
      return { lines: [`ls: cannot access '${rest}': No such file or directory`] };
    case "cat":
      if (rest === "experience") {
        return { lines: data.experience.map((e) => `${e.dates}  ${e.role} @ ${e.company}`) };
      }
      if (rest === "") return { lines: ["usage: cat <file>   (try: cat experience)"] };
      return { lines: [`cat: ${rest}: No such file or directory`] };
    case "skills":
      if (rest === "--tree" || rest === "") return { lines: skillsTree(data.skills) };
      return { lines: [`skills: unknown option '${rest}'. Try: skills --tree`] };
    case "contact":
      return {
        lines: ["Opening the contact form…"],
        action: { type: "scroll", target: "contact" },
      };
    case "clear":
      return { lines: [], action: { type: "clear" } };
    case "agent":
    case "twin": // legacy alias
      if (rest === "") return { lines: ["usage: agent <question>"] };
      return { lines: [], action: { type: "twin", question: rest } };
    case "sudo":
      if (rest === "make-coffee") {
        return { lines: ["[sudo] password for visitor: ********", "Brewing… ☕ Done. Enjoy!"] };
      }
      return { lines: ["visitor is not in the sudoers file. This incident will be reported. 🙂"] };
    case "rm":
      if (/^-(rf|fr) \/?$/.test(rest) || rest === "-rf /*") {
        return { lines: ["rm: nice try. TalhaOS is read-only for visitors. 🛡️"] };
      }
      return { lines: ["rm: permission denied"] };
    default:
      return { lines: [`command not found: ${cmd}`] };
  }
}
