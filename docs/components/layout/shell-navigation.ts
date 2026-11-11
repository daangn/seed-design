/**
 * 클라이언트 이동에서 `DocsShell` island를 유지한다. Next.js가 layout을 유지하고 page만 바꾸던 것과 같다.
 * `src/components/DocsClientRouter.astro`의 swap이 `swapShellBody`를 부르고, `false`면 Astro 기본 교체로 넘어간다.
 *
 * 셸을 유지할 때는 `<body>` 요소와 유지할 island를 그대로 두고 페이지가 내보낸 노드만 바꾼 뒤, 새 문서의
 * 셸 island에서 읽은 props와 slot DOM으로 셸을 동기 렌더링한다(`shell-page.tsx`의 `useShellPage`). 유지할 수 없는
 * 이동(한쪽에 셸이 없음, 셸이 hydrate 전, props를 읽지 못함, 아래 `canKeepBody`)은 `false`를 돌려주고, 셸에는
 * persist 표시가 없으니 Astro 기본 교체가 셸도 body와 함께 바꾼다.
 *
 * router script가 이 모듈을 불러온다. dev에서는 React 컴포넌트·hook이 든 모듈이 React Refresh preamble보다
 * 먼저 실행되면 예외를 던져, 그 모듈을 불러오는 셸 island까지 hydrate하지 못한다 → React 쪽은 `shell-page.tsx`에 둔다.
 */
import { flushSync } from "react-dom";
import { reviveIslandProps } from "@/lib/astro-island-props";
import type { DocsShellProps } from "./docs-shell";

const PERSIST_ATTR = "data-astro-transition-persist";

/**
 * 셸 island. Astro가 모든 island에 붙이는 export 이름으로 찾고, `transition:persist`는 붙이지 않는다.
 * - Astro는 유지한 island를 새 props로 다시 그릴 때 slot(MDX 본문)을 이전 DOM에서 읽고, `startTransition`이라
 *   router가 스크롤을 옮기고 새 script를 실행한 뒤에야 그려진다.
 * - `@fumadocs/astro`가 넣는 `onBeforeSwap`(`node_modules/@fumadocs/astro/dist/navigation.js`)은
 *   `transition:persist-props`가 없는 persist island의 slot에 새 문서의 slot 내용을 옮겨 넣는다. 셸을 persist로
 *   표시하면 `persist-props`를 빠뜨린 페이지 하나에서 새 문서의 slot이 비어 본문이 사라진다.
 * - Astro의 `swapBodyElement`는 `<body>` 요소를 새 것으로 바꾼다. 셸이 `document.body`에 portal로 그린 노드
 *   (메뉴·side panel)가 떨어져 나간 이전 body에 남아 메뉴가 열리지 않는다.
 * `DocsShell` export 이름을 바꾸면 이 selector가 맞지 않아 모든 이동이 body 교체로 넘어간다. 화면은 맞지만 셸 상태가
 * 이동마다 초기화된다 → 이름을 바꾸면 여기도 고친다.
 */
const SHELL = 'astro-island[component-export="DocsShell"]';

/**
 * `<body>` 바로 아래에서 이동할 때 지우는 요소. 셸 페이지(`src/layouts/Layout.astro`)의 HTML이 내보내는 요소와
 * `iframe`이다. dev의 router는 `client:only` island가 있는 페이지로 갈 때마다 다음 페이지를 숨긴 `<iframe>`으로
 * `<body>`에 붙여 스타일을 미리 모으고, 지우는 일은 body 교체에 맡긴다. 남겨 두면 이동마다 하나씩 쌓인다.
 */
const PAGE_ELEMENTS = new Set([
  "astro-island",
  "script",
  "style",
  "link",
  "template",
  "noscript",
  "iframe",
]);

/** 이동한 페이지가 셸에 넘기는 것. */
export interface ShellPage {
  props: Omit<DocsShellProps, "children" | "platformStatus" | "meta">;
  /** island slot 이름(`astro-slot`의 `name`, 기본 slot은 `default`)별 DOM. 아직 문서에 붙지 않았다. */
  slots: Record<string, Node[]>;
}

/** mount된 셸이 새 페이지를 받는 함수. 셸이 없거나 hydrate 전이면 비어 있다. */
let receive: ((page: ShellPage) => void) | undefined;

/** mount된 셸이 새 페이지를 받을 함수를 등록한다. 돌려준 함수로 해제한다. */
export function connectShell(receiver: (page: ShellPage) => void) {
  receive = receiver;
  return () => {
    if (receive === receiver) receive = undefined;
  };
}

/**
 * 셸을 유지한 채 새 문서로 body를 바꾼다. 유지할 수 없으면 아무것도 바꾸지 않고 `false`를 돌려준다.
 * `deselectScripts`·`swapHeadElements` 뒤에 부른다. 새 body의 script는 router가 이어서 실행한다.
 */
export function swapShellBody(newDocument: Document): boolean {
  const island = document.querySelector(SHELL);
  const next = newDocument.querySelector(SHELL);
  // `replacePageNodes`는 `<body>` 바로 아래 노드만 다룬다.
  if (island?.parentElement !== document.body || next?.parentElement !== newDocument.body) {
    return false;
  }

  const page = receive && canKeepBody(newDocument.body) ? readShellPage(next) : undefined;
  if (!page) return false;

  replacePageNodes(newDocument.body, island, next);
  flushSync(() => receive?.(page));

  // router는 body를 바꾼 뒤 실행 표시가 없는 `<script>`를 새 노드로 바꿔 실행한다. 셸이 새로 그린 script
  // (fumadocs 테마 script)가 바뀌면 React가 가진 노드가 문서에서 떨어져 다음 unmount가 실패한다 → 실행 표시를
  // 붙인다. slot 안의 script는 페이지 것이라 router가 실행하게 둔다.
  for (const script of island.querySelectorAll<HTMLScriptElement>(
    "script:not([data-astro-exec])",
  )) {
    if (!script.closest("astro-slot")) script.dataset.astroExec = "";
  }
  return true;
}

/**
 * Astro의 body 교체가 하는 일 중 `replacePageNodes`가 하지 않는 것은 새 `<video>`·`<audio>` 다시 만들기,
 * declarative shadow DOM 붙이기, body 깊은 곳의 `transition:persist` 맞추기다. 새 페이지에 이런 요소가 있으면
 * 셸을 유지하지 않는다.
 */
function canKeepBody(newBody: HTMLElement) {
  if (newBody.querySelector("video, audio, template[shadowrootmode]")) return false;
  return [...newBody.querySelectorAll(`[${PERSIST_ATTR}]`)].every(
    (el) => el.parentElement === newBody,
  );
}

/**
 * `<body>` 요소는 두고 바로 아래 자식을 새 페이지 것으로 바꾼다. 셸(`shell`, 새 문서에서는 `nextShell`)과
 * 유지할 island(`transition:persist`)는 제자리에 두고, 페이지가 내보내지 않은 요소(실행 중에 붙은 portal 등)도 둔다.
 * 셸의 새 props와 slot은 `swapShellBody`가 따로 넘긴다. `<body>` 속성은 모든 페이지가 같아 바꾸지 않는다.
 */
function replacePageNodes(newBody: HTMLElement, shell: Element, nextShell: Element) {
  const body = document.body;
  const kept = new Map<string, Element>();
  for (const node of [...body.childNodes]) {
    if (node === shell) continue;
    const id = node instanceof Element ? node.getAttribute(PERSIST_ATTR) : null;
    if (id && [...newBody.children].some((el) => el.getAttribute(PERSIST_ATTR) === id)) {
      kept.set(id, node as Element);
    } else if (!(node instanceof Element) || PAGE_ELEMENTS.has(node.localName)) {
      node.remove();
    } else if (node.classList.contains("astro-route-announcer")) {
      // router가 이동마다 새로 붙이는 안내 영역이다. body를 바꾸던 때처럼 이전 것은 지운다.
      node.remove();
    }
  }

  // 새 페이지의 순서대로, 유지한 셸·island 사이사이에 새 노드를 놓는다.
  let previous: ChildNode | undefined;
  for (const node of [...newBody.childNodes]) {
    if (node === nextShell) {
      previous = shell;
      continue;
    }
    const id = node instanceof Element ? node.getAttribute(PERSIST_ATTR) : null;
    const old = id ? kept.get(id) : undefined;
    if (old) {
      copyIslandProps(old, node as Element);
      previous = old;
      continue;
    }
    if (previous) previous.after(node);
    else body.prepend(node);
    previous = node;
  }
}

/** 유지한 island가 `transition:persist-props` 없이 다른 props를 받으면 Astro처럼 그 props로 다시 그린다. */
function copyIslandProps(old: Element, next: Element) {
  const persistProps = old.getAttribute("data-astro-transition-persist-props");
  if (old.localName !== "astro-island") return;
  if (persistProps !== null && persistProps !== "false") return;
  const props = next.getAttribute("props");
  if (props === null || props === old.getAttribute("props")) return;
  old.setAttribute("ssr", "");
  old.setAttribute("props", props);
}

function readShellPage(island: Element): ShellPage | undefined {
  let props: Record<string, unknown>;
  try {
    props = reviveIslandProps(island.getAttribute("props") ?? "");
  } catch (error) {
    console.warn("[docs-shell] 새 페이지의 props를 읽지 못해 셸을 다시 그립니다.", error);
    return undefined;
  }
  if (typeof props.pathname !== "string") return undefined;

  const slots: ShellPage["slots"] = {};
  for (const slot of island.querySelectorAll("astro-slot")) {
    // 본문 안 island의 slot은 그 island가 다룬다.
    if (slot.closest("astro-island") !== island) continue;
    slots[slot.getAttribute("name") ?? "default"] = [...slot.childNodes];
  }
  return { props: props as ShellPage["props"], slots };
}
