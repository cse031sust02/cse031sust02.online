import { Fragment, type ReactNode } from "react";

/**
 * Minimal, safe Markdown → React renderer for twin replies.
 * Supports paragraphs, line breaks, lists, headings, fenced code, `code`, **bold**, *italic*, and
 * http(s) links. Never uses raw HTML: any HTML in the input is shown as text.
 */
export function Markdown({ text }: { text: string }) {
  return <div className="space-y-3">{renderBlocks(text)}</div>;
}

function renderBlocks(text: string): ReactNode[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }
    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      i++; // closing fence (or end)
      out.push(
        <pre key={key++} className="overflow-x-auto rounded-chip bg-bg p-3 font-mono text-xs">
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    if (heading) {
      out.push(
        <p key={key++} className="font-bold text-highlight">
          {renderInline(heading[1])}
        </p>,
      );
      i++;
      continue;
    }
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i]))
        items.push(lines[i++].replace(/^\s*[-*+]\s+/, ""));
      out.push(
        <ul key={key++} className="list-disc space-y-1 pl-5 marker:text-accent">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i]))
        items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ""));
      out.push(
        <ol key={key++} className="list-decimal space-y-1 pl-5 marker:text-accent">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i]) &&
      !lines[i].trim().startsWith("```") &&
      !/^#{1,6}\s+/.test(lines[i])
    ) {
      para.push(lines[i++]);
    }
    out.push(
      <p key={key++}>
        {para.map((l, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {renderInline(l)}
          </Fragment>
        ))}
      </p>,
    );
  }
  return out;
}

const INLINE_RE =
  /(`[^`]+`)|(\*\*[^*]+\*\*|(?<!\w)__[^_]+__(?!\w))|(\*[^*\s][^*]*\*|(?<!\w)_[^_\s][^_]*_(?!\w))|(\[[^\]]+\]\([^)\s]+\))/g;

export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(INLINE_RE)) {
    const [token] = match;
    const start = match.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    if (match[1]) {
      out.push(
        <code key={key++} className="rounded bg-bg px-1 font-mono text-[0.9em] text-accent-2">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (match[2]) {
      out.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (match[3]) {
      out.push(<em key={key++}>{token.slice(1, -1)}</em>);
    } else {
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token)!;
      const [, label, href] = link;
      out.push(
        /^https?:\/\//i.test(href) ? (
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-accent-2 underline"
          >
            {label}
          </a>
        ) : (
          label
        ),
      );
    }
    last = start + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
