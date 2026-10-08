/**
 * 문서 예제를 호스트가 어떻게 배치할지 정한다. 예제는 콘텐츠만 렌더하고 배경·패딩·정렬·높이는 호스트가 맡는다.
 *
 * - `center`: 호스트가 예제를 가운데에 둔다. 가로를 채울 예제는 루트에 `width: 100%`를 둔다.
 * - `fill`: 호스트가 높이가 정해진 영역을 주고, 예제 루트가 `flex: 1`로 그 영역을 채운다.
 *   문서에서는 MDX `height`가 필요하다.
 */
export type LynxExampleLayout = "center" | "fill";

const FILL_COMPONENTS = new Set([
  "keyboard-avoiding-scroll-view",
  "loop-scroll",
  "pull-to-refresh",
]);

const FILL_EXAMPLES = new Set<string>([
  "lynx/contextual-floating-button/float-composition",
  "lynx/floating-action-button/float-composition",
  "lynx/help-bubble/placement",
  "lynx/menu/placement",
  "lynx/result-section/large",
  "lynx/result-section/medium",
  "lynx/result-section/preview",
  "lynx/result-section/with-cta-progress-circle",
  "lynx/tabs/sticky-list",
]);

export function getExampleLayout(id: string): LynxExampleLayout {
  const component = id.split("/")[1] ?? "";
  return FILL_COMPONENTS.has(component) || FILL_EXAMPLES.has(id) ? "fill" : "center";
}
