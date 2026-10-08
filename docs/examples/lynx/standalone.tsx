import "@seed-design/lynx-css/base.css";
import "./standalone.css";

import { root, useEffect, useState, type ComponentType } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import type { LynxExampleLayout } from "../../playground/lynx/layout";

export interface LynxStandaloneExample {
  Example: ComponentType;
  layout: LynxExampleLayout;
}

type LynxStandaloneExamples = Record<string, LynxStandaloneExample>;

/** 문서 Web 미리보기는 `globalProps.example`로 예제 ID를 넘긴다. 두 thread가 첫 렌더에서 같은 값을 읽는다. */
function readGlobalPropsExample(): string | undefined {
  const globalProps = lynx.__globalProps as { example?: unknown } | undefined;
  return typeof globalProps?.example === "string" ? globalProps.example : undefined;
}

/** native QR은 bundle URL의 `example` query로 예제 ID를 넘긴다. URL은 background thread에서만 읽을 수 있다. */
function readBundleUrlExample(): string | null {
  // getNativeApp과 __pageUrl은 공개 타입에 없는 내부 API다. examples/lynx-spa의 App.tsx와 같은 경로로 읽는다.
  const runtime = lynx as typeof lynx & { getNativeApp?: () => { __pageUrl?: string } };
  const bundleUrl = runtime.getNativeApp?.().__pageUrl;
  if (!bundleUrl) return null;

  // 호스트의 URL polyfill은 search를 지원하지 않을 수 있어 query만 분리한다.
  const urlWithoutHash = bundleUrl.split("#", 1)[0] ?? "";
  const queryStart = urlWithoutHash.indexOf("?");
  if (queryStart < 0) return null;
  return new URLSearchParams(urlWithoutHash.slice(queryStart + 1)).get("example");
}

function StandaloneRoot({ examples }: { examples: LynxStandaloneExamples }) {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  // undefined: 아직 고르지 않음, null: 예제 ID를 받지 못해 목록에서 고른다.
  const [selected, setSelected] = useState<string | null | undefined>(readGlobalPropsExample);

  useEffect(() => {
    if (selected === undefined) setSelected(readBundleUrlExample());
  }, [selected]);

  const current = selected ? examples[selected] : undefined;
  const pending = selected === undefined;

  return (
    <page className={`${seedClassName} docs-lynx-standalone-root`}>
      <view className={`docs-lynx-stage docs-lynx-stage--${current?.layout ?? "center"}`}>
        {current ? (
          <current.Example />
        ) : pending ? null : (
          <view className="docs-lynx-picker">
            {Object.keys(examples).map((id) => (
              <view
                key={id}
                className="docs-lynx-picker__item"
                bindtap={() => {
                  "background only";
                  setSelected(id);
                }}
              >
                <text>{id}</text>
              </view>
            ))}
          </view>
        )}
      </view>
    </page>
  );
}

export function renderLynxExamples(examples: LynxStandaloneExamples): void {
  root.render(<StandaloneRoot examples={examples} />);
}
