import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getPatternsSource } from "@/lib/source";

export const revalidate = false;

const route = createLLMTextRoute(getPatternsSource, "patterns");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
