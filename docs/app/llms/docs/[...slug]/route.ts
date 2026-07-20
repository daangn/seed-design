import { createLLMTextRoute } from "@/app/_llms/llms-route";
import { docsSource } from "@/app/source";

export const revalidate = false;

export const { GET, generateStaticParams } = createLLMTextRoute(docsSource, "docs");
