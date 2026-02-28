import { createOpenAI } from "@ai-sdk/openai";
import { createAgentUIStreamResponse, safeValidateUIMessages } from "ai";
import { createSeedAssistantAgent } from "@/lib/ai/agent";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { createClientToolBundle } from "@/lib/ai/tools";
import { getMCPToolBundle } from "@/lib/ai/mcp-client";
import { detectComponentGuideIntent, extractLatestUserText } from "@/lib/ai/component-guide-intent";
import { generateOrchestrationPlan, shouldUsePlanningStage } from "@/lib/ai/orchestrator";
import { mergeToolDescriptors } from "@/lib/ai/tool-registry";
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

  const clientToolBundle = createClientToolBundle({ baseUrl });
  const mcpToolBundle = await getMCPToolBundle({
    enableLegacyFallback: true,
  });

  const tools = {
    ...clientToolBundle.tools,
    ...mcpToolBundle.tools,
  };

  const toolCatalog = mergeToolDescriptors(clientToolBundle.descriptors, mcpToolBundle.descriptors);
  const model = llmRouter(llmRouterModel);

  const usePlanningStage =
    Boolean(latestUserText) &&
    shouldUsePlanningStage({
      question: latestUserText,
      toolCatalog,
      isComponentGuide: Boolean(componentGuideIntent),
    });

  const orchestrationPlan =
    latestUserText && usePlanningStage
      ? await generateOrchestrationPlan({
          question: latestUserText,
          toolCatalog,
          model,
        })
      : null;

  const systemPrompt = buildSystemPrompt({
    verifiedLinks,
    toolCatalog,
    orchestrationPlan,
    componentGuide: componentGuideIntent
      ? {
          componentId: componentGuideIntent.component.id,
          userQuery: componentGuideIntent.question,
          focus: componentGuideIntent.focus,
        }
      : null,
  });

  const agent = createSeedAssistantAgent({
    model,
    tools,
    instructions: systemPrompt,
    orchestrationPlan,
    maxSteps: 12,
  });

  try {
    return await createAgentUIStreamResponse({
      agent,
      uiMessages: validatedMessages.data,
      onFinish: async () => {
        await mcpToolBundle.close();
      },
      onError: (error) => {
        void mcpToolBundle.close();
        console.error("Chat stream error:", error);
        return "응답을 생성하는 중 오류가 발생했어요.";
      },
      messageMetadata: ({ part }) => {
        if (part.type !== "start" && part.type !== "finish") {
          return undefined;
        }

        return {
          ...(verifiedLinks.length > 0 ? { verifiedLinks } : {}),
          ...(orchestrationPlan
            ? {
                orchestrationPlan: {
                  reasoningMode: orchestrationPlan.reasoningMode,
                  toolSequence: orchestrationPlan.toolSequence,
                },
              }
            : {}),
        };
      },
    });
  } catch (error) {
    await mcpToolBundle.close();
    throw error;
  }
}
