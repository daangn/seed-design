import { IconSeedArrow } from "@/components/icon-seed-arrow";
import Link from "next/link";
import { SeedSymbol } from "@/components/layout/seed-symbol";
import { BrandLogo } from "../brand-logo";
import { type FooterLink, FOOTER_CONTACT, FOOTER_MENU, FOOTER_MORE } from "../lib/landing-content";

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav aria-label={title} className="flex flex-col gap-3">
      <span className="t3-bold md:text-sm md:font-bold">{title}</span>
      <div className="flex flex-col gap-2">
        {links.map((item) => {
          const external = item.href.startsWith("http");
          return (
            <Link
              key={item.label}
              href={item.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="inline-flex w-fit items-center gap-0.5 t3-medium opacity-100 transition-opacity hover:opacity-100 motion-reduce:transition-none md:text-sm md:opacity-80 [&>svg]:size-[12px] [&>svg]:-translate-y-[0.5px] [&>svg]:opacity-100 [&>svg]:transition-opacity motion-reduce:[&>svg]:transition-none md:[&>svg]:opacity-0 md:hover:[&>svg]:opacity-100"
            >
              {item.label}
              {external && <IconSeedArrow external />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * Section 7 — Footer.
 * The lowest layer: fixed to the screen bottom (z-0), sized to its own content. Every
 * section above is opaque and stacks higher, so the footer stays hidden until the
 * last section (blog) scrolls up over the spacer in `landing-experience` — then it
 * is uncovered from the bottom up, the oversized SEED wordmark first, like a drawer
 * sliding open only as far as its content needs. The spacer height in
 * `landing-experience` is synced to this footer's height, so it opens to reveal the
 * logo / Menu / Contact instead of covering the full viewport.
 */
export function SectionFooter() {
  return (
    <footer
      id="footer"
      data-section="footer"
      className="relative flex w-full flex-col gap-8 overflow-hidden bg-palette-carrot-600 py-8 text-fg-neutral md:fixed md:inset-x-0 md:bottom-0 md:z-0 md:gap-14 md:py-12"
    >
      <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-8 px-spacing-x-global-gutter md:flex-row md:justify-between md:gap-12 md:px-12">
        <div className="flex flex-col gap-3">
          <SeedSymbol className="h-7 w-auto self-start md:h-8" />
          <div className="flex flex-col gap-1.5">
            <span className="t12-bold text-[26px] font-bold md:text-[28px]">Rooted in Daangn.</span>
            {/* output: export라 연도는 빌드 시점에 구워진다. 연도 경계에서만 클라이언트와
                갈릴 수 있어 hydration 경고만 억제한다(값은 다음 빌드에 갱신). */}
            <p className="t4-medium md:text-sm md:opacity-80" suppressHydrationWarning>
              © {new Date().getFullYear()} daangn. All rights reserved.
            </p>
          </div>
        </div>
        {/* Mobile: 2-up grid so Menu | More share the first row and Contact wraps to the
            second (uses the empty right half instead of one tall stacked column). md+: a
            single row of three. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:flex md:flex-row md:gap-16">
          <FooterColumn title="Menu" links={FOOTER_MENU} />
          <FooterColumn title="More" links={FOOTER_MORE} />
          <FooterColumn title="Contact" links={FOOTER_CONTACT} />
        </div>
      </div>

      <div className="w-full px-spacing-x-global-gutter md:px-12">
        <BrandLogo width={1920} className="mx-auto block h-auto w-full max-w-[1760px]" />
      </div>
    </footer>
  );
}
