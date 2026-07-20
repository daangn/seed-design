import { IconSeedArrow } from "@/components/icon-seed-arrow";
import Link from "next/link";
import { SeedSymbol } from "./seed-symbol";
import { FOOTER_BRAND, FOOTER_COLUMNS, type FooterLink } from "./lib/footer-content";

/**
 * 콘텐츠 하단 footer (프레젠테이션).
 * article(콘텐츠) 컬럼 안에 마운트된다 — DocsPage는 prev/next 아래(footer 슬롯),
 * overview는 콘텐츠 끝. 콘텐츠 폭에 맞춰 렌더되고 divider(border-t)도 콘텐츠 폭만
 * 가른다(사이드바/ToC 비침범). 콘텐츠는 ./lib/footer-content.ts.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-fd-border mt-12 flex flex-col gap-10 border-t pt-10 md:flex-row md:justify-between">
      <div className="flex flex-col gap-3">
        <SeedSymbol className="text-fd-foreground h-7 w-auto self-start md:h-8" />
        <div>
          <p className="text-fd-foreground text-[26px] font-bold tracking-tight lg:text-[28px]">
            {FOOTER_BRAND.tagline}
          </p>
          <p className="text-fd-muted-foreground mt-1.5 text-xs">
            © {year} {FOOTER_BRAND.copyright}
          </p>
        </div>
      </div>

      <nav className="grid grid-cols-2 gap-x-12 gap-y-8">
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <p className="text-fd-foreground text-sm font-semibold">{column.title}</p>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <FooterLinkItem link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </footer>
  );
}

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className = "text-fd-muted-foreground hover:text-fd-foreground text-sm transition-colors";

  if (link.disabled) {
    return <span className="text-fd-muted-foreground/50 cursor-default text-sm">{link.label}</span>;
  }

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} inline-flex items-center gap-0.5 [&>svg]:size-[12px] [&>svg]:opacity-100 [&>svg]:transition-opacity lg:[&>svg]:opacity-0 lg:hover:[&>svg]:opacity-100`}
      >
        {link.label}
        <IconSeedArrow external />
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}
