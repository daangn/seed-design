import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getReactSource } from "@/lib/source";

export const revalidate = false;

const route = createLLMTextRoute(getReactSource, "react");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
