import { tool } from "ai";
import { z } from "zod";

/**
 * 클라이언트사이드 도구: execute 함수 없음 → useChat에서 UI로 렌더링
 */
export const clientTools = {
  showComponentExample: tool({
    description:
      "Show an interactive component example preview in the chat. Use when the user asks to see how a component looks or works.",
    inputSchema: z.object({
      name: z
        .string()
        .describe(
          'Component example path, e.g., "react/action-button/preview", "react/checkbox/preview"',
        ),
    }),
  }),

  showInstallation: tool({
    description: "Show the CLI installation command for a SEED Design component.",
    inputSchema: z.object({
      name: z
        .string()
        .describe('Component name in kebab-case, e.g., "action-button", "checkbox", "tabs"'),
    }),
  }),

  showCodeBlock: tool({
    description: "Show a syntax-highlighted code block in the chat.",
    inputSchema: z.object({
      code: z.string().describe("The code to display"),
      language: z.string().default("tsx").describe("Programming language"),
      title: z.string().optional().describe("Optional title for the code block"),
    }),
  }),
};
