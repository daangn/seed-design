import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { updatesSource } from "@/app/source";

export const revalidate = false;

export const { GET, generateStaticParams } = createLLMTextRoute(updatesSource, "updates");
