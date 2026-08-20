export interface QueryableShadowRoot {
  querySelector(selectors: string): unknown;
}

interface ThemeConfigurableLynxView {
  globalProps: unknown;
}

interface ConfigurableLynxView extends ThemeConfigurableLynxView {
  browserConfig?: Record<string, unknown>;
  injectStyleRules?: string[];
  transformVH: boolean;
  transformVW: boolean;
  url?: string;
}

const LYNX_WEB_RUNTIME_SDK_VERSION = "3.5";
export const DEFAULT_LYNX_PREVIEW_MIN_HEIGHT = 320;

export function getLynxPreviewSizing(height?: number) {
  if (height !== undefined) {
    return {
      autoHeight: false,
      containerStyle: { height },
      viewStyle: { height },
    } as const;
  }

  return {
    autoHeight: true,
    containerStyle: { minHeight: DEFAULT_LYNX_PREVIEW_MIN_HEIGHT },
    viewStyle: { height: "auto" },
  } as const;
}

export function configureLynxView(element: ThemeConfigurableLynxView, theme: string) {
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
  options: { theme: string; styleRules: string[]; transformVH: boolean; url: string },
) {
  element.browserConfig = { lynxSdkVersion: LYNX_WEB_RUNTIME_SDK_VERSION };
  element.transformVW = true;
  element.transformVH = options.transformVH;
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
