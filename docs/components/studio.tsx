import { createHashHistory } from "history";
import { type CSSProperties, useMemo } from "react";
import { Studio as SanityStudio, type StudioProps } from "sanity";
import config from "@/sanity.config";

const layoutStyle: CSSProperties = {
  height: "100vh",
  maxHeight: "100dvh",
  overscrollBehavior: "none",
  WebkitFontSmoothing: "antialiased",
  overflow: "auto",
};

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
    listen: (listener) => history.listen(({ location }) => listener(location)),
  };
}

/**
 * `/admin`의 Sanity Studio. 정적 호스팅이라 hash history로 단일 페이지에서 동작한다.
 * 브라우저에서만 렌더링한다(`client:only`).
 */
export default function Studio() {
  const history = useMemo(createStudioHashHistory, []);

  return (
    <div id="sanity" data-ui="NextStudioLayout" style={layoutStyle}>
      <SanityStudio config={config} unstable_globalStyles unstable_history={history} />
    </div>
  );
}
