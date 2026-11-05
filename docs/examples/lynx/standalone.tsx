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

declare const SystemInfo: { platform?: string } | undefined;

function isNativeRuntime(): boolean {
  const globalSystemInfo = (
    globalThis as typeof globalThis & { SystemInfo?: { platform?: string } }
  ).SystemInfo;
  const platform = (
    globalSystemInfo ?? (typeof SystemInfo === "undefined" ? undefined : SystemInfo)
  )?.platform;
  return platform === "Android" || platform === "iOS";
}

/** 문서 Web 미리보기와 Lynx Explorer는 `globalProps.example`로 예제 ID를 넘깁니다. */
function readGlobalPropsExample(): string | undefined {
  const globalProps = lynx.__globalProps as { example?: unknown } | undefined;
  if (typeof globalProps?.example !== "string") return undefined;

  // Explorer 버전에 따라 중첩된 `lynx://open?url=`을 풀고도 query 값이 최대 두 번 인코딩되어 있습니다.
  let example = globalProps.example;
  for (let depth = 0; depth < 2; depth += 1) {
    try {
      const decoded = decodeURIComponent(example);
      if (decoded === example) break;
      example = decoded;
    } catch {
      break;
    }
  }
  return example;
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
  const scrollable = isNativeRuntime() && current?.layout !== "fill";
  const stage = (
    <view
      className={`docs-lynx-stage docs-lynx-stage--${current?.layout ?? "center"}${scrollable ? " docs-lynx-stage--scroll" : ""}`}
    >
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
  );

  return (
    <page
      className={`${seedClassName} docs-lynx-standalone-root`}
      style={{
        boxSizing: "border-box",
        paddingTop: safeAreaInsetTop,
        paddingRight: safeAreaInsetRight,
        paddingBottom: safeAreaInsetBottom,
        paddingLeft: safeAreaInsetLeft,
      }}
    >
      {scrollable ? (
        <scroll-view scroll-orientation="vertical" className="docs-lynx-standalone-scroll">
          {stage}
        </scroll-view>
      ) : (
        stage
      )}
    </page>
  );
}

export function renderLynxExamples(examples: LynxStandaloneExamples): void {
  root.render(<StandaloneRoot examples={examples} />);
}
