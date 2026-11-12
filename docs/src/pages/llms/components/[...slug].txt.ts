import { createLLMTextRoute } from "@/lib/llms/llms-route";
import { getComponentsSource } from "@/lib/source";

export const { getStaticPaths, GET } = createLLMTextRoute(getComponentsSource, "components");
