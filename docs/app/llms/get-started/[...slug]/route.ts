import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { getStartedSource } from "@/app/source";

export const revalidate = false;

export const { GET, generateStaticParams } = createLLMTextRoute(getStartedSource, "get-started");
