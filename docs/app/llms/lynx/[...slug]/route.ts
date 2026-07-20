import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { lynxSource } from "@/app/source";

export const revalidate = false;

export const { GET, generateStaticParams } = createLLMTextRoute(lynxSource, "lynx");
