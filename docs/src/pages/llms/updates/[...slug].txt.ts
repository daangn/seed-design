import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getUpdatesSource } from "@/lib/source";

export const { getStaticPaths, GET } = createLLMTextRoute(getUpdatesSource, "updates");
