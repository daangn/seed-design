import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { componentsSource } from "@/app/source";

export const revalidate = false;

export const { GET, generateStaticParams } = createLLMTextRoute(componentsSource, "components");
