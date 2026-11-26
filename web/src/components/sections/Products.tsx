import type { Profile } from "@/lib/content/schema";
import { formatDateRange } from "@/lib/content/dates";
import { ChipList } from "@/components/ui/Chip";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Section } from "./Section";

export function Products({ profile }: { profile: Profile }) {
  return (
    <Section id="products">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {profile.products.map((product) => (
          <li key={product.name}>
            <article className="flex h-full flex-col rounded-chip border border-border bg-surface-2 p-5 transition-colors hover:border-accent">
              <h3 className="font-mono text-lg font-bold">
                <ExternalLink href={product.url} className="text-accent-2 hover:underline">
                  <span className="text-muted">{product.company} / </span>
                  {product.name}
                </ExternalLink>
              </h3>
              <p className="mt-1 font-mono text-xs text-muted">
                {product.role} · {formatDateRange(product.start, product.end)}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-fg">{product.description}</p>
              <div className="mt-4">
                <ChipList items={product.tags} label={`${product.name} tags`} />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
