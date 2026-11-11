import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getFoundationsSource } from "@/lib/source";

export const revalidate = false;

const route = createLLMTextRoute(getFoundationsSource, "foundations");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
