/**
 * Shared top-nav model for the site header — the single source of truth for nav
 * destinations. Consumed by the docs detail-page header (`docs/components/header`)
 * and re-exported from the landing content module so the landing header shares it.
 * Edit nav labels/links here.
 */

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** Opens in a new tab (external destination). */
  external?: boolean;
  /** No destination yet — rendered inert until the section exists. */
  disabled?: boolean;
  /** Dropdown entries revealed on hover (e.g. Develop → platforms). */
  children?: NavChild[];
  /**
   * Path prefixes that mark this item as the current section (for active styling).
   * Only the confident mappings are filled in; ambiguous items are left out for now.
   */
  match?: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Get Started", href: "/get-started", match: ["/get-started"] },
  { label: "Foundations", href: "/foundations", match: ["/foundations"] },
  { label: "Components", href: "/components", match: ["/components"] },
  { label: "Patterns", href: "/patterns", match: ["/patterns"] },
  {
    label: "Develop",
    href: "/react",
    match: ["/react", "/lynx"],
    // iOS/Android are planned; add them here once the dropdown supports a "coming soon" state.
    children: [
      { label: "React", href: "/react" },
      { label: "Lynx", href: "/lynx" },
    ],
  },
  { label: "AI & Tools", href: "/ai-integration", match: ["/ai-integration"] },
  { label: "Updates", href: "/updates", match: ["/updates"] },
];
