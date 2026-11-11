import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getAiIntegrationSource } from "@/lib/source";

export const revalidate = false;

const route = createLLMTextRoute(getAiIntegrationSource, "ai-integration");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
