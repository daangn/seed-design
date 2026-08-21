import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { getBreezeSource } from "@/app/source";

export const revalidate = false;

const route = createLLMTextRoute(getBreezeSource, "breeze");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
