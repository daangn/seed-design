import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { getGetStartedSource } from "@/app/source";

export const revalidate = false;

const route = createLLMTextRoute(getGetStartedSource, "get-started");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
