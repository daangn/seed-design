import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "../brand-logo";
import { type FooterLink, FOOTER_CONTACT, FOOTER_MENU, REGIONS, Z } from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav className="flex flex-col gap-2">
      <span className="mb-1 text-sm font-bold">{title}</span>
      {links.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-sm opacity-80 transition-opacity hover:opacity-100"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Section 7 — Footer.
 * Orange brand stage (150vh) revealed from underneath as section 6 lifts away.
 * Not sticky — it simply sits at the bottom of the stack. Brand line + link
 * columns up top, oversized SEED wordmark anchored to the bottom.
 */
export function SectionFooter() {
  return (
    <SectionLayer
      id="footer"
      z={Z.footer}
      regionVh={REGIONS.footer}
      sticky={false}
      panelClassName="flex flex-col justify-end gap-14 bg-palette-carrot-600 pb-0 text-[#212121]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-8 md:flex-row md:justify-between md:px-12">
        <div className="flex flex-col gap-3">
          <Image src="/brand/daangn-mark.svg" alt="" width={28} height={28} aria-hidden="true" />
          <span className="text-2xl font-bold">Rooted in Daangn.</span>
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} daangn. All rights reserved.
          </p>
        </div>
        <div className="flex gap-16">
          <FooterColumn title="Menu" links={FOOTER_MENU} />
          <FooterColumn title="Contact" links={FOOTER_CONTACT} />
        </div>
      </div>

      <div className="w-full px-6">
        <BrandLogo width={1920} className="block h-auto w-full" />
      </div>
    </SectionLayer>
  );
}
