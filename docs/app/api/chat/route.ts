import { createOpenAI } from "@ai-sdk/openai";
import { stepCountIs, streamText } from "ai";
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

const chatRequestSchema = z.object({
  messages: z
    .array(
      z
        .object({
          role: z.string().min(1),
        })
        .passthrough(),
    )
    .min(1),
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

  const messages = parsed.data.messages as Parameters<typeof streamText>[0]["messages"];

  const mcpTools = await getMCPTools();

  const result = streamText({
    model: llmRouter(process.env.LLM_ROUTER_MODEL ?? "openai/gpt-4o"),
    system: systemPrompt,
    messages,
    tools: {
      ...clientTools,
      ...mcpTools,
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
