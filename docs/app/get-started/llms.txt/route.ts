import { getLLMText } from "@/app/_llms/get-llm-text";
import { getGetStartedSource } from "@/app/source";
import { notFound } from "next/navigation";

export const revalidate = false;

// 다른 섹션의 llms.txt는 하위 문서 목록이지만 get-started는 index.mdx 한 장이 전부다.
// 자기 자신만 담긴 목록을 내보내봐야 쓸모가 없어서 본문을 그대로 내보낸다. 그래서 이 주소와
// `/llms/get-started/index.txt`가 같은 바이트를 낸다 — 후자는 다른 섹션과 같은 규칙으로
// 생성되고 CLI 인덱스의 `llmsUrl`이 가리키는 쪽이라 함께 남는다.
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
