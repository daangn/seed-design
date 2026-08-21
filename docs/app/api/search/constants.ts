import type { TagItem } from "fumadocs-ui/contexts/search";

/**
 * Search filter chips — kept in sync with the site header sections (nav-items.ts),
 * minus Get Started. React/Lynx are shown as separate chips even though the header
 * groups them under "Develop". Sections without a chip (get-started, breeze, and the
 * legacy /docs tree) are still indexed under their own tag in app/api/search/route.ts
 * and only surface under the "All" filter.
 */
export const TAGS = {
  foundations: { name: "Foundations", value: "foundations" },
  components: { name: "Components", value: "components" },
  patterns: { name: "Patterns", value: "patterns" },
  react: { name: "React", value: "react" },
  lynx: { name: "Lynx", value: "lynx" },
  aiIntegration: { name: "AI & Tools", value: "ai-integration" },
  updates: { name: "Updates", value: "updates" },
} as const satisfies Record<string, TagItem>;
