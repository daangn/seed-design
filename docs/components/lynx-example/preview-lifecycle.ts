export interface QueryableShadowRoot {
  querySelector(selectors: string): unknown;
}

interface ConfigurableLynxView {
  globalProps: unknown;
  injectStyleRules?: string[];
  url?: string;
}

export function configureLynxView(element: ConfigurableLynxView, theme: string) {
  element.globalProps = { theme };
}

export const LYNX_WEB_CORE_STYLES_URL = "/__lynx__/web-core.css";

export async function loadLynxWebCoreStyleRules(
  href = LYNX_WEB_CORE_STYLES_URL,
  signal?: AbortSignal,
) {
  const response = await fetch(href, { signal });
  if (!response.ok) {
    throw new Error(`Lynx Web 기본 스타일을 불러오지 못했습니다. (${response.status})`);
  }

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(await response.text());
  const rules = Array.from(styleSheet.cssRules, (rule) => rule.cssText);
  if (rules.length === 0) throw new Error("Lynx Web 기본 스타일이 비어 있습니다.");
  return rules;
}

export function initializeLynxView(
  element: ConfigurableLynxView,
  options: { theme: string; styleRules: string[]; url: string },
) {
  configureLynxView(element, options.theme);
  element.injectStyleRules = options.styleRules;
  element.url = options.url;
}

export function isLynxPageReady(shadowRoot: QueryableShadowRoot | null) {
  return Boolean(shadowRoot?.querySelector('[part="page"]'));
}

export function getLynxErrorMessage(event: Event) {
  if (event instanceof ErrorEvent) return event.message;
  if (event instanceof CustomEvent && event.detail?.error instanceof Error) {
    return event.detail.error.message;
  }
  return "Lynx 예제를 불러오지 못했습니다.";
}
