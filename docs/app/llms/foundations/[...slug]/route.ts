import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { getFoundationsSource } from "@/app/source";

export const revalidate = false;

const route = createLLMTextRoute(getFoundationsSource, "foundations");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
