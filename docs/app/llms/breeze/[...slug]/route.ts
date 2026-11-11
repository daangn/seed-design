import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getBreezeSource } from "@/lib/source";

export const revalidate = false;

const route = createLLMTextRoute(getBreezeSource, "breeze");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
