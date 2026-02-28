import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, safeValidateUIMessages, stepCountIs, streamText } from "ai";
import { systemPrompt } from "@/lib/ai/system-prompt";
import { clientTools } from "@/lib/ai/tools";
import { getMCPTools } from "@/lib/ai/mcp-client";
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

  const messages = await convertToModelMessages(validatedMessages.data, {
    tools,
    ignoreIncompleteToolCalls: true,
  });

  const result = streamText({
    model: llmRouter(llmRouterModel),
    system: systemPrompt,
    messages,
    tools,
    stopWhen: stepCountIs(8),
  });

  return result.toUIMessageStreamResponse();
}
