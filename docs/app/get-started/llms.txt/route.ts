import { getLLMText } from "@/app/_llms/get-llm-text";
import { getGetStartedSource } from "@/app/source";
import { notFound } from "next/navigation";

export const revalidate = false;

// 다른 섹션의 llms.txt는 하위 문서 목록이지만 get-started는 index.mdx 한 장이 전부다.
// 자기 자신만 담긴 목록을 내보내봐야 쓸모가 없어서 본문을 그대로 내보낸다.
// (`/llms/get-started/*` 라우트가 없는 것도 같은 이유 — 하위 문서가 없다.)
export async function GET() {
  const getStartedSource = await getGetStartedSource();
  const page = getStartedSource.getPage([]);

  if (!page) notFound();

  return new Response(await getLLMText(page, "get-started"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
