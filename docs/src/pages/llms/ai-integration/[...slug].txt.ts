import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getAiIntegrationSource } from "@/lib/source";

export const { getStaticPaths, GET } = createLLMTextRoute(getAiIntegrationSource, "ai-integration");
