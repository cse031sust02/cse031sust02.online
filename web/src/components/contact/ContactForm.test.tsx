import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "./ContactForm";

afterEach(() => vi.unstubAllGlobals());

describe("ContactForm", () => {
  it("shows per-field errors inline without calling the API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText("$ email"), "nope");
    await user.click(screen.getByRole("button", { name: "./send" }));
    expect(screen.getByText(/valid email/)).toBeInTheDocument();
    expect(screen.getByText(/enter your name/)).toBeInTheDocument();
    expect(screen.getByLabelText("$ name")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("$ name")).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows server field errors and the unavailable message", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json(
          { error: "invalid_request", fields: { email: "Server says no." } },
          { status: 400 },
        ),
      )
      .mockResolvedValueOnce(Response.json({ error: "contact_unavailable" }, { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText("$ name"), "Grace");
    await user.type(screen.getByLabelText("$ email"), "grace@example.org");
    await user.type(screen.getByLabelText("$ message"), "Hello there, nice site!");
    await user.click(screen.getByRole("button", { name: "./send" }));
    expect(await screen.findByText(/Server says no/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "./send" }));
    expect(await screen.findByText(/contact temporarily unavailable/i)).toBeInTheDocument();
  });

  it("has a honeypot hidden from assistive tech", () => {
    const { container } = render(<ContactForm />);
    const honeypot = container.querySelector('input[name="website"]')!;
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
