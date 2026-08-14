import type { Nodes } from "mdast";
import type { FilterElement } from "@/lib/satteri/remark-llms-filter";

/**
 * `processed`에 JSX 그대로 남겨야 하는 MDX 컴포넌트. 룰이 직접 매치하는 이름과, 부모 룰이
 * 속성을 읽는 자식(`CodeBlockTab`)을 함께 담는다.
 *
 * TypeTable은 일부러 빠져 있다. `remarkAutoTypeTable`이 만드는 `type` 속성은 JSX가 섞인 JS
 * 객체 소스라 `typeTableRule`의 JSON.parse가 실패하고, 남겨 두면 그 원본이 llms.txt에 통째로
 * 실린다. 지금처럼 접어서 버리는 편이 낫다.
 *
 * 룰 모듈(아이콘 데이터·rootage 아티팩트 등)을 끌어오지 않도록 이름만 적는다. 이 목록은
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
  "ComponentSpecBlock",
  "IconLibrary",
  "ProgressBoardTable",
  "TokenReference",
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
 * 자식 없는 컴포넌트는 흔적조차 남지 않아, `normalizeLLMBody`가 변환할 노드 자체가 사라진다.
 */
export const preserveRuleElements =
  (filterElement: FilterElement): FilterElement =>
  (node) =>
    isRuleElement(node) ? true : filterElement(node);
