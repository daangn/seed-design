import { createOpenAI } from "@ai-sdk/openai";
import { stepCountIs, streamText } from "ai";
import { systemPrompt } from "@/lib/ai/system-prompt";
import { clientTools } from "@/lib/ai/tools";
import { getMCPTools } from "@/lib/ai/mcp-client";

const llmRouter = createOpenAI({
  baseURL: process.env.LLM_ROUTER_URL,
  apiKey: "-",
  headers: {
    "x-request-katalog-id": process.env.LLM_ROUTER_KATALOG_ID ?? "",
    "x-request-katalog-name": process.env.LLM_ROUTER_KATALOG_NAME ?? "",
  },
  name: "llm-router",
});

export async function POST(req: Request) {
  const { messages } = await req.json();

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
