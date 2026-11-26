import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { parseProfile } from "@/lib/content/parse";
import { containsEmail, containsPhone } from "@/lib/content/privacy";
import { makeFixtureProfile } from "@/test/fixture-profile";
import { HomeSections } from "./HomeSections";

describe("HomeSections", () => {
  it("renders every experience, product, skill group, education, certification and award", () => {
    const profile = makeFixtureProfile();
    render(<HomeSections profile={profile} />);

    const experience = within(document.getElementById("experience")!);
    for (const e of profile.experience) {
      expect(experience.getByRole("button", { name: new RegExp(e.company) })).toBeInTheDocument();
    }
    for (const p of profile.products) {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    }
    for (const g of profile.skills) {
      expect(screen.getByRole("list", { name: g.group })).toBeInTheDocument();
      for (const item of g.items) expect(screen.getAllByText(item).length).toBeGreaterThan(0);
    }
    for (const ed of profile.education) expect(screen.getByText(ed.degree)).toBeInTheDocument();
    for (const c of profile.certifications)
      expect(screen.getAllByText(c.name).length).toBeGreaterThan(0);
    for (const a of profile.awards) expect(screen.getByText(a.name)).toBeInTheDocument();
  });

  it("adds a timeline item when an experience entry is added (no component change)", () => {
    const base = makeFixtureProfile();
    const { unmount } = render(<HomeSections profile={base} />);
    const timeline = () => document.querySelectorAll("#experience ol > li").length;
    const before = timeline();
    unmount();

    const extended = makeFixtureProfile({
      experience: [
        ...base.experience,
        {
          company: "Brand New Co",
          role: "Intern",
          start: "2010-01",
          end: "2010-06",
          highlights: ["Learned things."],
          tech: [],
        },
      ],
    });
    render(<HomeSections profile={extended} />);
    expect(timeline()).toBe(before + 1);
    expect(screen.getByRole("button", { name: /Brand New Co/ })).toBeInTheDocument();
  });

  it("links products and certifications to their urls, safely in a new tab", () => {
    const profile = makeFixtureProfile();
    render(<HomeSections profile={profile} />);
    const hrefs = [...document.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    for (const p of profile.products) expect(hrefs).toContain(p.url);
    for (const c of profile.certifications) expect(hrefs).toContain(c.url);

    for (const a of document.querySelectorAll('a[target="_blank"]')) {
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("renders no email address or phone number from the real profile", () => {
    const yaml = readFileSync(path.join(process.cwd(), "content", "profile.yaml"), "utf8");
    const html = renderToStaticMarkup(<HomeSections profile={parseProfile(yaml)} />);
    expect(html).not.toMatch(/mailto:|tel:/i);
    expect(containsEmail(html)).toBe(false);
    const text = html.replace(/<[^>]+>/g, " ");
    expect(containsPhone(text)).toBe(false);
  });

  it("expands and collapses experience items with mouse and keyboard", async () => {
    const user = userEvent.setup();
    const profile = makeFixtureProfile();
    render(<HomeSections profile={profile} />);

    const second = screen.getByRole("button", { name: /Old Startup/ });
    const panel = document.getElementById(second.getAttribute("aria-controls")!)!;
    expect(second).toHaveAttribute("aria-expanded", "false");
    expect(panel).not.toBeVisible();

    await user.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(panel).toBeVisible();

    second.focus();
    await user.keyboard("{Enter}");
    expect(second).toHaveAttribute("aria-expanded", "false");

    await user.keyboard(" ");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });
});
