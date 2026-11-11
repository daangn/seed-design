import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getDocsSource } from "@/lib/source";

export const revalidate = false;

const route = createLLMTextRoute(getDocsSource, "docs");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
