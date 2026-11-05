import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { getAiIntegrationSource } from "@/app/source";

export const revalidate = false;

const route = createLLMTextRoute(getAiIntegrationSource, "ai-integration");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
