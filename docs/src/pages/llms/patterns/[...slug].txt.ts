import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getPatternsSource } from "@/lib/source";

export const { getStaticPaths, GET } = createLLMTextRoute(getPatternsSource, "patterns");
