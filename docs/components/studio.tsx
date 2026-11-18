import { useMemo } from "react";
import { Studio as SanityStudio, type StudioProps } from "sanity";
import config from "@/sanity.config";

type StudioHistory = NonNullable<StudioProps["unstable_history"]>;
type Listener = (location: StudioLocation) => void;

interface StudioLocation {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}

type To = string | Partial<Pick<StudioLocation, "pathname" | "search" | "hash">>;

function createPath(to: To): string {
  if (typeof to === "string") return to;
  const { pathname = "/", search = "", hash = "" } = to;
  return `${pathname}${search && !search.startsWith("?") ? `?${search}` : search}${hash && !hash.startsWith("#") ? `#${hash}` : hash}`;
}

/** `#/structure?x#y` → `/structure`, `?x`, `#y`. 기존 `history` 패키지의 `createHashHistory`와 같은 해석이다. */
function readLocation(): StudioLocation {
  const url = new URL(window.location.hash.slice(1) || "/", "http://hash.local");
  const state = (window.history.state as { usr?: unknown; key?: string } | null) ?? {};
  return {
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    state: state.usr ?? null,
    key: state.key ?? "default",
  };
}

/**
 * `/admin#/…` 주소를 쓰는 Studio history. 정적 호스팅이라 경로 대신 hash로 단일 페이지에서 동작한다(기존 Next
 * `NextStudio history="hash"`와 같은 주소). Studio가 쓰는 면(`location`·`listen`·`push`·`replace`)과 나머지
 * `History` 메서드만 구현해 `history` 패키지에 직접 의존하지 않는다. listener에는 Studio가 기대하는 대로 location만
 * 넘긴다(`next-sanity`의 hash history와 같은 우회).
 */
function createStudioHashHistory(): StudioHistory {
  const listeners = new Set<Listener>();
  let location = readLocation();
  let action: "POP" | "PUSH" | "REPLACE" = "POP";
  const notify = () => {
    for (const listener of [...listeners]) listener(location);
  };
  const go = (to: To, replace: boolean, state: unknown) => {
    const key = Math.random().toString(36).slice(2, 10);
    const url = `${window.location.pathname}${window.location.search}#${createPath(to)}`;
    window.history[replace ? "replaceState" : "pushState"]({ usr: state, key }, "", url);
    action = replace ? "REPLACE" : "PUSH";
    location = readLocation();
    notify();
  };
  window.addEventListener("popstate", () => {
    action = "POP";
    location = readLocation();
    notify();
  });

  const history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref: (to: To) => `#${createPath(to)}`,
    push: (to: To, state?: unknown) => go(to, false, state),
    replace: (to: To, state?: unknown) => go(to, true, state),
    go: (delta: number) => window.history.go(delta),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    // Studio는 `block`을 부르지 않는다(sanity 4.22 번들 기준). 타입을 채우는 빈 구현이다.
    block: () => () => {},
    listen: (listener: Listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
  return history as unknown as StudioHistory;
}

/**
 * `/admin`의 Sanity Studio. 브라우저에서만 렌더링한다(`src/pages/admin.astro`, `client:only`). 바깥 컨테이너도 그
 * 페이지가 둔다.
 */
export default function Studio() {
  const history = useMemo(createStudioHashHistory, []);

  return <SanityStudio config={config} unstable_globalStyles unstable_history={history} />;
}
