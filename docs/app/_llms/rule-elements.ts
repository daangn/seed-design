import type { Nodes } from "mdast";
import type { FilterElement } from "@/lib/satteri/remark-llms-filter";

/**
 * `processed`까지 JSX로 도달해야 하는 MDX 컴포넌트. 컴파일 타임 핸들러와 placeholder가
 * 주장하는 이름, 부모 핸들러가 속성을 읽는 자식(`CodeBlockTab`), 그리고 핸들러 없이 태그째
 * 남길 이름(`ELEMENTS_WITHOUT_RULE`)을 함께 담는다.
 *
 * 여기서 빠지면 구조 필터가 태그를 접어 버려 핸들러가 노드를 아예 보지 못한다. 출력에서
 * 조용히 사라질 뿐 오류는 나지 않는다.
 *
 * TypeTable은 일부러 빠져 있다. `remarkAutoTypeTable`이 만드는 `type` 속성은 Shiki가 색칠한
 * JSX라 핸들러가 읽을 표 데이터가 없다. 그래서 보존하는 대신 `remarkTypeTableLlms`가 붙잡아
 * 둔 props로 표를 다시 만들어 `_stringify`에 마크다운째 써 넣는다.
 *
 * 핸들러 모듈(아이콘 데이터·rootage 아티팩트 등)을 끌어오지 않도록 이름만 적는다. 이 목록은
 * `source.tsx`가 모든 페이지 경로에서 import한다.
 */
/**
 * 위 목록에서 대응하는 핸들러가 없는 이름. 여기 없는 이름이 핸들러를 잃으면 그 MDX 태그가
 * llms.txt 본문으로 새어 나가므로, 의도한 예외만 적어 테스트가 나머지를 잡게 한다.
 *
 * `CatalogGrid`가 그 예외다. 카탈로그가 나열하는 문서는 CLI 인덱스와 섹션 llms.txt가 이미
 * 담고 있어 목록을 한 벌 더 펼칠 이유가 없지만, 태그마저 접으면 개요 페이지 본문이 통째로
 * 사라져 내용이 누락된 것처럼 보인다. 태그를 남겨 그 자리에 카탈로그가 있음을 알린다.
 */
export const ELEMENTS_WITHOUT_RULE = ["CatalogGrid"] as const;

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
] as const;

const ruleElementNames: ReadonlySet<string> = new Set(RULE_ELEMENT_NAMES);

const isRuleElement = (node: Nodes) =>
  (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
  node.name !== null &&
  ruleElementNames.has(node.name);

/**
 * 검색 본문용 필터를 llms 출력용으로 바꿔 감쌉니다. 핸들러가 다루는 컴포넌트는 태그째 남기고,
 * 나머지는 넘겨받은 필터에 맡깁니다.
 *
 * 검색은 UI 컴포넌트 태그를 지우는 게 맞지만 llms 출력은 그 태그를 보고 변환한다. 접히고 나면
 * 자식 없는 컴포넌트는 흔적조차 남지 않아, 핸들러가 변환할 노드 자체가 사라진다.
 */
export const preserveRuleElements =
  (filterElement: FilterElement): FilterElement =>
  (node) =>
    isRuleElement(node) ? true : filterElement(node);
