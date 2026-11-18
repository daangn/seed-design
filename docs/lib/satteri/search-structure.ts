import type { StructureOptions } from "@fumadocs/satteri/remark-structure";
import type { Nodes } from "mdast";
import { defineMdastPlugin, type MdxJsxFlowElement } from "satteri";
import type { FilterElement } from "./remark-llms-filter";
import { replaceWithChildren } from "./replace-source";

/** 검색 row에 태그째 남기는 컴포넌트. 나머지 UI 컴포넌트는 태그를 접고 자식만 남깁니다. */
export const filterStructureElement: FilterElement = (node) => {
  switch (node.name) {
    case "File":
    case "Callout":
    case "Card":
    case "DoImage":
    case "DontImage":
      return true;
    default:
      return false;
  }
};

/** `mdast-util-mdx-jsx`와 같은 규칙으로 속성값을 이스케이프합니다. */
const escapeMdxAttributeValue = (value: string) => value.replace(/"/g, "&#x22;");

/** Callout row가 남기는 속성. `type`은 배지를 고르고, `title`은 그 배지 옆에 찍힌다. */
const CALLOUT_ROW_ATTRIBUTES = ["type", "title"];

/**
 * `<Callout>`을 자식 없는 태그로 되돌립니다. 안의 문단은 각자 자기 row로 색인되므로 Callout이
 * 본문까지 안으면 같은 문장이 두 번 나오고, 그 row는 코드블록까지 삼킨 벽이 됩니다. Callout이
 * 자식에게 물려줄 수 없는 건 속성값뿐이라 그것만 남깁니다.
 *
 * title이 없으면 남길 내용이 없다는 뜻이라 `undefined`.
 */
function stringifyCalloutRow(node: Readonly<MdxJsxFlowElement>) {
  const attributes = node.attributes.flatMap((attribute) => {
    if (attribute.type !== "mdxJsxAttribute") return [];
    if (!CALLOUT_ROW_ATTRIBUTES.includes(attribute.name)) return [];

    // 표현식으로 쓴 속성값(`title={"…"}`)은 원본 표현식을 읽는다. 문자열만 받으면 그렇게 쓴
    // Callout이 title 없는 것으로 보여 row가 통째로 빠진다.
    const value = typeof attribute.value === "string" ? attribute.value : attribute.value?.value;

    return value?.trim() ? [{ name: attribute.name, value }] : [];
  });

  if (!attributes.some(({ name }) => name === "title")) return undefined;

  const stringified = attributes
    .map(({ name, value }) => `${name}="${escapeMdxAttributeValue(value)}"`)
    .join(" ");

  return `<Callout ${stringified} />`;
}

/** Do/Don't 이미지를 자식 없는 태그로 씁니다. 문자열 속성만 남기고 `src`는 뺍니다. */
function stringifyImageRow(node: Readonly<MdxJsxFlowElement>) {
  const attributes = node.attributes.flatMap((attribute) =>
    attribute.type === "mdxJsxAttribute" &&
    attribute.name !== "src" &&
    typeof attribute.value === "string"
      ? [`${attribute.name}="${escapeMdxAttributeValue(attribute.value)}"`]
      : [],
  );

  return `<${node.name} ${attributes.join(" ")} />`;
}

/** 문단이 이미지 하나뿐이면 그 이미지를 돌려줍니다. */
function soleImage(node: Readonly<Nodes>) {
  if (node.type !== "paragraph" || node.children.length !== 1) return undefined;
  const [child] = node.children;
  return child.type === "image" ? child : undefined;
}

/**
 * `remarkStructure`가 기본 규칙으로 만들지 못하는 검색 row를 채웁니다. `remarkStructure`보다
 * 앞에, `remarkFigmaImage`보다 뒤에 둡니다.
 */
export function remarkSearchRows() {
  return defineMdastPlugin({
    name: "remark-search-rows",
    options: { position: true },
    mdxJsxFlowElement(node, context) {
      if (node.name === "DoImage" || node.name === "DontImage") {
        // remarkFigmaImage가 바꿔 넣은 노드에는 원문 위치가 없어 `remarkStructure`가 row로 잡지
        // 못한다. 빌드가 채운 이미지 주소(`src`)는 내용이 아니라 row에서 뺀다.
        context.setProperty(node, "data", {
          ...node.data,
          structuredData: { contents: [{ heading: undefined, content: stringifyImageRow(node) }] },
        });
        return;
      }
      if (node.name !== "Callout") return;

      const row = stringifyCalloutRow(node);
      if (!row) return;

      // Callout을 row로 잡으면 `remarkStructure`가 그 안의 문단을 건너뛴다. 원문에 없는 빈
      // fragment에 row를 실어 Callout 앞에 두면, 렌더링에는 아무것도 남기지 않고 본문 row와
      // 따로 색인된다.
      context.insertBefore(node, {
        type: "mdxJsxFlowElement",
        name: null,
        attributes: [],
        children: [],
        data: { structuredData: { contents: [{ heading: undefined, content: row }] } },
      });
    },
    tableCell(node, context) {
      // 셀의 원문 범위에는 구분자 `|`와 정렬 공백이 들어 있다. row에는 셀 내용만 남긴다.
      replaceWithChildren(context, node, "search");
    },
    paragraph(node, context) {
      const image = soleImage(node);
      if (!image?.alt) return;

      // `remarkStructure`는 이미지를 지우므로, 이미지만 담은 문단은 row를 직접 실어 준다. 문서의
      // 이미지 alt는 그 이미지를 설명하는 유일한 텍스트라, 검색 결과에서 출처를 알아볼 수 있도록
      // 커스텀 컴포넌트와 같은 태그 형태로 남긴다. remarkFigmaImage가 만든 이미지는 원래 컴포넌트
      // 이름으로 되살린다. 문단과 이미지의 원문 범위가 같아 편집(`replaceSource`)으로는 이미지를
      // 지우는 편집을 이길 수 없다.
      const tag = image.data?.figmaImage ? "FigmaImage" : "img";
      const content = `<${tag} alt="${escapeMdxAttributeValue(image.alt)}" />`;
      context.setProperty(node, "data", {
        ...node.data,
        structuredData: { contents: [{ heading: undefined, content }] },
      });
    },
  });
}

/**
 * remarkStructure 기본값에서 `blockquote`를 빼고 `table` 대신 `tableCell`을 쓴다. blockquote
 * row는 `> ` 표식까지 원문 그대로 잘라 오므로, 같은 본문을 가진 안쪽 문단을 남긴다.
 */
const ROW_TYPES = new Set(["heading", "paragraph", "tableCell", "mdxJsxFlowElement"]);

export const structureOptions: StructureOptions = {
  types(node) {
    if (!ROW_TYPES.has(node.type)) return false;
    // Card는 children이 이미 각자 별도 row로 색인되고, 검색 결과의 URL은 카드가 놓인 페이지라
    // 카드가 가리키는 문서로 데려가지도 못한다. Callout은 `remarkSearchRows`가 title row를 따로
    // 만든다. `mdxTypes`는 여러 줄에 걸친 요소에만 물어서, 한 줄로 쓴 요소까지 빼려면 여기서 거른다.
    return !(
      node.type === "mdxJsxFlowElement" &&
      (node.name === "Card" || node.name === "Callout")
    );
  },
  mdxTypes: (node) => !("children" in node) || node.children.length === 0,
  filterElement: filterStructureElement,
};
