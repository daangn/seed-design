import type { Nodes } from "mdast";
import { mdxJsxToMarkdown } from "mdast-util-mdx-jsx";
import { toMarkdown } from "mdast-util-to-markdown";
import { defineMdastPlugin, type MdastPluginEntry, type MdxJsxFlowElement } from "satteri";
import { replaceRange, type SourceRange, sourceRange } from "./replace-source";

/** remarkNpm이 바꿀 코드 블록의 원문 범위. 생성된 노드에는 위치가 없어 문서 순서로 짝짓는다. */
const NPM_RANGES = "_codeBlockTabsNpmRanges";
/** remarkCodeTab은 코드 노드를 복사해 탭에 넣으므로, 범위를 노드 data에 실어 보낸다. */
const CODE_RANGE = "codeBlockTabsSourceRange";

type NpmRanges = { [NPM_RANGES]?: SourceRange[] };

function codeRanges(node: Readonly<Nodes>): SourceRange[] {
  const own =
    node.type === "code"
      ? (node.data as Record<string, unknown> | undefined)?.[CODE_RANGE]
      : undefined;
  const children = "children" in node ? node.children.flatMap(codeRanges) : [];
  return own ? [own as SourceRange, ...children] : children;
}

/**
 * `remarkCodeTab`·`remarkNpm`은 코드 블록을 원문 위치 없는 `<CodeBlockTabs>`로 바꾸고, llms 출력에는
 * 원래 코드 블록을 그대로 남깁니다. llms 룰(`lib/llms/rules/codeblock-tabs-rule.ts`)은 그 JSX를 읽어
 * 탭별 목록을 만들므로, 원래 코드 블록 자리를 생성된 JSX로 바꿔 둡니다. 두 플러그인을 앞뒤로 감싸
 * 실행 전에 원문 범위를 기록하고, 실행 뒤에 생성된 JSX를 그 범위에 씁니다.
 *
 * @param npmGroupId `remarkNpm`의 `persist.id`. 생성된 탭이 remarkNpm에서 왔는지 가립니다.
 */
export function codeBlockTabsSource({
  codeTab,
  npm,
  npmGroupId,
}: {
  codeTab: MdastPluginEntry;
  npm: MdastPluginEntry;
  npmGroupId: string;
}): MdastPluginEntry[] {
  return [
    defineMdastPlugin({
      name: "remark-record-code-block-tabs-source",
      options: { position: true },
      code(node, context) {
        const range = sourceRange(node);
        if (!range) return;

        if (node.lang === "package-install" || node.lang === "npm") {
          const data = context.data as NpmRanges;
          data[NPM_RANGES] ??= [];
          data[NPM_RANGES].push(range);
        }
        context.setProperty(node, "data", { ...node.data, [CODE_RANGE]: range });
      },
    }),
    codeTab,
    npm,
    defineMdastPlugin({
      name: "remark-write-code-block-tabs-source",
      mdxJsxFlowElement(node, context) {
        if (node.name !== "CodeBlockTabs" || node.position) return;

        const fromNpm = node.attributes.some(
          (attribute) =>
            attribute.type === "mdxJsxAttribute" &&
            attribute.name === "groupId" &&
            attribute.value === npmGroupId,
        );
        const range = fromNpm ? (context.data as NpmRanges)[NPM_RANGES]?.shift() : spanOf(node);
        if (!range)
          throw new Error(
            "[code-block-tabs-source] 생성된 CodeBlockTabs의 원문 범위를 찾지 못했습니다.",
          );

        replaceRange(
          context,
          range,
          toMarkdown(node as Nodes, { extensions: [mdxJsxToMarkdown()], fences: true }).trimEnd(),
        );
      },
    }),
  ];
}

/** remarkCodeTab이 묶은 코드 블록들의 원문 범위. 첫 블록 시작부터 마지막 블록 끝까지입니다. */
function spanOf(node: Readonly<MdxJsxFlowElement>): SourceRange | undefined {
  const ranges = codeRanges(node as Nodes);
  if (ranges.length === 0) return undefined;
  return {
    start: Math.min(...ranges.map(({ start }) => start)),
    end: Math.max(...ranges.map(({ end }) => end)),
  };
}
