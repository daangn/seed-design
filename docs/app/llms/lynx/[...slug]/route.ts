import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { getLynxSource } from "@/app/source";

export const revalidate = false;

const route = createLLMTextRoute(getLynxSource, "lynx");

export const GET = route.GET;
export function generateStaticParams() {
  return route.generateStaticParams();
}
