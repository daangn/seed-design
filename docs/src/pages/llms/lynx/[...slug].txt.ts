import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getLynxSource } from "@/lib/source";

export const { getStaticPaths, GET } = createLLMTextRoute(getLynxSource, "lynx");
