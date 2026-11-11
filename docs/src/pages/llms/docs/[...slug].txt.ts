import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getDocsSource } from "@/lib/source";

export const { getStaticPaths, GET } = createLLMTextRoute(getDocsSource, "docs");
