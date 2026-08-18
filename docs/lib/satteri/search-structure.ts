import type { LLMsOptions } from "@fumadocs/satteri/remark-llms";
import type { StructureOptions } from "@fumadocs/satteri/remark-structure";
import type { Nodes } from "mdast";

export const filterStructureElement: NonNullable<LLMsOptions["filterElement"]> = (node) => {
  if (node.type !== "mdxJsxFlowElement" && node.type !== "mdxJsxTextElement") return true;

  switch (node.name) {
    case "File":
    case "Callout":
    case "Card":
    case "DoImage":
    case "DontImage":
      return true;
    default:
      // TypeTable의 거대한 type 속성과 UI 전용 컴포넌트 태그는 검색 본문에서 제외합니다.
      return "children-only";
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
 * title이 없으면 남길 내용이 없다는 뜻이라 `undefined`. `mdxTypes`가 그런 Callout을 row에서
 * 아예 빼는 판단도 같은 함수로 합니다.
 */
function stringifyCalloutRow(node: Nodes) {
  if (node.type !== "mdxJsxFlowElement" || node.name !== "Callout") return undefined;

  const attributes = node.attributes.flatMap((attribute) => {
    if (attribute.type !== "mdxJsxAttribute") return [];
    if (!CALLOUT_ROW_ATTRIBUTES.includes(attribute.name)) return [];

    // 표현식으로 쓴 속성값(`title={"…"}`)은 Fumadocs 기본 stringifier와 같이 원본 표현식을
    // 읽는다. 문자열만 받으면 그렇게 쓴 Callout이 title 없는 것으로 보여 row가 통째로 빠진다.
    const value = typeof attribute.value === "string" ? attribute.value : attribute.value?.value;

    return value?.trim() ? [{ name: attribute.name, value }] : [];
  });

  if (!attributes.some(({ name }) => name === "title")) return undefined;

  const stringified = attributes
    .map(({ name, value }) => `${name}="${escapeMdxAttributeValue(value)}"`)
    .join(" ");

  return `<Callout ${stringified} />`;
}

export const structureStringify = {
  filterElement: filterStructureElement,
  filterMdxAttributes(node, attribute) {
    if (attribute.type !== "mdxJsxAttribute") return false;

    if (node.name === "DoImage" || node.name === "DontImage") {
      return attribute.name !== "src";
    }

    return true;
  },
  // stringify는 handlers보다 먼저 불리므로, FigmaImage에서 온 이미지만 원래 컴포넌트
  // 형태로 갈라지고 나머지 이미지는 아래 image handler로 넘어간다.
  stringify(node) {
    // remarkFigmaImage가 remarkStructure보다 먼저 <FigmaImage>를 mdast image로 치환한다.
    // 다른 커스텀 컴포넌트와 같은 JSX 형태로 되살려야 검색 결과에서 출처를 표시할 수 있다.
    if (node.type === "image") {
      return node.data?.figmaImage && node.alt
        ? `<FigmaImage alt="${escapeMdxAttributeValue(node.alt)}" />`
        : undefined;
    }

    return stringifyCalloutRow(node);
  },
  handlers: {
    // Fumadocs 기본 stringifier는 이미지를 빈 문자열로 만들어 alt를 통째로 버린다. 문서의
    // 이미지 alt는 그 이미지를 설명하는 유일한 텍스트라, 검색 결과에서 출처를 알아볼 수
    // 있도록 커스텀 컴포넌트와 같은 태그 형태로 남긴다.
    image: (node) => (node.alt ? `<img alt="${escapeMdxAttributeValue(node.alt)}" />` : ""),
  },
} satisfies NonNullable<StructureOptions["stringify"]>;

export const structureOptions: StructureOptions = {
  /**
   * remarkStructure 기본값에서 `blockquote`만 뺐다. satteri의 구현은 upstream과 달리 row가 된
   * 노드의 서브트리를 건너뛰지 않아, blockquote를 row로 잡으면 안의 문단이 같은 문장을 그대로
   * 한 번 더 색인한다. 문단 쪽이 `> ` 표식 없이 본문을 다 갖고 있으므로 그쪽을 남긴다.
   */
  types: ["heading", "paragraph", "tableCell", "mdxJsxFlowElement"],
  mdxTypes(node) {
    // Card는 children이 이미 각자 별도 row로 색인되고, 검색 결과의 URL은 카드가 놓인 페이지라
    // 카드가 가리키는 문서로 데려가지도 못한다. 검색에서만 제외하며 llms.txt에는 그대로 남는다
    // (mdxTypes는 remarkStructure 전용, filterElement는 remarkLlms와 공유).
    if ("name" in node && node.name === "Card") return false;
    if (!("children" in node) || node.children.length === 0) return true;
    if (!("name" in node)) return false;

    switch (node.name) {
      case "TypeTable":
        return true;
      case "Callout":
        return stringifyCalloutRow(node) !== undefined;
      default:
        return false;
    }
  },
  stringify: structureStringify,
};
