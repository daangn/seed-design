/**
 * MDX 정적 마크업 위의 동작. `data-widget="<WidgetName>"` 요소에 `document` 이벤트 위임으로 붙는다.
 *
 * 불변식
 * - 리스너는 `document`에 한 번만 등록한다(`client.ts`의 `window` 플래그 아래에서만 `initWidgets`를 부른다).
 * - 탭·아코디언을 widget으로 처리한다(오너 결정 1). 모든 탭·아코디언에 이 한 방식만 쓴다.
 * - widget은 DOM을 만들지 않는다. aria-*, data-*, hidden, tabindex, src와 CSS 변수(`style`)만 바꾼다(확대 dialog는
 *   `DocsShell.astro`의 정적 요소).
 * - 탭·아코디언의 상태 속성은 해당 SEED React 컴포넌트가 같은 상태에서 그리는 속성과 같게 둔다.
 * - React를 import하지 않는다(`.astro` `<script>`에서 import된다).
 * - 이름 목록은 `WIDGETS`의 키 하나다. 마크업은 `WidgetName` 타입의 문자열만 쓴다.
 */

export type WidgetName = "copy" | "tabs" | "zoom" | "heading-link" | "accordion";

interface Widget {
  /** 위임할 이벤트. 모두 버블링하는 이벤트다. */
  events: Array<keyof DocumentEventMap>;
  handle(event: Event, root: HTMLElement): void;
  /** 새 DOM(첫 로드, after-swap)에 저장된 상태를 반영한다. */
  sync?(root: HTMLElement): void;
}

const COPIED_MS = 2000;
/** 기존 `components/tabs/use-synced-tab.ts`와 같은 저장 키·이벤트 이름. */
const TAB_SYNC_KEY = "seed-tabs-sync";

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // 저장소를 쓸 수 없으면(사파리 private 등) 이 탭에서만 동기화한다.
  }
}

async function writeClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

function markCopied(button: HTMLElement): void {
  button.setAttribute("data-copied", "");
  // 이름을 aria-label로 가진 버튼(코드 복사 아이콘)만 복사됨을 이름으로 알린다. 글자가 이름인 버튼은 그대로 둔다.
  const label = button.getAttribute("data-copy-label") ?? button.getAttribute("aria-label");
  if (label !== null) {
    button.setAttribute("data-copy-label", label);
    button.setAttribute("aria-label", "코드가 복사되었습니다");
  }
  window.setTimeout(() => {
    button.removeAttribute("data-copied");
    if (label !== null) button.setAttribute("aria-label", label);
  }, COPIED_MS);
}

// ───────────────────────── tabs ─────────────────────────

/**
 * SEED `ChipTabs`(`@seed-design/react-tabs`)와 같은 속성으로 탭을 바꾼다. trigger는 `data-value`, panel은 trigger의
 * `aria-controls`로 찾는다. 선택된 trigger·panel만 `aria-selected="true"`·`data-selected`를 갖고, panel은
 * `aria-hidden`으로 숨김을 알린다. 코드 카드(`data-code-card`)는 선택된 panel만 focus 순서에 넣는다.
 */

/** 이 root에 속한 trigger만(중첩 탭 제외). */
function ownTriggers(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[role="tab"][data-ownedby]')).filter(
    (element) => element.closest('[data-widget="tabs"]') === root,
  );
}

function tabValues(root: HTMLElement): string[] {
  return ownTriggers(root).map((tab) => tab.dataset.value ?? "");
}

function selectTab(root: HTMLElement, value: string): void {
  const focusablePanels = root.hasAttribute("data-code-card");
  for (const tab of ownTriggers(root)) {
    const selected = tab.dataset.value === value;
    tab.toggleAttribute("data-selected", selected);
    if (selected) tab.setAttribute("aria-selected", "true");
    else tab.removeAttribute("aria-selected");
    tab.tabIndex = selected ? 0 : -1;

    const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
    if (!panel) continue;
    panel.toggleAttribute("data-selected", selected);
    panel.setAttribute("aria-hidden", String(!selected));
    if (selected) panel.setAttribute("aria-selected", "true");
    else panel.removeAttribute("aria-selected");
    panel.tabIndex = focusablePanels && selected ? 0 : -1;
  }
}

function selectGroup(group: string, value: string): void {
  for (const root of document.querySelectorAll<HTMLElement>(
    '[data-widget="tabs"][data-tab-group]',
  )) {
    if (root.dataset.tabGroup === group && tabValues(root).includes(value)) selectTab(root, value);
  }
}

function chooseTab(root: HTMLElement, value: string): void {
  const group = root.dataset.tabGroup;
  if (!group) {
    selectTab(root, value);
    return;
  }
  writeStorage(`${TAB_SYNC_KEY}:${group}`, value);
  selectGroup(group, value);
}

const tabs: Widget = {
  events: ["click", "keydown"],
  handle(event, root) {
    const tab = (event.target as Element).closest<HTMLElement>('[role="tab"][data-ownedby]');
    if (!tab || tab.closest('[data-widget="tabs"]') !== root) return;
    const value = tab.dataset.value ?? "";
    if (event.type === "click") {
      chooseTab(root, value);
      return;
    }
    const key = (event as KeyboardEvent).key;
    const triggers = ownTriggers(root);
    const index = triggers.indexOf(tab);
    const next =
      key === "ArrowRight"
        ? triggers[(index + 1) % triggers.length]
        : key === "ArrowLeft"
          ? triggers[(index - 1 + triggers.length) % triggers.length]
          : key === "Home"
            ? triggers[0]
            : key === "End"
              ? triggers.at(-1)
              : undefined;
    if (!next || (event as KeyboardEvent).isComposing) return;
    event.preventDefault();
    chooseTab(root, next.dataset.value ?? "");
    next.focus();
  },
  sync(root) {
    const group = root.dataset.tabGroup;
    const stored = group ? readStorage(`${TAB_SYNC_KEY}:${group}`) : null;
    if (stored && tabValues(root).includes(stored)) selectTab(root, stored);
  },
};

// ───────────────────────── copy ─────────────────────────

/**
 * `data-copy-text`가 있으면 그 값을(토큰 값·CSS 변수 이름), 없으면 가장 가까운 코드 카드의 보이는 `<pre>`를 복사한다.
 * 복사 뒤 2초 동안 `data-copied`가 붙는다(아이콘 전환은 CSS).
 */
const copy: Widget = {
  events: ["click"],
  handle(_event, root) {
    const text = root.dataset.copyText;
    if (text !== undefined) {
      void writeClipboard(text).then(() => markCopied(root));
      return;
    }
    const card = root.closest<HTMLElement>("[data-code-card]");
    if (!card) return;
    // 탭이 있는 카드는 보이는 탭의 `<pre>`를 복사한다.
    const pres = Array.from(card.querySelectorAll<HTMLElement>("pre"));
    const pre = pres.find((element) => element.offsetParent !== null) ?? pres[0];
    if (!pre) return;
    const clone = pre.cloneNode(true) as HTMLElement;
    for (const node of clone.querySelectorAll(".nd-copy-ignore")) node.replaceWith("\n");
    void writeClipboard(clone.textContent ?? "").then(() => markCopied(root));
  },
};

// ───────────────────────── heading-link ─────────────────────────

const headingLink: Widget = {
  events: ["click"],
  handle(_event, root) {
    const id = root.dataset.headingId;
    if (!id) return;
    const url = new URL(window.location.href);
    url.hash = id;
    void writeClipboard(url.href).then(() => markCopied(root));
  },
};

// ───────────────────────── zoom ─────────────────────────

const ZOOM_DIALOG_ID = "docs-zoom-dialog";

const zoom: Widget = {
  events: ["click"],
  handle(_event, root) {
    // 열린 확대 dialog(정적 요소, `data-widget="zoom"`)는 아무 곳이나 누르면 닫힌다.
    if (root instanceof HTMLDialogElement) {
      root.close();
      return;
    }
    const dialog = document.getElementById(ZOOM_DIALOG_ID);
    const image = dialog?.querySelector("img");
    if (!(dialog instanceof HTMLDialogElement) || !image || !(root instanceof HTMLImageElement))
      return;
    image.src = root.currentSrc || root.src;
    image.alt = root.alt;
    dialog.showModal();
  },
};

// ───────────────────────── accordion ─────────────────────────

/**
 * SEED `Accordion`(`@seed-design/react-accordion` + `react-collapsible`)과 같은 속성으로 열고 닫는다.
 * - 열린 항목: item·trigger·title·suffixIcon·content에 `data-open`, trigger `aria-expanded="true"`, content `hidden` 없음.
 * - 높이 애니메이션: recipe가 `[data-open]`에서 `height: var(--collapsible-content-height)`를 쓴다. 열 때 0 → 내용 높이로
 *   늘린 뒤 `auto`로 풀어(안의 탭 전환 등으로 높이가 바뀌어도 잘리지 않게) 두고, 닫을 때 현재 높이 → 0으로 줄인 뒤
 *   `hidden`을 붙인다. transition이 없으면(지속 시간 0) 바로 끝 상태로 간다.
 * - `data-accordion-multiple`이 없는 root는 한 번에 하나만 연다(SEED `multiple` 기본값 false).
 */
const ACCORDION_TRIGGER = "button[data-ownedby]";
const CONTENT_HEIGHT = "--collapsible-content-height";

function accordionTriggers(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(ACCORDION_TRIGGER)).filter(
    (trigger) =>
      trigger.dataset.ownedby === root.id && trigger.getAttribute("aria-disabled") !== "true",
  );
}

interface AccordionParts {
  item: HTMLElement;
  trigger: HTMLElement;
  content: HTMLElement;
}

function accordionParts(trigger: HTMLElement): AccordionParts | undefined {
  const item = trigger.parentElement?.parentElement;
  const content = item?.querySelector<HTMLElement>(':scope > [role="region"]');
  return item && content ? { item, trigger, content } : undefined;
}

function hasTransition(element: HTMLElement): boolean {
  return window
    .getComputedStyle(element)
    .transitionDuration.split(",")
    .some((value) => Number.parseFloat(value) > 0);
}

function setAccordionOpen({ item, trigger, content }: AccordionParts, open: boolean): void {
  if ((trigger.getAttribute("aria-expanded") === "true") === open) return;
  trigger.setAttribute("aria-expanded", String(open));
  const parts = [
    item,
    trigger,
    content,
    ...trigger.querySelectorAll<HTMLElement>(":scope > span > *"),
  ];

  if (open) {
    content.hidden = false;
    content.style.setProperty(CONTENT_HEIGHT, "0px");
    void content.offsetHeight; // 0px에서 시작하도록 style을 확정한다.
    content.style.setProperty(CONTENT_HEIGHT, `${content.scrollHeight}px`);
    for (const part of parts) part.setAttribute("data-open", "");
    if (!hasTransition(content)) content.style.setProperty(CONTENT_HEIGHT, "auto");
    return;
  }

  content.style.setProperty(CONTENT_HEIGHT, `${content.scrollHeight}px`);
  void content.offsetHeight;
  for (const part of parts) part.removeAttribute("data-open");
  if (!hasTransition(content)) content.hidden = true;
}

const accordion: Widget = {
  events: ["click", "keydown", "transitionend"],
  handle(event, root) {
    if (event.type === "transitionend") {
      const content = event.target as HTMLElement;
      if (
        (event as TransitionEvent).propertyName !== "height" ||
        content.getAttribute("role") !== "region"
      )
        return;
      if (content.hasAttribute("data-open")) content.style.setProperty(CONTENT_HEIGHT, "auto");
      else content.hidden = true;
      return;
    }

    const trigger = (event.target as Element).closest<HTMLElement>(ACCORDION_TRIGGER);
    if (!trigger || trigger.dataset.ownedby !== root.id) return;

    if (event.type === "keydown") {
      const key = (event as KeyboardEvent).key;
      const triggers = accordionTriggers(root);
      const index = triggers.indexOf(trigger);
      const next =
        key === "ArrowDown"
          ? triggers[(index + 1) % triggers.length]
          : key === "ArrowUp"
            ? triggers[(index - 1 + triggers.length) % triggers.length]
            : key === "Home"
              ? triggers[0]
              : key === "End"
                ? triggers.at(-1)
                : undefined;
      if (!next || (event as KeyboardEvent).isComposing) return;
      event.preventDefault();
      next.focus();
      return;
    }

    if (trigger.getAttribute("aria-disabled") === "true") return;
    const parts = accordionParts(trigger);
    if (!parts) return;
    const open = trigger.getAttribute("aria-expanded") !== "true";
    if (open && !root.hasAttribute("data-accordion-multiple")) {
      for (const other of accordionTriggers(root)) {
        const otherParts = other === trigger ? undefined : accordionParts(other);
        if (otherParts) setAccordionOpen(otherParts, false);
      }
    }
    setAccordionOpen(parts, open);
  },
};

const WIDGETS: Record<WidgetName, Widget> = {
  copy,
  tabs,
  zoom,
  "heading-link": headingLink,
  accordion,
};

function widgetName(element: Element): WidgetName | undefined {
  const name = element.getAttribute("data-widget");
  return name && name in WIDGETS ? (name as WidgetName) : undefined;
}

/**
 * `src/shell/client.ts`의 `initShell()`이 한 번 부른다. 중복 등록 방지는 그 함수의 `window` 플래그가 맡는다.
 */
export function initWidgets(): void {
  const events = new Set(Object.values(WIDGETS).flatMap((widget) => widget.events));
  for (const type of events) {
    document.addEventListener(type, (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      // 가장 가까운 widget부터 이 이벤트를 받는 widget을 찾는다(widget 안의 widget이 먼저 받는다).
      let element: Element | null = target.closest("[data-widget]");
      while (element) {
        const name = widgetName(element);
        const widget = name ? WIDGETS[name] : undefined;
        if (widget?.events.includes(type as keyof DocumentEventMap)) {
          widget.handle(event, element as HTMLElement);
          return;
        }
        element = element.parentElement?.closest("[data-widget]") ?? null;
      }
    });
  }
  syncWidgets(document);
}

/** 새 DOM에 저장 상태를 반영한다. 첫 로드와(Phase 2) `astro:after-swap`(paint 전)에서 부른다. */
export function syncWidgets(scope: ParentNode): void {
  for (const element of scope.querySelectorAll<HTMLElement>("[data-widget]")) {
    const name = widgetName(element);
    if (name) WIDGETS[name].sync?.(element);
  }
}
