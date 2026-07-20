import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { aiIntegrationSource } from "@/app/source";

export const revalidate = false;

export const { GET, generateStaticParams } = createLLMTextRoute(
  aiIntegrationSource,
  "ai-integration",
);
