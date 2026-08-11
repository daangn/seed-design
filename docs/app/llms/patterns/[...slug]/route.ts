import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { getPatternsSource } from "@/app/source";

export const revalidate = false;

const route = createLLMTextRoute(getPatternsSource, "patterns");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
