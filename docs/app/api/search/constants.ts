import type { TagItem } from "fumadocs-ui/contexts/search";

export const TAGS = {
  design: { name: "Design", value: "design" },
  react: { name: "React", value: "react" },
} as const satisfies Record<string, TagItem>;
