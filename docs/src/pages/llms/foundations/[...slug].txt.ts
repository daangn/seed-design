import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getFoundationsSource } from "@/lib/source";

export const { getStaticPaths, GET } = createLLMTextRoute(getFoundationsSource, "foundations");
