import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Foundations", href: "/docs/foundation" },
  { label: "Components", href: "/docs/components" },
  { label: "Patterns", href: "/docs/guidelines" },
  { label: "Develop", href: "/react" },
  { label: "AI & Tools", href: "/ai-integration" },
  { label: "Blog", href: "/blog" },
];

export function FloatingHeader() {
  return (
    <header className="fixed top-7 left-1/2 z-50 -translate-x-1/2">
      <nav className="flex items-center gap-6 rounded-full bg-white/15 px-6 py-3 backdrop-blur-xl">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-[#212121] transition-opacity hover:opacity-70"
          >
            {item.label}
          </Link>
        ))}
        <button
          type="button"
          aria-label="Search"
          className="flex size-6 items-center justify-center text-[#212121] transition-opacity hover:opacity-70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
