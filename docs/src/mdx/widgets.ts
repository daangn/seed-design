/**
 * MDX 정적 마크업 위의 동작. `data-widget="<WidgetName>"` 요소에 `document` 이벤트 위임으로 붙는다.
 *
 * 불변식
 * - 리스너는 `document`에 한 번만 등록한다(`client.ts`의 `window` 플래그 아래에서만 `initWidgets`를 부른다).
 *   예외: 열린 popup(help-bubble·color-swatch)이 열린 동안만 `document`·`window`에 붙였다가 닫을 때 떼는 listener.
 * - 탭·아코디언을 widget으로 처리한다(오너 결정 1). 모든 탭·아코디언에 이 한 방식만 쓴다.
 * - widget은 DOM을 만들지 않는다. aria-*, data-*, hidden, tabindex, src와 CSS 변수(`style`)만 바꾼다(확대 dialog는
 *   `DocsShell.astro`의 정적 요소).
 * - 탭·아코디언의 상태 속성은 해당 SEED React 컴포넌트가 같은 상태에서 그리는 속성과 같게 둔다.
 * - React를 import하지 않는다(`.astro` `<script>`에서 import된다).
 * - 이름 목록은 `WIDGETS`의 키 하나다. 마크업은 `WidgetName` 타입의 문자열만 쓴다.
 */

export type WidgetName =
  | "copy"
  | "tabs"
  | "zoom"
  | "heading-link"
  | "accordion"
  | "expand"
  | "row-highlight"
  | "help-bubble"
  | "color-swatch";

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

// ───────────────────────── expand ─────────────────────────

/**
 * rootage 표의 해결 경로 펼침(`components/token-cell.tsx`). root(행 `tr` 또는 셀 `div`)를 누르면 가장 가까운 `tr`
 * (없으면 root)에 `data-expanded`를 토글하고, 그 안 모든 TokenCell(`[data-token-cell]`)의 `aria-expanded`를 맞춘다.
 * 펼친·접힌 마크업은 둘 다 정적으로 있고 `group/expand` + `group-data-expanded/expand:`가 보일 쪽을 고른다.
 * 행 안의 링크 클릭은 무시한다. 복사·설명 버튼은 자기 widget이 먼저 받는다.
 */
const expand: Widget = {
  events: ["click"],
  handle(event, root) {
    const link = (event.target as Element).closest("a");
    if (link && root.contains(link)) return;
    const host = root.closest("tr") ?? root;
    const expanded = !host.hasAttribute("data-expanded");
    host.toggleAttribute("data-expanded", expanded);
    for (const cell of host.querySelectorAll("[data-token-cell]")) {
      cell.setAttribute("aria-expanded", String(expanded));
    }
  },
};

// ───────────────────────── row-highlight ─────────────────────────

/**
 * 컴포넌트 spec 표(`components/component-variant-table.tsx`)의 행 hover 강조. root(`tbody`) 안에서 hover한 행과
 * `data-hover-key`가 같은 행 모두에 `data-highlighted`를 붙이고, 같은 key 밖으로 나가면 뗀다.
 */
const HOVER_ROW = "tr[data-hover-key]";

function highlightRows(root: HTMLElement, key: string | undefined): void {
  for (const row of root.querySelectorAll<HTMLElement>(HOVER_ROW)) {
    row.toggleAttribute("data-highlighted", key !== undefined && row.dataset.hoverKey === key);
  }
}

const rowHighlight: Widget = {
  events: ["mouseover", "mouseout"],
  handle(event, root) {
    const row = (event.target as Element).closest<HTMLElement>(HOVER_ROW);
    if (!row || !root.contains(row)) return;
    if (event.type === "mouseover") {
      if (!row.hasAttribute("data-highlighted")) highlightRows(root, row.dataset.hoverKey);
      return;
    }
    const related = (event as MouseEvent).relatedTarget;
    const next = related instanceof Element ? related.closest<HTMLElement>(HOVER_ROW) : null;
    if (next && root.contains(next) && next.dataset.hoverKey === row.dataset.hoverKey) return;
    highlightRows(root, undefined);
  },
};

// ───────────────────────── help-bubble ─────────────────────────

/**
 * 설명 버튼의 HelpBubble(`components/description-button.tsx`). 마크업은 SEED `HelpBubbleTrigger`의 서버 HTML과 같은
 * recipe class·DOM이고 닫힌 상태로 정적으로 있다. root는 trigger와 positioner를 감싼 요소다.
 * - 열림: trigger `aria-expanded="true"`, 각 부분에 `data-open`, content `hidden` 없음. 닫힘은 그 반대이고 content의
 *   exit 애니메이션이 끝나면 `hidden`을 붙인다(애니메이션이 없으면 바로).
 * - 위치: SEED HelpBubble 기본값(placement top, gutter 4px + arrow tip 8px, viewport 안쪽 16px, arrow padding 14px)을
 *   흉내 낸다. positioner는 `position: fixed`이고 widget이 CSS 변수(`--help-bubble-x`·`-y`·`-arrow-x`)를 쓴다. 위 공간이
 *   없으면 bottom으로 뒤집고 `data-side`를 바꾼다(arrow 회전은 CSS).
 * - 한 번에 하나만 연다. 열린 동안 Esc·바깥 pointerdown으로 닫고, scroll(capture)·resize에 위치를 다시 잡는다. 이
 *   listener는 열 때 `document`·`window`에 붙이고 닫을 때 뗀다.
 * - focus는 SEED HelpBubble(`autoFocus` false, FloatingFocusManager `modal={false}`)과 같다. 열어도 trigger에 남고,
 *   content(`tabindex="0"`)는 trigger 다음 Tab 정지점이다. focus가 trigger·content 밖 요소로 옮겨 가면 닫고, Esc나
 *   trigger로 닫으면 trigger로 돌려준다(`closeBubble`). `aria-controls`는 열린 동안만 둔다.
 */
const BUBBLE_PADDING = 16;
const BUBBLE_OFFSET = 12;
const BUBBLE_ARROW = 12;
const BUBBLE_ARROW_PADDING = 14;

interface OpenBubble {
  root: HTMLElement;
  trigger: HTMLElement;
  positioner: HTMLElement;
  content: HTMLElement;
}

let openBubble: OpenBubble | null = null;

function bubbleParts(root: HTMLElement): OpenBubble | undefined {
  const trigger = root.querySelector<HTMLElement>('[aria-haspopup="dialog"]');
  const content = root.querySelector<HTMLElement>('[role="dialog"]');
  const positioner = content?.parentElement;
  return trigger && content && positioner ? { root, trigger, positioner, content } : undefined;
}

function bubbleStateParts({ trigger, positioner }: OpenBubble): Element[] {
  // SEED HelpBubble이 상태 속성(`data-side`·`data-open`)을 그리는 부분들. 마크업이 `data-side`로 표시한다.
  return [trigger, positioner, ...positioner.querySelectorAll("[data-side]")];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function positionBubble(bubble: OpenBubble): void {
  const { trigger, positioner, content } = bubble;
  const viewport = document.documentElement;
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  // 이전 위치의 오른쪽 끝에 눌려 줄바꿈된 너비로 재지 않도록 왼쪽 끝에서 잰다.
  positioner.style.setProperty("--help-bubble-x", "0px");
  positioner.style.setProperty("--seed-popover-available-width", `${vw - BUBBLE_PADDING * 2}px`);
  // offsetWidth/Height는 enter 애니메이션의 scale에 영향받지 않는다.
  const width = content.offsetWidth;
  const height = content.offsetHeight;
  const anchor = trigger.getBoundingClientRect();
  const center = anchor.left + anchor.width / 2;

  const x = clamp(center - width / 2, BUBBLE_PADDING, vw - BUBBLE_PADDING - width);
  const top = anchor.top - BUBBLE_OFFSET - height;
  const bottom = anchor.bottom + BUBBLE_OFFSET;
  const side = top < BUBBLE_PADDING && bottom + height <= vh - BUBBLE_PADDING ? "bottom" : "top";
  const arrowX = clamp(
    center - x - BUBBLE_ARROW / 2,
    BUBBLE_ARROW_PADDING,
    width - BUBBLE_ARROW_PADDING - BUBBLE_ARROW,
  );

  positioner.style.setProperty("--help-bubble-x", `${x}px`);
  positioner.style.setProperty("--help-bubble-y", `${side === "top" ? top : bottom}px`);
  positioner.style.setProperty("--help-bubble-arrow-x", `${arrowX}px`);
  content.style.setProperty(
    "--seed-popover-transform-origin",
    side === "top" ? "center bottom" : "center top",
  );
  for (const part of bubbleStateParts(bubble)) part.setAttribute("data-side", side);
}

function onBubbleReposition(): void {
  if (!openBubble) return;
  if (!openBubble.content.isConnected) closeBubble();
  else positionBubble(openBubble);
}

function onBubbleKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape" && !event.isComposing) closeBubble(true);
}

function onBubbleFocusout(event: FocusEvent): void {
  if (!openBubble) return;
  const { trigger, content } = openBubble;
  const inside = (node: EventTarget | null) =>
    node instanceof Node && (trigger.contains(node) || content.contains(node));
  // 창 전환처럼 받을 요소가 없는 blur는 닫지 않는다.
  if (inside(event.target) && event.relatedTarget instanceof Node && !inside(event.relatedTarget))
    closeBubble();
}

function onBubblePointerdown(event: PointerEvent): void {
  if (!openBubble) return;
  const target = event.target;
  if (
    target instanceof Node &&
    (openBubble.content.contains(target) || openBubble.trigger.contains(target))
  )
    return;
  closeBubble();
}

function openHelpBubble(bubble: OpenBubble): void {
  if (openBubble) closeBubble();
  openBubble = bubble;
  bubble.trigger.setAttribute("aria-expanded", "true");
  bubble.trigger.setAttribute("aria-controls", bubble.content.id);
  bubble.content.hidden = false;
  for (const part of bubbleStateParts(bubble)) part.setAttribute("data-open", "");
  positionBubble(bubble);
  document.addEventListener("scroll", onBubbleReposition, true);
  window.addEventListener("resize", onBubbleReposition);
  document.addEventListener("keydown", onBubbleKeydown);
  document.addEventListener("pointerdown", onBubblePointerdown, true);
  document.addEventListener("focusout", onBubbleFocusout);
}

/**
 * `returnFocus`(Esc·trigger로 닫을 때)면 focus가 content 안이나 body(Safari는 버튼 클릭에 focus를 주지 않는다)에
 * 있을 때 trigger로 돌려준다. 바깥 pointerdown·focus 이탈로 닫을 때는 그대로 둔다.
 */
function closeBubble(returnFocus = false): void {
  const bubble = openBubble;
  if (!bubble) return;
  openBubble = null;
  const focused = document.activeElement;
  if (returnFocus && (!focused || focused === document.body || bubble.content.contains(focused)))
    bubble.trigger.focus();
  document.removeEventListener("scroll", onBubbleReposition, true);
  window.removeEventListener("resize", onBubbleReposition);
  document.removeEventListener("keydown", onBubbleKeydown);
  document.removeEventListener("pointerdown", onBubblePointerdown, true);
  document.removeEventListener("focusout", onBubbleFocusout);
  bubble.trigger.setAttribute("aria-expanded", "false");
  bubble.trigger.removeAttribute("aria-controls");
  for (const part of bubbleStateParts(bubble)) part.removeAttribute("data-open");
  // exit 애니메이션이 있으면 `animationend`(handle)가 `hidden`을 붙인다.
  const style = window.getComputedStyle(bubble.content);
  const animated =
    style.animationName !== "none" &&
    style.animationDuration.split(",").some((value) => Number.parseFloat(value) > 0);
  if (!animated || !bubble.content.isConnected) bubble.content.hidden = true;
}

const helpBubble: Widget = {
  events: ["click", "animationend"],
  handle(event, root) {
    const parts = bubbleParts(root);
    if (!parts) return;
    if (event.type === "animationend") {
      if (event.target === parts.content && !parts.content.hasAttribute("data-open"))
        parts.content.hidden = true;
      return;
    }
    // content 안 클릭도 여기서 끝난다(행 펼침으로 버블링하지 않는다).
    if (!parts.trigger.contains(event.target as Node)) return;
    if (openBubble?.root === root) closeBubble(true);
    else openHelpBubble(parts);
  },
};

// ───────────────────────── color-swatch ─────────────────────────

/**
 * 팔레트 색 칸(`components/color-swatch.tsx`). root는 칸 버튼·backdrop 버튼·popup을 감싼 요소다.
 * 칸(`[data-swatch]`)을 누르면 칸과 popup에 `data-open`을 붙이고 backdrop·popup의 `hidden`을 푼 뒤, popup 위치를
 * CSS 변수(`--swatch-top`·`--swatch-left`·`--swatch-right`)로 칸 아래 8px·왼쪽 정렬로 둔다(오른쪽이 화면을 넘으면
 * 오른쪽 정렬). backdrop(`[data-swatch-backdrop]`) 클릭과 Esc로 닫는다. 복사 행은 `copy` widget이 먼저 받는다.
 * popup은 portal이 아니라 칸 바로 뒤에 있어 Tab으로 backdrop·복사 행에 들어갈 수 있다. 그 안에서 Esc나 키보드로
 * backdrop을 눌러 닫으면 숨겨지는 요소에 남지 않도록 focus를 칸으로 돌려준다(마우스로 닫을 때는 그대로 둔다).
 */
const SWATCH_GAP = 8;

let openSwatch: HTMLElement | null = null;

function swatchParts(root: HTMLElement) {
  return {
    swatch: root.querySelector<HTMLElement>("[data-swatch]"),
    backdrop: root.querySelector<HTMLElement>("[data-swatch-backdrop]"),
    popup: root.querySelector<HTMLElement>("[data-swatch-popup]"),
  };
}

function onSwatchKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape" && !event.isComposing) closeSwatch(true);
}

/** `returnFocus`면 focus가 backdrop·popup 안에 있을 때 칸으로 돌려준다. */
function closeSwatch(returnFocus = false): void {
  const root = openSwatch;
  if (!root) return;
  openSwatch = null;
  document.removeEventListener("keydown", onSwatchKeydown);
  const { swatch, backdrop, popup } = swatchParts(root);
  const focused = document.activeElement;
  if (returnFocus && (backdrop?.contains(focused) || popup?.contains(focused))) swatch?.focus();
  swatch?.removeAttribute("data-open");
  popup?.removeAttribute("data-open");
  if (backdrop) backdrop.hidden = true;
  if (popup) popup.hidden = true;
}

function openColorSwatch(root: HTMLElement): void {
  const { swatch, backdrop, popup } = swatchParts(root);
  if (!swatch || !backdrop || !popup) return;
  if (openSwatch) closeSwatch();
  openSwatch = root;
  const rect = swatch.getBoundingClientRect();
  popup.style.setProperty("--swatch-top", `${rect.bottom + SWATCH_GAP}px`);
  popup.style.setProperty("--swatch-left", `${rect.left}px`);
  popup.style.setProperty("--swatch-right", "auto");
  swatch.setAttribute("data-open", "");
  popup.setAttribute("data-open", "");
  backdrop.hidden = false;
  popup.hidden = false;
  if (popup.getBoundingClientRect().right > window.innerWidth) {
    popup.style.setProperty("--swatch-left", "auto");
    popup.style.setProperty("--swatch-right", `${window.innerWidth - rect.right}px`);
  }
  document.addEventListener("keydown", onSwatchKeydown);
}

const colorSwatch: Widget = {
  events: ["click"],
  handle(event, root) {
    const target = event.target as Element;
    // 키보드로 누른 click은 `detail`이 0이다.
    if (target.closest("[data-swatch-backdrop]")) closeSwatch((event as MouseEvent).detail === 0);
    else if (target.closest("[data-swatch]")) openColorSwatch(root);
  },
};

const WIDGETS: Record<WidgetName, Widget> = {
  copy,
  tabs,
  zoom,
  "heading-link": headingLink,
  accordion,
  expand,
  "row-highlight": rowHighlight,
  "help-bubble": helpBubble,
  "color-swatch": colorSwatch,
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
