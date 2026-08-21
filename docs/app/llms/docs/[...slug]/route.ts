import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { getDocsSource } from "@/app/source";

export const revalidate = false;

const route = createLLMTextRoute(getDocsSource, "docs");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
