import { notFound } from "next/navigation";
import { type Section, sectionConfigs, sections } from "@/app/_llms/config";
import { getLLMText } from "@/app/_llms/get-llm-text";
import { sectionSources } from "@/app/_llms/sources";

export const revalidate = false;
export const dynamicParams = false;

function isSection(value: string | undefined): value is Section {
  return value !== undefined && Object.hasOwn(sectionConfigs, value);
}

/** `["react", "components", "button.md"]` → 섹션 `react`와 그 안에서의 slug `["components", "button"]`. */
function splitDocPath(slug: string[]): { section: string | undefined; slugs: string[] } {
  const [section, ...rest] = slug.map((segment, index) =>
    index === slug.length - 1 ? segment.replace(/\.md$/, "") : segment,
  );
  return { section, slugs: rest };
}

/**
 * 모든 섹션의 문서를 이 라우트 하나가 낸다. 주소는 문서 URL 뒤에 `.md`를 붙인 것이고, 첫 조각이
 * 섹션이라 섹션이 늘어도 `sectionConfigs`에 등록하는 것 말고 할 일이 없다.
 *
 * 섹션 루트 index.mdx는 slug가 없어 `/<section>.md`가 되고, 그 자리에서 `getPage([])`로 잡힌다.
 *
 * 섹션 폴더가 아니라 앱 루트에 있는 이유: 섹션 페이지의 `[[...slug]]`가 그 아래 경로를 모두
 * 가져가서 같은 폴더에는 라우트를 둘 수 없다. 같은 이유로 `next dev`에서는 섹션 루트(`/react.md`)
 * 말고는 섹션 페이지가 먼저 잡아 열리지 않는다. 정적 익스포트는 경로마다 파일을 쓰므로 배포본은
 * 상관없다.
 */
export async function GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params;
  const { section, slugs } = splitDocPath(slug);

  if (!isSection(section)) notFound();

  const source = await sectionSources[section]();
  const page = source.getPage(slugs);

  if (!page) notFound();

  return new Response(await getLLMText(page, section), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}

export async function generateStaticParams() {
  const perSection = await Promise.all(
    sections.map(async (section) => {
      const source = await sectionSources[section]();
      const withExt = (slugs: string[]) => {
        const segments = [section, ...slugs];
        return {
          slug: segments.map((s, i) => (i === segments.length - 1 ? `${s}.md` : s)),
        };
      };

      return [
        ...(source.getPage([]) ? [withExt([])] : []),
        ...source.generateParams().flatMap(({ slug }) => (slug?.length ? [withExt(slug)] : [])),
      ];
    }),
  );

  return perSection.flat();
}
