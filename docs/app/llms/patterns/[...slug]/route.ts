import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { patternsSource } from "@/app/source";

export const revalidate = false;

export const { GET, generateStaticParams } = createLLMTextRoute(patternsSource, "patterns");
