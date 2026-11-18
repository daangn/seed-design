import { defineMdastPlugin, type MdastPluginEntry } from "satteri";
import { replaceRange, type SourceRange, sourceRange } from "./replace-source";

const TYPE_TABLE_POSITIONS = "_omittedTypeTablePositions";

type TypeTablePositions = { [TYPE_TABLE_POSITIONS]?: SourceRange[] };

/**
 * `remarkAutoTypeTable`이 만든 props 표를 llms 출력과 검색 색인에서 뺍니다. 표의 type 열은 별칭까지
 * 풀어 쓴 전체 타입이라(`components/type-table/generator.ts`) llms 페이지가 MB 단위로 불어나고, 검색
 * row는 prop마다 그 타입을 담은 표 한 줄이 됩니다.
 *
 * `remarkAutoTypeTable`은 원래 노드 자리에 표 Markdown 편집을 남기는데, 같은 노드의 편집은 마지막
 * 것이 이깁니다. 그래서 앞 플러그인이 원래 노드의 위치를 기억하고, 뒤 플러그인이 그 자리에 빈 편집을
 * 남기면서 생성된 표의 검색 row(`structuredData`)도 지웁니다.
 *
 * @param name 원문에 쓰는 태그 이름(`remarkAutoTypeTable`의 `name`)
 * @param outputName 생성되는 표 태그 이름(`remarkAutoTypeTable`의 `outputName`)
 */
export function omitTypeTableFromText(
  typeTable: MdastPluginEntry,
  { name, outputName = "TypeTable" }: { name: string; outputName?: string },
): MdastPluginEntry[] {
  return [
    defineMdastPlugin({
      name: "remark-remember-type-table",
      options: { position: true },
      mdxJsxFlowElement(node, context) {
        if (node.name !== name) return;
        const data = context.data as TypeTablePositions;
        const range = sourceRange(node);
        if (!range) return;
        data[TYPE_TABLE_POSITIONS] ??= [];
        data[TYPE_TABLE_POSITIONS].push(range);
      },
    }),
    typeTable,
    defineMdastPlugin({
      name: "remark-omit-type-table",
      before(_root, context) {
        const data = context.data as TypeTablePositions;
        for (const range of data[TYPE_TABLE_POSITIONS] ?? []) replaceRange(context, range, "");
      },
      mdxJsxFlowElement(node, context) {
        if (node.name !== outputName || !node.data?.structuredData) return;
        const { structuredData: _, ...rest } = node.data;
        context.setProperty(node, "data", rest);
      },
    }),
  ];
}
