import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { breezeSource } from "@/app/source";

export const revalidate = false;

export const { GET, generateStaticParams } = createLLMTextRoute(breezeSource, "breeze");
