import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { reactSource } from "@/app/source";

export const revalidate = false;

export const { GET, generateStaticParams } = createLLMTextRoute(reactSource, "react");
