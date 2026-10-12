import "@seed-design/lynx-css/base.css";
import "./standalone.css";

import { root, useEffect, useState, type ComponentType } from "@lynx-js/react";
import { useSafeArea, useSeedClassName } from "@seed-design/lynx-react";
import type { LynxExampleLayout } from "../../playground/lynx/layout";

export interface LynxStandaloneExample {
  Example: ComponentType;
  layout: LynxExampleLayout;
  /** E2E 표식에 쓰는 Probelynx ID(`<component>.<scenario>`). */
  probelynxId: string;
}

type LynxStandaloneExamples = Record<string, LynxStandaloneExample>;

/** 문서 Web 미리보기는 `globalProps.example`로 예제 ID를 넘긴다. 두 thread가 첫 렌더에서 같은 값을 읽는다. */
function readGlobalPropsExample(): string | undefined {
  const globalProps = lynx.__globalProps as { example?: unknown } | undefined;
  return typeof globalProps?.example === "string" ? globalProps.example : undefined;
}

/**
 * native QR과 Probelynx는 bundle URL query로 예제 ID(`example`)와 E2E 모드(`e2e=1`)를 넘긴다.
 * URL은 background thread에서만 읽을 수 있다.
 */
function readBundleUrlQuery(): URLSearchParams {
  // getNativeApp과 __pageUrl은 공개 타입에 없는 내부 API다. examples/lynx-spa의 App.tsx와 같은 경로로 읽는다.
  const runtime = lynx as typeof lynx & { getNativeApp?: () => { __pageUrl?: string } };
  const bundleUrl = runtime.getNativeApp?.().__pageUrl ?? "";

  // 호스트의 URL polyfill은 search를 지원하지 않을 수 있어 query만 분리한다.
  const urlWithoutHash = bundleUrl.split("#", 1)[0] ?? "";
  const queryStart = urlWithoutHash.indexOf("?");
  return new URLSearchParams(queryStart < 0 ? "" : urlWithoutHash.slice(queryStart + 1));
}

/** Probelynx가 접근성 트리에서 찾는 1px native view. 예제를 감싸지 않고 따로 둔다. */
function ProbelynxMarker({ label }: { label: string }) {
  return (
    <view
      flatten={false}
      accessibility-element={true}
      accessibility-label={label}
      style={{ position: "absolute", top: 0, left: 0, width: "1px", height: "1px" }}
    />
  );
}

/** Probelynx 계약대로 scenario 표식을 두고, 첫 렌더가 끝나면 캡처 시점을 알리는 phase 표식을 더한다. */
function ProbelynxScenario({
  example: { Example, probelynxId },
}: {
  example: LynxStandaloneExample;
}) {
  const [initialRendered, setInitialRendered] = useState(false);

  useEffect(() => {
    setInitialRendered(true);
  }, []);

  return (
    <>
      <Example />
      <ProbelynxMarker label={`probelynx-scenario:${probelynxId}`} />
      {initialRendered ? (
        <ProbelynxMarker label={`probelynx-phase:${probelynxId}:initial`} />
      ) : null}
    </>
  );
}

function StandaloneRoot({ examples }: { examples: LynxStandaloneExamples }) {
  // undefined: 아직 고르지 않음, null: 예제 ID를 받지 못해 목록에서 고른다.
  const [selected, setSelected] = useState<string | null | undefined>(readGlobalPropsExample);
  const [e2e, setE2e] = useState(false);
  const seedClassName = useSeedClassName({ colorMode: e2e ? "light-only" : "system" });
  const { safeAreaInsetTop, safeAreaInsetRight, safeAreaInsetBottom, safeAreaInsetLeft } =
    useSafeArea();

  useEffect(() => {
    if (selected !== undefined) return;
    const query = readBundleUrlQuery();
    setE2e(query.get("e2e") === "1");
    setSelected(query.get("example"));
  }, [selected]);

  const current = selected ? examples[selected] : undefined;
  const pending = selected === undefined;

  return (
    <page
      className={`${seedClassName} docs-lynx-standalone-root`}
      // E2E 캡처는 전체 화면이므로 예제가 상태 표시줄·홈 인디케이터와 겹치지 않게 한다.
      style={
        e2e
          ? {
              boxSizing: "border-box",
              paddingTop: safeAreaInsetTop,
              paddingRight: safeAreaInsetRight,
              paddingBottom: safeAreaInsetBottom,
              paddingLeft: safeAreaInsetLeft,
            }
          : undefined
      }
    >
      <view className={`docs-lynx-stage docs-lynx-stage--${current?.layout ?? "center"}`}>
        {current ? (
          e2e ? (
            <ProbelynxScenario example={current} />
          ) : (
            <current.Example />
          )
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
