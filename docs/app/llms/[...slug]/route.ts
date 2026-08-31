import { notFound } from "next/navigation";
import { type Section, sectionConfigs, sections } from "@/app/_llms/config";
import { getLLMText } from "@/app/_llms/get-llm-text";
import { sectionSources } from "@/app/_llms/sources";

export const revalidate = false;

function isSection(value: string | undefined): value is Section {
  return value !== undefined && Object.hasOwn(sectionConfigs, value);
}

/** `["react", "components", "button.txt"]` → 섹션 `react`와 그 안에서의 slug `["components", "button"]`. */
function splitDocPath(slug: string[]): { section: string | undefined; slugs: string[] } {
  const [section, ...rest] = slug.map((segment, index) =>
    index === slug.length - 1 ? segment.replace(/\.txt$/, "") : segment,
  );
  return { section, slugs: rest };
}

/**
 * 모든 섹션의 문서를 이 라우트 하나가 낸다. 주소는 문서 URL 앞에 `/llms`, 뒤에 `.txt`를
 * 붙인 것이고, 첫 조각이 섹션이라 섹션이 늘어도 `sectionConfigs`에 등록하는 것 말고 할 일이
 * 없다.
 *
 * 섹션 루트 index.mdx는 slug가 없어 `/llms/<section>.txt`가 되고, 그 자리에서
 * `getPage([])`로 잡힌다.
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
          slug: segments.map((s, i) => (i === segments.length - 1 ? `${s}.txt` : s)),
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
