import { enableHistorySync } from "nuqs/adapters/react";
import {
  createElement,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DocsShellProps } from "./docs-shell";
import { connectShell, type ShellPage } from "./shell-navigation";

/**
 * 셸 island가 그릴 props. 처음 문서에서는 `null`이라 Astro가 준 props·slot으로 그리고,
 * 클라이언트 이동 뒤에는 이동이 넘긴 페이지로 그린다(`shell-navigation.ts`). slot은 `PageSlot`으로 바뀐다.
 */
export function useShellPage(): DocsShellProps | null {
  const [page, setPage] = useState<ShellPage | null>(null);

  useEffect(() => {
    // 유지된 셸 안의 nuqs 상태(changelog의 LLMs.txt 메뉴)가 router의 `history.pushState`를 따라가게 한다.
    enableHistorySync();
    return connectShell(setPage);
  }, []);

  return useMemo(() => {
    if (!page) return null;
    // slot 이름은 `@astrojs/react`가 붙인 것이다. 기본 slot은 이름이 없고, `platform-status`는 camelCase가 된다.
    const slot = (name: string): ReactNode => {
      const nodes = page.slots[name];
      return nodes ? (
        <PageSlot name={name === "default" ? undefined : name} nodes={nodes} />
      ) : undefined;
    };
    return {
      ...page.props,
      children: slot("default"),
      platformStatus: slot("platformStatus"),
      meta: slot("meta"),
    };
  }, [page]);
}

/**
 * 이동한 페이지의 slot DOM을 붙이는 자리. 처음 문서에서 Astro가 그린 slot과 같은 `<astro-slot>`이다
 * (`src/styles/astro-wrappers.css`가 이 모양에 기댄다). DOM을 React 밖에서 옮겨 붙여, 안의 island는 문서에
 * 연결될 때 hydrate되고 script는 router가 body를 바꾼 뒤 실행한다.
 */
function PageSlot({ name, nodes }: { name?: string; nodes: Node[] }) {
  const ref = useRef<HTMLElement>(null);

  // 같은 자리의 slot이 다음 페이지로 바뀌면 이전 DOM을 빼고 새 DOM을 넣는다. 빠진 island는 Astro가
  // `astro:after-swap`에서 unmount한다.
  useLayoutEffect(() => {
    ref.current?.replaceChildren(...nodes);
  }, [nodes]);

  return createElement("astro-slot", { ref, name });
}
