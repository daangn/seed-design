import type { TagItem } from "fumadocs-ui/contexts/search";

export const TAGS = {
  design: { name: "Design", value: "design" },
  react: { name: "React", value: "react" },
  lynx: { name: "Lynx", value: "lynx" },
  breeze: { name: "Breeze", value: "breeze" },
  aiIntegration: { name: "AI Integration", value: "ai-integration" },
  blog: { name: "Blog", value: "blog" },
} as const satisfies Record<string, TagItem>;
