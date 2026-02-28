import { tool } from "ai";
import { z } from "zod";

/**
 * 채팅 UI 렌더링용 도구.
 * 서버에서도 execute를 제공해 tool result가 누락되지 않도록 한다.
 */
export const clientTools = {
  showComponentExample: tool({
    description:
      "Show an interactive component example preview in the chat. Use when the user asks to see how a component looks or works.",
    inputSchema: z.object({
      name: z
        .string()
        .min(3, "Component example path is too short")
        .max(120, "Component example path is too long")
        .regex(
          /^(react|lynx|breeze)\/[a-z0-9]+(?:-[a-z0-9]+)*\/preview$/,
          "Expected '<platform>/<component>/preview' format",
        )
        .describe(
          'Component example path, e.g., "react/action-button/preview", "react/checkbox/preview"',
        ),
    }),
    execute: async () => ({ shown: true }),
  }),

  showInstallation: tool({
    description: "Show the CLI installation command for a SEED Design component.",
    inputSchema: z.object({
      name: z
        .string()
        .min(1, "Component name is required")
        .max(64, "Component name is too long")
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Expected kebab-case component name (lowercase letters, numbers, hyphen)",
        )
        .describe('Component name in kebab-case, e.g., "action-button", "checkbox", "tabs"'),
    }),
    execute: async ({ name }) => ({ shown: true, component: name }),
  }),

  showCodeBlock: tool({
    description: "Show a syntax-highlighted code block in the chat.",
    inputSchema: z.object({
      code: z.string().describe("The code to display"),
      language: z.string().default("tsx").describe("Programming language"),
      title: z.string().optional().describe("Optional title for the code block"),
    }),
    execute: async ({ language, title }) => ({
      shown: true,
      language,
      hasTitle: Boolean(title),
    }),
  }),
};
