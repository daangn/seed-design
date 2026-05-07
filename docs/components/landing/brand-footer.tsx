import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "./brand-logo";

interface FooterLink {
  label: string;
  href: string;
}

const SITE_LINKS: FooterLink[] = [
  { label: "Get Started", href: "/docs" },
  { label: "Foundations", href: "/docs/foundation" },
  { label: "Components", href: "/docs/components" },
  { label: "Resources", href: "/docs/resources" },
  { label: "Careers", href: "https://team.daangn.com" },
  { label: "Blog", href: "/blog" },
];

const SOCIAL_LINKS: FooterLink[] = [
  { label: "Github", href: "https://github.com/daangn/seed-design" },
  { label: "X", href: "https://x.com/daangn" },
  { label: "YouTube", href: "https://www.youtube.com/@daangn" },
  { label: "Instagram", href: "https://www.instagram.com/daangn" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/daangn" },
];

export function BrandFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-palette-carrot-600 text-[#212121]">
      <div className="grid grid-cols-1 gap-10 px-8 pt-16 pb-12 md:grid-cols-12 md:px-12">
        <div className="flex items-center gap-2 md:col-span-3">
          <Image src="/brand/daangn-mark.svg" alt="" width={24} height={24} aria-hidden="true" />
          <span className="text-base font-semibold">Rooted in Daangn.</span>
        </div>

        <nav className="flex flex-col gap-2 text-sm md:col-span-3">
          {SITE_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="transition-opacity hover:opacity-70">
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-2 text-sm md:col-span-3">
          {SOCIAL_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm md:col-span-3 md:text-right">
          © {new Date().getFullYear()} daangn. All rights reserved.
        </p>
      </div>

      <div className="flex w-full justify-center pt-8">
        <BrandLogo width={1920} className="block h-auto w-[97vw]" />
      </div>
    </footer>
  );
}
