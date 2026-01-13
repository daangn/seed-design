import type { Page } from "fumadocs-core/source";

export type Section = "react" | "docs" | "breeze" | "lynx" | "ai-integration";

export type LLMPage = Page & {
  path: string;
  data: {
    title: string;
    description?: string;
    getText: (type: "raw" | "processed") => Promise<string | undefined>;
  };
};

export interface SectionConfig {
  contentDir: string;
  baseUrl: string;
  description: string;
  excludePaths?: string[];
}
