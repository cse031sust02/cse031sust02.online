import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content/load-profile";

export const alt = "cse031sust02 terminal card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colors mirror src/styles/theme.css (CSS variables aren't available in ImageResponse).
const C = {
  bg: "#07090a",
  surface: "#0d1113",
  border: "#1f2a2e",
  fg: "#d7e2dc",
  muted: "#8fa39a",
  accent: "#39ff88",
  cyan: "#33d6ff",
};

export default function OpengraphImage() {
  const { basics } = getProfile();
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: C.bg, padding: 56 }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: C.surface,
          border: `2px solid ${C.border}`,
          borderRadius: 24,
          boxShadow: `0 0 40px ${C.accent}33`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "18px 28px",
            borderBottom: `2px solid ${C.border}`,
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#ff5f56" }} />
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#ffbd2e" }} />
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#27c93f" }} />
          <div style={{ marginLeft: 16, color: C.muted, fontSize: 24 }}>
            {`~/${basics.handle} — zsh`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "48px 56px", gap: 20 }}>
          <div style={{ display: "flex", color: C.muted, fontSize: 30 }}>
            <span style={{ color: C.accent }}>
              {basics.name.split(" ")[0].toLowerCase()}@{basics.handle}
            </span>
            :~$ whoami
          </div>
          <div style={{ color: C.accent, fontSize: 80, fontWeight: 700 }}>{basics.name}</div>
          <div style={{ color: C.cyan, fontSize: 40 }}>{basics.title}</div>
          <div style={{ color: C.fg, fontSize: 32, maxWidth: 980 }}>{basics.tagline}</div>
        </div>
      </div>
    </div>,
    size,
  );
}
