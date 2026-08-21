import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { getUpdatesSource } from "@/app/source";

export const revalidate = false;

const route = createLLMTextRoute(getUpdatesSource, "updates");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
