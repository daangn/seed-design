import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SECTION_IDS, type SectionId } from "./config.js";

const sectionEnum = z.enum(SECTION_IDS as [SectionId, ...SectionId[]]);

export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "seed_docs_lookup",
    {
      title: "SEED Docs Lookup",
      description: "Template prompt for reading SEED docs via llms.txt-first tools.",
      argsSchema: {
        question: z.string().min(1).describe("User question about SEED design system docs."),
        section: sectionEnum.optional().describe("Optional section focus."),
      },
    },
    ({ question, section }) => {
      const scopedInstruction = section
        ? `Use list_docs/read_doc/search_docs only within section "${section}".`
        : "Use list_sections first, then narrow with list_docs/search_docs before read_doc.";

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: [
                "Answer the question using SEED docs MCP tools.",
                scopedInstruction,
                "Prefer llms.txt documents. Do not rely on HTML pages.",
                `Question: ${question}`,
              ].join("\n"),
            },
          },
        ],
      };
    },
  );
}
