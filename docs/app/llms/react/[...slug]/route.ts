import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { getReactSource } from "@/app/source";

export const revalidate = false;

const route = createLLMTextRoute(getReactSource, "react");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
