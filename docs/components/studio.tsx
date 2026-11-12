import { createHashHistory } from "history";
import { useMemo } from "react";
import { Studio as SanityStudio, type StudioProps } from "sanity";
import config from "@/sanity.config";

/** `/admin#/…` 주소를 쓰는 history. Studio는 listener에 location만 넘겨받는다. */
function createStudioHashHistory(): NonNullable<StudioProps["unstable_history"]> {
  const history = createHashHistory();

  return {
    get action() {
      return history.action;
    },
    get location() {
      return history.location;
    },
    createHref: history.createHref,
    push: history.push,
    replace: history.replace,
    go: history.go,
    back: history.back,
    forward: history.forward,
    block: history.block,
    listen: (listener) =>
      history.listen(({ location }) => {
        // Studio는 history v4처럼 listener에 location만 넘겨받는데, 타입은 v5의 `Update`로 선언돼 있다.
        // @ts-expect-error -- next-sanity의 `NextStudio`와 같은 우회다.
        listener(location);
      }),
  };
}

/**
 * `/admin`의 Sanity Studio. 정적 호스팅이라 hash history로 단일 페이지에서 동작한다.
 * 브라우저에서만 렌더링한다(`client:only`). 바깥 컨테이너는 `src/pages/admin.astro`가 둔다.
 */
export default function Studio() {
  const history = useMemo(createStudioHashHistory, []);

  return <SanityStudio config={config} unstable_globalStyles unstable_history={history} />;
}
