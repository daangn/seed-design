import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, safeValidateUIMessages, stepCountIs, streamText } from "ai";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { createClientTools } from "@/lib/ai/tools";
import { getMCPTools } from "@/lib/ai/mcp-client";
import { detectComponentGuideIntent, extractLatestUserText } from "@/lib/ai/component-guide-intent";
import { resolveComponentGuideLinks, resolveVerifiedLinksForQuery } from "@/lib/ai/component-guide-links";
import { z } from "zod";

const llmRouter = createOpenAI({
  baseURL: process.env.LLM_ROUTER_URL,
  apiKey: "-",
  headers: {
    "x-request-katalog-id": process.env.LLM_ROUTER_KATALOG_ID ?? "",
    "x-request-katalog-name": process.env.LLM_ROUTER_KATALOG_NAME ?? "",
  },
  name: "llm-router",
});

const llmRouterModel = process.env.LLM_ROUTER_MODEL?.trim() || "openai/gpt-4o";

const chatRequestSchema = z.object({
  messages: z.array(z.unknown()).min(1),
});

export async function POST(req: Request) {
  const baseUrl = new URL(req.url).origin;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const mcpTools = await getMCPTools();
  const clientTools = createClientTools({ baseUrl });
  const tools = {
    ...clientTools,
    ...mcpTools,
  };

  const validatedMessages = await safeValidateUIMessages({
    messages: parsed.data.messages,
  });

  if (!validatedMessages.success) {
    return Response.json({ error: "Invalid messages format" }, { status: 400 });
  }

  const latestUserText = extractLatestUserText(validatedMessages.data);
  const componentGuideIntent = latestUserText
    ? await detectComponentGuideIntent(latestUserText, { baseUrl })
    : null;
  const componentGuideLinks = componentGuideIntent
    ? await resolveComponentGuideLinks({
        componentId: componentGuideIntent.component.id,
        baseUrl,
      })
    : [];
  const verifiedLinks = componentGuideIntent
    ? componentGuideLinks
    : latestUserText
      ? await resolveVerifiedLinksForQuery({
          query: latestUserText,
          baseUrl,
          limit: 3,
        })
      : [];

  const messages = await convertToModelMessages(validatedMessages.data, {
    tools,
    ignoreIncompleteToolCalls: true,
  });

  const result = streamText({
    model: llmRouter(llmRouterModel),
    system: buildSystemPrompt({
      verifiedLinks,
      componentGuide: componentGuideIntent
        ? {
            componentId: componentGuideIntent.component.id,
            userQuery: componentGuideIntent.question,
          }
        : null,
    }),
    messages,
    tools,
    stopWhen: stepCountIs(8),
  });

  return result.toUIMessageStreamResponse({
    messageMetadata: ({ part }) => {
      if ((part.type === "start" || part.type === "finish") && verifiedLinks.length > 0) {
        return {
          verifiedLinks,
        };
      }

      return undefined;
    },
  });
}
