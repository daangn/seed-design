import IconPlusFill from '@karrotmarket/lynx-monochrome-icon/IconPlusFill';
import {
  runOnMainThread,
  useEffect,
  useMainThreadRef,
  useState,
} from '@lynx-js/react';
import type { MainThread } from '@lynx-js/types';
import type { RefObject } from 'react';

import { vars } from '@seed-design/lynx-css/vars';

import '../styles/icon-color-poc.css';

const { $color } = vars;

/**
 * 간단한 검정 plus 아이콘을 data URI로 렌더 (raw <image> POC용).
 * 원본 픽셀이 유색이어야 tint-color 의 SRC_IN blend 가 적용됨.
 */
const PLUS_ICON_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000000"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>',
)}`;

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <view style={{ marginBottom: '8px' }}>
      <text
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: $color.fg.neutral,
        }}
      >
        {title}
      </text>
      <text
        style={{
          fontSize: '12px',
          color: $color.fg.neutralSubtle,
          marginTop: '4px',
        }}
      >
        {desc}
      </text>
    </view>
  );
}

/**
 * 브랜드 solid 배경 위에 아이콘을 놓아 흰색이면 ✅, 검정이면 ❌ 가 눈에 띄게 한다.
 */
function BrandBg({ children }: { children: React.ReactNode }) {
  return (
    <view
      style={{
        padding: '16px',
        backgroundColor: $color.bg.brandSolid,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '16px',
      }}
    >
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
      'main thread';

      const el = r.current;
      if (!el) {
        console.log(`[POC ${tag}] sync skipped — ref is null`);
        return;
      }

      const hasGetComputed =
        typeof el.getComputedStyleProperty === 'function';
      const hasGetComputedCss =
        typeof el.getComputedCssProperty === 'function';

      console.log(
        `[POC ${tag}] API probe — getComputedStyleProperty:${hasGetComputed} getComputedCssProperty:${hasGetComputedCss}`,
      );

      let color: string | undefined;
      if (hasGetComputed) {
        color = el.getComputedStyleProperty?.('color');
      } else if (hasGetComputedCss) {
        color = el.getComputedCssProperty?.('color');
      }

      console.log(`[POC ${tag}] resolved color = ${String(color)}`);

      if (color) {
        el.setAttribute('tint-color', color);
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
  const [variant, setVariant] = useState<
    'brandSolid' | 'criticalSolid' | 'neutralWeak'
  >('brandSolid');
  const { ref } = useIconColorPOC(variant, 'D');
  const iconClass = `poc-c-icon poc-c-icon--${variant}`;

  const next = () =>
    setVariant((v) =>
      v === 'brandSolid'
        ? 'criticalSolid'
        : v === 'criticalSolid'
          ? 'neutralWeak'
          : 'brandSolid',
    );

  return (
    <view>
      <view
        style={{
          padding: '16px',
          backgroundColor:
            variant === 'brandSolid'
              ? $color.bg.brandSolid
              : variant === 'criticalSolid'
                ? $color.bg.criticalSolid
                : $color.bg.neutralWeak,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '16px',
        }}
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
        <text style={{ fontSize: '12px', color: $color.fg.neutralInverted }}>
          current: {variant}
        </text>
      </view>

      <view
        bindtap={next}
        style={{
          marginTop: '8px',
          padding: '10px 14px',
          backgroundColor: $color.bg.neutralWeak,
          borderRadius: '6px',
          alignSelf: 'flex-start',
        }}
      >
        <text style={{ fontSize: '13px', color: $color.fg.neutral }}>
          Tap to cycle variant (POC D)
        </text>
      </view>
    </view>
  );
}

function POCCVariantToggle() {
  const [variant, setVariant] = useState<
    'brandSolid' | 'criticalSolid' | 'neutralWeak'
  >('brandSolid');
  const { ref } = useIconColorPOC(variant, 'C');
  const iconClass = `poc-c-icon poc-c-icon--${variant}`;

  const next = () =>
    setVariant((v) =>
      v === 'brandSolid'
        ? 'criticalSolid'
        : v === 'criticalSolid'
          ? 'neutralWeak'
          : 'brandSolid',
    );

  return (
    <view>
      <view
        style={{
          padding: '16px',
          backgroundColor:
            variant === 'brandSolid'
              ? $color.bg.brandSolid
              : variant === 'criticalSolid'
                ? $color.bg.criticalSolid
                : $color.bg.neutralWeak,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '16px',
        }}
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
        <text style={{ fontSize: '12px', color: $color.fg.neutralInverted }}>
          current: {variant}
        </text>
      </view>

      <view
        bindtap={next}
        style={{
          marginTop: '8px',
          padding: '10px 14px',
          backgroundColor: $color.bg.neutralWeak,
          borderRadius: '6px',
          alignSelf: 'flex-start',
        }}
      >
        <text style={{ fontSize: '13px', color: $color.fg.neutral }}>
          Tap to cycle variant (POC C)
        </text>
      </view>
    </view>
  );
}

/* =============================================================
 * Page
 * ============================================================= */

export function IconColorPOCPage() {
  return (
    <scroll-view
      scroll-y
      style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      <text
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: $color.fg.neutral,
        }}
      >
        Icon Color POC
      </text>

      <text
        style={{
          fontSize: '12px',
          color: $color.fg.neutralSubtle,
          marginBottom: '8px',
        }}
      >
        아이콘 tint-color 적용 방식 4가지 실측. 브랜드 컬러 배경 위에서 plus
        아이콘이 흰색(또는 의도한 색)으로 보이면 해당 방식이 동작하는 것.
      </text>

      {/* Baseline — hex color 고정 sanity check */}
      <view style={{ marginBottom: '16px' }}>
        <SectionHeader
          title="Baseline — hex color 고정 (컴포넌트 + raw image)"
          desc="아이콘이 렌더되는지 자체부터 좌표화. 왼쪽: IconPlusFill with hex color. 오른쪽: raw <image> + data URI + hex tint. 둘 중 어느 쪽이 보이는지."
        />
        <BrandBg>
          <IconPlusFill color="#FFFFFF" size={32} />
          <image
            src={PLUS_ICON_DATA_URI}
            {...{ 'tint-color': '#FFFFFF' }}
            style={{ width: '32px', height: '32px' }}
          />
          <text style={{ fontSize: '12px', color: $color.fg.neutralInverted }}>
            좌: 컴포넌트 / 우: data URI
          </text>
        </BrandBg>
      </view>

      {/* POC A */}
      <view style={{ marginBottom: '16px' }}>
        <SectionHeader
          title="POC A — attribute 에 var() 직접 주입"
          desc='<image tint-color="var(--seed-color-palette-static-white)" /> — 흰 아이콘이면 Lynx attribute parser 가 CSS var 해석.'
        />
        <BrandBg>
          {/*
            IconPlusFill 은 내부에서 <image tint-color={color}> 로 렌더하므로
            color prop 에 CSS var 스트링을 그대로 넘기면 POC A 와 동치.
          */}
          <IconPlusFill
            color="var(--seed-color-palette-static-white)"
            size={32}
          />
          <text style={{ fontSize: '12px', color: $color.fg.neutralInverted }}>
            ✅ 흰색 → var() 해석됨 / ❌ 검정 → 미해석
          </text>
        </BrandBg>
      </view>

      {/* POC B */}
      <view style={{ marginBottom: '16px' }}>
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
          <text style={{ fontSize: '12px', color: $color.fg.neutralInverted }}>
            ✅ 흰색 → CSS tint-color 지원 / ❌ 검정 → 미지원
          </text>
        </BrandBg>
      </view>

      {/* POC C */}
      <view style={{ marginBottom: '16px' }}>
        <SectionHeader
          title="POC C — main-thread sync 훅 + raw <image> + variant toggle"
          desc="버튼 탭으로 variant 토글. tint-color 가 따라 바뀌는지 + 초기 마운트 flash 체감."
        />
        <POCCVariantToggle />
      </view>

      {/* POC D */}
      <view style={{ marginBottom: '16px' }}>
        <SectionHeader
          title="POC D — IconPlusFill(1.9.0) + external ref + slot className"
          desc="실제 ActionButton.PrefixIcon 패턴. color prop 생략, className 으로 recipe color 주입, ref 로 main-thread tint-color sync."
        />
        <POCDIconComponent />
      </view>
    </scroll-view>
  );
}
