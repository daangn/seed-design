import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getLynxSource } from "@/lib/source";

export const revalidate = false;

const route = createLLMTextRoute(getLynxSource, "lynx");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
