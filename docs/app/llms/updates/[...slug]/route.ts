import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getUpdatesSource } from "@/lib/source";

export const revalidate = false;

const route = createLLMTextRoute(getUpdatesSource, "updates");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
