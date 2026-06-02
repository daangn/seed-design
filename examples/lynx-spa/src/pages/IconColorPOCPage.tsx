import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";
import { runOnMainThread, useEffect, useMainThreadRef, useState } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import clsx from "clsx";
import type { RefObject } from "react";

import "../styles/icon-color-poc.css";

/**
 * 간단한 검정 plus 아이콘을 data URI로 렌더 (raw <image> POC용).
 * 원본 픽셀이 유색이어야 tint-color 의 SRC_IN blend 가 적용됨.
 */
const PLUS_ICON_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>',
)}`;

const VARIANT_BG_CLASS = {
  brandSolid: "bg-bg-brand-solid",
  criticalSolid: "bg-bg-critical-solid",
  neutralWeak: "bg-bg-neutral-weak",
} as const;

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <view className="mb-x2">
      <text className="t4-bold text-fg-neutral">{title}</text>
      <text className="t2-regular text-fg-neutral-subtle mt-x1">{desc}</text>
    </view>
  );
}

/**
 * 브랜드 solid 배경 위에 아이콘을 놓아 흰색이면 ✅, 검정이면 ❌ 가 눈에 띄게 한다.
 */
function BrandBg({ children }: { children: React.ReactNode }) {
  return (
    <view className="p-x4 bg-bg-brand-solid rounded-r2 flex flex-row items-center gap-x4">
      {children}
    </view>
  );
}

/* =============================================================
 * POC C — useIconColor 훅 (인라인 구현, 플랜의 제안 훅과 동일)
 * ============================================================= */

type ElementLike = MainThread.Element & {
  // 런타임엔 존재하지만 @lynx-js/types@3.7.0 에 누락된 API 시그니처를 임시 선언
  getComputedStyleProperty?: (name: string) => string;
  getComputedCssProperty?: (name: string) => string;
};

function useIconColorPOC(depKey: string, label: string) {
  const ref = useMainThreadRef<ElementLike>(null);

  useEffect(() => {
    function sync(r: RefObject<ElementLike>, tag: string) {
      "main thread";

      const el = r.current;
      if (!el) {
        console.log(`[POC ${tag}] sync skipped — ref is null`);
        return;
      }

      const hasGetComputed = typeof el.getComputedStyleProperty === "function";
      const hasGetComputedCss = typeof el.getComputedCssProperty === "function";

      console.log(
        `[POC ${tag}] API probe — getComputedStyleProperty:${hasGetComputed} getComputedCssProperty:${hasGetComputedCss}`,
      );

      let color: string | undefined;
      if (hasGetComputed) {
        color = el.getComputedStyleProperty?.("color");
      } else if (hasGetComputedCss) {
        color = el.getComputedCssProperty?.("color");
      }

      console.log(`[POC ${tag}] resolved color = ${String(color)}`);

      if (color) {
        el.setAttribute("tint-color", color);
        console.log(`[POC ${tag}] tint-color attribute set`);
      } else {
        console.log(`[POC ${tag}] no color resolved — tint-color not set`);
      }
    }

    runOnMainThread(sync)(ref, label);
  }, [depKey, label]);

  return { ref };
}

/* =============================================================
 * POC D — 새 IconPlusFill(1.9.0) + 외부 ref + slot className
 * 실제 ActionButton.PrefixIcon 이 쓸 패턴과 동일.
 * ============================================================= */

function POCDIconComponent() {
  const [variant, setVariant] = useState<"brandSolid" | "criticalSolid" | "neutralWeak">(
    "brandSolid",
  );
  const { ref } = useIconColorPOC(variant, "D");
  const iconClass = `poc-c-icon poc-c-icon--${variant}`;

  const next = () =>
    setVariant((v) =>
      v === "brandSolid" ? "criticalSolid" : v === "criticalSolid" ? "neutralWeak" : "brandSolid",
    );

  return (
    <view>
      <view
        className={clsx(
          "p-x4 rounded-r2 flex flex-row items-center gap-x4",
          VARIANT_BG_CLASS[variant],
        )}
      >
        {/*
         * IconPlusFill 1.9.0: forwardRef + className + color optional.
         * color 를 주지 않고 ref/className 만 주입 → CSS color 를 main-thread 에서 tint-color 로 복사.
         */}
        <IconPlusFill
          ref={ref as unknown as React.Ref<MainThread.Element>}
          className={iconClass}
          size={32}
        />
        <text className="t2-regular text-fg-neutral-inverted">current: {variant}</text>
      </view>

      <view
        bindtap={next}
        className="mt-x2 py-x2_5 px-x3_5 bg-bg-neutral-weak rounded-r1_5 self-start"
      >
        <text className="t3-regular text-fg-neutral">Tap to cycle variant (POC D)</text>
      </view>
    </view>
  );
}

function POCCVariantToggle() {
  const [variant, setVariant] = useState<"brandSolid" | "criticalSolid" | "neutralWeak">(
    "brandSolid",
  );
  const { ref } = useIconColorPOC(variant, "C");
  const iconClass = `poc-c-icon poc-c-icon--${variant}`;

  const next = () =>
    setVariant((v) =>
      v === "brandSolid" ? "criticalSolid" : v === "criticalSolid" ? "neutralWeak" : "brandSolid",
    );

  return (
    <view>
      <view
        className={clsx(
          "p-x4 rounded-r2 flex flex-row items-center gap-x4",
          VARIANT_BG_CLASS[variant],
        )}
      >
        {/*
         * POC C: IconPlusFill(1.9.0) + ref + className.
         * Baseline 에서 data URI 는 Lynx image 가 로드 못하는 것이 확인돼서 교체.
         * 훅 내부 console.log 로 API 존재 여부와 resolved color 값 추적.
         */}
        <IconPlusFill
          ref={ref as unknown as React.Ref<MainThread.Element>}
          className={iconClass}
          size={32}
        />
        <text className="t2-regular text-fg-neutral-inverted">current: {variant}</text>
      </view>

      <view
        bindtap={next}
        className="mt-x2 py-x2_5 px-x3_5 bg-bg-neutral-weak rounded-r1_5 self-start"
      >
        <text className="t3-regular text-fg-neutral">Tap to cycle variant (POC C)</text>
      </view>
    </view>
  );
}

/* =============================================================
 * Page
 * ============================================================= */

export function IconColorPOCPage() {
  return (
    <scroll-view scroll-y className="flex flex-col gap-x4 flex-1">
      <text className="t7-bold text-fg-neutral">Icon Color POC</text>

      <text className="t2-regular text-fg-neutral-subtle mb-x2">
        아이콘 tint-color 적용 방식 4가지 실측. 브랜드 컬러 배경 위에서 plus 아이콘이 흰색(또는
        의도한 색)으로 보이면 해당 방식이 동작하는 것.
      </text>

      {/* Baseline — semantic color 고정 sanity check */}
      <view className="mb-x4">
        <SectionHeader
          title="Baseline — semantic color 고정 (컴포넌트 + raw image)"
          desc="아이콘이 렌더되는지 자체부터 좌표화. 왼쪽: IconPlusFill with fg.neutral-inverted. 오른쪽: raw <image> + data URI + semantic tint. 둘 중 어느 쪽이 보이는지."
        />
        <BrandBg>
          <IconPlusFill color="var(--seed-color-fg-neutral-inverted)" size={32} />
          <image
            src={PLUS_ICON_DATA_URI}
            {...{ "tint-color": "var(--seed-color-fg-neutral-inverted)" }}
            className="w-x8 h-x8"
          />
          <text className="t2-regular text-fg-neutral-inverted">좌: 컴포넌트 / 우: data URI</text>
        </BrandBg>
      </view>

      {/* POC A */}
      <view className="mb-x4">
        <SectionHeader
          title="POC A — attribute 에 var() 직접 주입"
          desc='<image tint-color="var(--seed-color-fg-neutral-inverted)" /> — 흰 아이콘이면 Lynx attribute parser 가 CSS var 해석.'
        />
        <BrandBg>
          {/*
            IconPlusFill 은 내부에서 <image tint-color={color}> 로 렌더하므로
            color prop 에 CSS var 스트링을 그대로 넘기면 POC A 와 동치.
          */}
          <IconPlusFill color="var(--seed-color-fg-neutral-inverted)" size={32} />
          <text className="t2-regular text-fg-neutral-inverted">
            ✅ 흰색 → var() 해석됨 / ❌ 검정 → 미해석
          </text>
        </BrandBg>
      </view>

      {/* POC B */}
      <view className="mb-x4">
        <SectionHeader
          title="POC B — CSS property 로서의 tint-color"
          desc=".poc-b-icon { tint-color: var(...) } — 흰 아이콘이면 Lynx 가 tint-color 를 CSS property 로도 지원."
        />
        <BrandBg>
          {/*
           * IconPlusFill 1.9.0 은 color prop 이 없으면 tint-color attribute 도 세팅 안 함.
           * className 을 전달하므로 CSS 쪽에서 tint-color 를 지정하면 적용 여부 확인 가능.
           */}
          <IconPlusFill className="poc-b-icon" size={32} />
          <text className="t2-regular text-fg-neutral-inverted">
            ✅ 흰색 → CSS tint-color 지원 / ❌ 검정 → 미지원
          </text>
        </BrandBg>
      </view>

      {/* POC C */}
      <view className="mb-x4">
        <SectionHeader
          title="POC C — main-thread sync 훅 + raw <image> + variant toggle"
          desc="버튼 탭으로 variant 토글. tint-color 가 따라 바뀌는지 + 초기 마운트 flash 체감."
        />
        <POCCVariantToggle />
      </view>

      {/* POC D */}
      <view className="mb-x4">
        <SectionHeader
          title="POC D — IconPlusFill(1.9.0) + external ref + slot className"
          desc="실제 ActionButton.PrefixIcon 패턴. color prop 생략, className 으로 recipe color 주입, ref 로 main-thread tint-color sync."
        />
        <POCDIconComponent />
      </view>
    </scroll-view>
  );
}
