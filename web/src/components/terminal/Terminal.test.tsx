import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { toTerminalData } from "@/lib/terminal/data";
import { makeFixtureProfile } from "@/test/fixture-profile";
import { Terminal } from "./Terminal";

function setup() {
  const user = userEvent.setup();
  render(<Terminal data={toTerminalData(makeFixtureProfile())} prompt="$" />);
  const input = screen.getByRole("textbox", { name: /terminal command/i });
  const log = screen.getByRole("log");
  return { user, input, log };
}

describe("Terminal", () => {
  it("runs commands and prints output", async () => {
    const { user, input, log } = setup();
    await user.type(input, "whoami{Enter}");
    expect(log).toHaveTextContent("Ada Fixture: Engineering Manager");
    await user.type(input, "nope{Enter}");
    expect(log).toHaveTextContent("command not found: nope");
  });

  it("cycles history with arrow keys", async () => {
    const { user, input } = setup();
    await user.type(input, "help{Enter}");
    await user.type(input, "whoami{Enter}");
    await user.keyboard("{ArrowUp}");
    expect(input).toHaveValue("whoami");
    await user.keyboard("{ArrowUp}");
    expect(input).toHaveValue("help");
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveValue("whoami");
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveValue("");
  });

  it("clear empties the screen", async () => {
    const { user, input, log } = setup();
    await user.type(input, "help{Enter}clear{Enter}");
    expect(log).toBeEmptyDOMElement();
  });

  it("agent prints a stub until the AI agent is connected", async () => {
    const { user, input, log } = setup();
    await user.type(input, "agent hello{Enter}");
    expect(await screen.findByText(/agent: offline/)).toBeInTheDocument();
    expect(log).toHaveTextContent("agent hello");
  });
});
