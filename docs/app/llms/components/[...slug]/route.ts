import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getComponentsSource } from "@/lib/source";

export const revalidate = false;

const route = createLLMTextRoute(getComponentsSource, "components");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
