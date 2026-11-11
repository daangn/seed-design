import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getBreezeSource } from "@/lib/source";

export const { getStaticPaths, GET } = createLLMTextRoute(getBreezeSource, "breeze");
