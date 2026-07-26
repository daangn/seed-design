import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { foundationsSource } from "@/app/source";

export const revalidate = false;

export const { GET, generateStaticParams } = createLLMTextRoute(foundationsSource, "foundations");
