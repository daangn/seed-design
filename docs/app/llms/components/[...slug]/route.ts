import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { getComponentsSource } from "@/app/source";

export const revalidate = false;

const route = createLLMTextRoute(getComponentsSource, "components");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
