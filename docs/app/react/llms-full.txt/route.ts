import { getLLMTextForFullCompilation } from "@/app/_llms/get-llm-text";
import { shouldIncludeInFullText } from "@/app/_llms/config";
import type { LLMPage } from "@/app/_llms/types";
import { reactSource } from "@/app/source";
import { GET as getChangelogLLMText } from "@/app/llms/react/updates/changelog.txt/route";

export const revalidate = false;

export async function GET() {
  const pages = (reactSource.getPages() as LLMPage[])
    .filter((page) => shouldIncludeInFullText("react", page.path))
    .sort((a, b) => a.path.localeCompare(b.path));

  const [pageResults, changelogResponse] = await Promise.all([
    Promise.all(pages.map(getLLMTextForFullCompilation)),
    //NOTE: changlog.mdx 파일이 없어서 react/updates/changelog.txt 파일을 사용
    getChangelogLLMText(),
  ]);

  const changelogText = await changelogResponse.text();

  return new Response([...pageResults, changelogText].join("\n\n---\n\n"));
}
