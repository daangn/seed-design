import type { Nodes } from "mdast";
import type { FilterElement } from "@/lib/satteri/remark-llms-filter";

/**
 * `processed`까지 JSX로 도달해야 하는 MDX 컴포넌트. 컴파일 타임 핸들러와 placeholder가
 * 주장하는 이름, 그리고 부모 핸들러가 속성을 읽는 자식(`CodeBlockTab`)을 함께 담는다.
 *
 * 여기서 빠지면 구조 필터가 태그를 접어 버려 핸들러가 노드를 아예 보지 못한다 — 출력에서
 * 조용히 사라질 뿐 오류는 나지 않는다.
 *
 * 핸들러 모듈(아이콘 데이터·rootage 아티팩트 등)을 끌어오지 않도록 이름만 적는다. 이 목록은
 * `source.tsx`가 모든 페이지 경로에서 import한다.
 */
export const RULE_ELEMENT_NAMES = [
  "AvailableSince",
  "Badge",
  "CatalogGrid",
  "ChangelogPage",
  "CodeBlockTab",
  "CodeBlockTabs",
  "ComponentExample",
  "LynxComponentExample",
  "ComponentSpecBlock",
  "IconLibrary",
  "ProgressBoardTable",
  "TokenReference",
  "TypeTable",
] as const;

const ruleElementNames: ReadonlySet<string> = new Set(RULE_ELEMENT_NAMES);

const isRuleElement = (node: Nodes) =>
  (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
  node.name !== null &&
  ruleElementNames.has(node.name);

/**
 * 검색 본문용 필터를 llms 출력용으로 바꿔 감쌉니다. 룰이 다루는 컴포넌트는 태그째 남기고,
 * 나머지는 넘겨받은 필터에 맡깁니다.
 *
 * 검색은 UI 컴포넌트 태그를 지우는 게 맞지만 llms 출력은 그 태그를 보고 변환한다. 접히고 나면
 * 자식 없는 컴포넌트는 흔적조차 남지 않아, 핸들러가 변환할 노드 자체가 사라진다.
 */
export const preserveRuleElements =
  (filterElement: FilterElement): FilterElement =>
  (node) =>
    isRuleElement(node) ? true : filterElement(node);
