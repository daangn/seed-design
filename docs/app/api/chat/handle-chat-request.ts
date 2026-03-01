import { createOpenAI } from "@ai-sdk/openai";
import { createAgentUIStreamResponse, safeValidateUIMessages, type UIMessage } from "ai";
import { z } from "zod";
import { createSeedAssistantAgent } from "@/lib/ai/agent";
import { resolveComponentGuideLinks, resolveVerifiedLinksForQuery } from "@/lib/ai/component-guide-links";
import { detectComponentGuideIntent, extractLatestUserText } from "@/lib/ai/component-guide-intent";
import { getMCPToolBundle } from "@/lib/ai/mcp-client";
import { normalizeUIMessagesForValidation } from "./normalize-ui-messages";
import { generateOrchestrationPlan, shouldUsePlanningStage } from "@/lib/ai/orchestrator";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { createClientToolBundle } from "@/lib/ai/tools";
import { mergeToolDescriptors, filterToolsForQuery } from "@/lib/ai/tool-registry";
import { resolveTrustedBaseUrlFromEnv } from "@/lib/ai/trusted-base-url";

type RuntimeEnv = Record<string, unknown>;

interface HandleChatRequestOptions {
  env?: RuntimeEnv;
}

function getEnvString(env: RuntimeEnv | undefined, key: string): string | undefined {
  const envValue = env?.[key];
  if (typeof envValue === "string" && envValue.trim().length > 0) {
    return envValue;
  }

  if (typeof process !== "undefined" && process.env) {
    const processValue = process.env[key];
    if (typeof processValue === "string" && processValue.trim().length > 0) {
      return processValue;
    }
  }

  return undefined;
}

const chatRequestSchema = z.object({
  messages: z.array(z.unknown()).min(1),
});

const REQUIRED_LLM_CONFIG_KEYS = [
  "LLM_ROUTER_URL",
  "LLM_ROUTER_KATALOG_ID",
  "LLM_ROUTER_KATALOG_NAME",
] as const;

export async function handleChatRequest(
  req: Request,
  options: HandleChatRequestOptions = {},
) {
  const runtimeEnv = options.env;

  const llmRouterConfig = {
    LLM_ROUTER_URL: getEnvString(runtimeEnv, "LLM_ROUTER_URL"),
    LLM_ROUTER_KATALOG_ID: getEnvString(runtimeEnv, "LLM_ROUTER_KATALOG_ID"),
    LLM_ROUTER_KATALOG_NAME: getEnvString(runtimeEnv, "LLM_ROUTER_KATALOG_NAME"),
  };
  const missingLLMConfig = REQUIRED_LLM_CONFIG_KEYS.filter((key) => !llmRouterConfig[key]);
  if (missingLLMConfig.length > 0) {
    console.error("Missing required LLM router configuration:", missingLLMConfig);
    return Response.json(
      {
        error: "Missing LLM router configuration",
        missing: missingLLMConfig,
      },
      { status: 500 },
    );
  }
  const llmRouterUrl = llmRouterConfig.LLM_ROUTER_URL;
  const llmRouterKatalogId = llmRouterConfig.LLM_ROUTER_KATALOG_ID;
  const llmRouterKatalogName = llmRouterConfig.LLM_ROUTER_KATALOG_NAME;

  const llmRouter = createOpenAI({
    baseURL: llmRouterUrl!,
    apiKey: "-",
    headers: {
      "x-request-katalog-id": llmRouterKatalogId!,
      "x-request-katalog-name": llmRouterKatalogName!,
    },
    name: "llm-router",
  });

  const llmRouterModel = getEnvString(runtimeEnv, "LLM_ROUTER_MODEL") ?? "openai/gpt-5.2";
  const baseUrl = resolveTrustedBaseUrlFromEnv({
    SEED_DOCS_BASE_URL: getEnvString(runtimeEnv, "SEED_DOCS_BASE_URL"),
    NEXT_PUBLIC_SITE_URL: getEnvString(runtimeEnv, "NEXT_PUBLIC_SITE_URL"),
    VERCEL_PROJECT_PRODUCTION_URL: getEnvString(runtimeEnv, "VERCEL_PROJECT_PRODUCTION_URL"),
  });

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

  let uiMessages: UIMessage[];

  if (validatedMessages.success) {
    uiMessages = validatedMessages.data;
  } else {
    const normalizedMessages = normalizeUIMessagesForValidation(parsed.data.messages);
    const normalizedValidation = await safeValidateUIMessages({
      messages: normalizedMessages,
    });

    if (!normalizedValidation.success) {
      return Response.json({ error: "Invalid messages format" }, { status: 400 });
    }

    uiMessages = normalizedValidation.data;
  }

  const latestUserText = extractLatestUserText(uiMessages);
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
  const mcpToolBundle = await getMCPToolBundle(runtimeEnv);

  const tools = {
    ...clientToolBundle.tools,
    ...mcpToolBundle.tools,
  };

  const mergedToolCatalog = mergeToolDescriptors(
    clientToolBundle.descriptors,
    mcpToolBundle.descriptors,
  );
  const scopedToolSet = filterToolsForQuery(tools, mergedToolCatalog, latestUserText);
  const scopedTools = scopedToolSet.tools;
  const toolCatalog = scopedToolSet.descriptors;
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
    tools: scopedTools,
    instructions: systemPrompt,
    orchestrationPlan,
    maxSteps: 12,
  });

  try {
    return await createAgentUIStreamResponse({
      agent,
      uiMessages,
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
