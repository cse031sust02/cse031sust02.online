import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Markdown } from "./Markdown";

describe("Markdown", () => {
  it("renders bold, italic, code, lists and links", () => {
    const { container } = render(
      <Markdown
        text={
          "Hi **there**, *you* use `npm`.\n\n- one\n- two\n\n1. first\n\n[GitHub](https://github.com)"
        }
      />,
    );
    expect(container.querySelector("strong")).toHaveTextContent("there");
    expect(container.querySelector("em")).toHaveTextContent("you");
    expect(container.querySelector("code")).toHaveTextContent("npm");
    expect(container.querySelectorAll("ul li")).toHaveLength(2);
    expect(container.querySelectorAll("ol li")).toHaveLength(1);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("href", "https://github.com");
    expect(link).toHaveAttribute("rel", "noopener noreferrer nofollow");
  });

  it("never renders raw HTML: a <script> stays text and is not executed", () => {
    const w = window as unknown as { __pwned?: boolean };
    const { container } = render(
      <Markdown
        text={'<script>window.__pwned = true</script><img src=x onerror="window.__pwned=true">'}
      />,
    );
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container).toHaveTextContent("<script>window.__pwned = true</script>");
    expect(w.__pwned).toBeUndefined();
  });

  it("drops non-http links (javascript:)", () => {
    const { container } = render(<Markdown text={"[click](javascript:alert(1))"} />);
    expect(container.querySelector("a")).toBeNull();
    expect(container).toHaveTextContent("click");
  });
});
