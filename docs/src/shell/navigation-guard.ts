/**
 * ClientRouter 이동을 전체 문서 로드로 바꾸는 두 경계. 이 판정을 하는 곳은 이 모듈뿐이다.
 *
 * 1. 빌드 경계(archive ↔ latest). archive 채널(`/react/v3/…`)과 latest는 서로 다른 빌드다. 기본 swap으로 넘어가면
 *    이전 빌드의 persist `DocsNav`·module script가 다른 빌드의 문서에 남는다.
 *    → `astro:before-preparation`에서 URL만 보고 동기로 `preventDefault()`.
 * 2. 배포 skew. 열린 탭이 이전 배포의 셸 JS를 들고 있는데 새 배포의 HTML을 받은 경우.
 *    → 원래 loader를 감싸 새 문서를 받은 뒤 셸 서명을 비교하고, 다르면 `preventDefault()`.
 *
 * 두 경우 모두 router가 `location.href = to.href`로 전체 로드한다(S1-c: document 요청 1, console error 0). skew 경로는
 * HTML을 두 번 받는다(받아들인 비용). 전체 로드에서는 폴더 상태가 초기 상태로 돌아간다(오너 결정 9).
 *
 * 불변식
 * - Astro island 마크업 속성(`component-url`, `renderer-url`)은 `shellSignature()` 밖에서 읽지 않는다.
 * - 셸 서명은 `client="load"` island 전부의 (component-url, renderer-url)이다. 문서 셸에서 `client:load`는
 *   `DocsNav`·`SiteHeader`뿐이라는 산출물 규칙(O-1)에 기댄다. chunk 경로에 content hash가 있어 셸 코드나 그것이
 *   import하는 공유 모듈(`store.ts` 등)이 바뀌면 달라진다.
 * - `<html data-build-prefix>`는 `DocsShell.astro`가 쓰고 여기서만 읽는다.
 * - 등록은 `client.ts`의 `window` 플래그 가드 아래에서 한 번만 한다.
 */
import type { TransitionBeforePreparationEvent } from "astro:transitions/client";
import { isArchivePath, isUnderPrefix } from "../../lib/docs-archive";

export const BUILD_PREFIX_ATTR = "data-build-prefix";

/** 같은 빌드의 경로인가. latest(prefix "")면 archive 경로가 아니어야 하고, archive면 그 prefix 아래여야 한다. */
export function isSameBuild(current: Document, to: URL): boolean {
  const prefix = current.documentElement.getAttribute(BUILD_PREFIX_ATTR) ?? "";
  return prefix ? isUnderPrefix(prefix, to.pathname) : !isArchivePath(to.pathname);
}

/** 셸 서명. 문서 셸이 아닌 문서(`client="load"` island 없음)면 null. */
export function shellSignature(doc: Document): string | null {
  return (
    [...doc.querySelectorAll('astro-island[client="load"]')]
      .map((el) => `${el.getAttribute("component-url")}|${el.getAttribute("renderer-url")}`)
      .sort()
      .join(",") || null
  );
}

function onBeforePreparation(event: TransitionBeforePreparationEvent): void {
  if (!isSameBuild(document, event.to)) {
    event.preventDefault();
    return;
  }
  const original = event.loader;
  event.loader = async () => {
    await original();
    if (event.defaultPrevented) return; // 기본 loader가 이미 전체 로드를 골랐다(ClientRouter 없는 문서)
    const next = shellSignature(event.newDocument);
    if (next !== null && next !== shellSignature(document)) event.preventDefault();
  };
}

/** `client.ts`의 `initShell()`이 한 번 부른다. */
export function installNavigationGuard(): void {
  document.addEventListener("astro:before-preparation", onBeforePreparation as EventListener);
}
