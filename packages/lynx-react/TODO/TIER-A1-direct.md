# Tier A1: 직접 구현 (primitive 조합)

`useControllableState`, `usePressTap` 등 `@seed-design/lynx-react/src/utils/`의 primitive만으로 완결되는 컴포넌트들. lynx-ui 의존 불필요.

**구현 순서** (쉬운 것부터):

1. [TagGroup](#1-taggroup)
2. [Badge](#2-badge)
3. [Skeleton](#3-skeleton)
4. [MannerTemp](#4-mannertemp)
5. [Switch](#5-switch)
6. [SegmentedControl](#6-segmentedcontrol)
7. [ChipTabs](#7-chiptabs)
8. [Tabs](#8-tabs)

---

## 1. TagGroup

**React 소스**: `packages/react/src/components/TagGroup/TagGroup.tsx`
**Lynx CSS recipes**: `tagGroup` (root, separator), `tagGroupItem` (root, label)

**Exports:** `TagGroupRoot`, `TagGroupItem`, `TagGroupItemLabel`

**Variant Props:**
- Root: `size` ("t2" | "t3" | "t4", default: "t2"), `truncate` (boolean, default: false)
- Item: `weight` ("regular" | "bold", default: "regular"), `tone` ("neutralSubtle" | "neutral" | "brand", default: "neutralSubtle")

**Lynx 구현 포인트:**
- **인터랙티브 상태 없음** — 순수 표시용이지만 Context로 variant 전파
- Root가 children 사이에 separator 삽입 (기본: " · ")
- Context API로 Root의 size/truncate를 Item에 전파
- `separator` prop으로 커스텀 구분자

- [ ] `src/components/TagGroup/TagGroup.tsx`
- [ ] `docs/content/lynx/components/tag-group.mdx`
- [ ] `examples/lynx-spa/src/pages/TagGroupPage.tsx`

---

## 2. Badge

**React 소스**: `packages/react/src/components/Badge/Badge.tsx`
**Lynx CSS recipe**: `badge` (2슬롯: root, label)

**Variant Props:**
- `size`: "medium" | "large", default: "medium"
- `variant`: "weak" | "solid" | "outline", default: "solid"
- `tone`: "neutral" | "brand" | "informative" | "positive" | "warning" | "critical", default: "neutral"

**Lynx 구현 포인트:**
- 2슬롯 구조: `<view className={root}><text className={label}>{children}</text></view>`
- splitVariantProps로 variant/HTML props 분리

- [ ] `src/components/Badge/Badge.tsx`
- [ ] `docs/content/lynx/components/badge.mdx`
- [ ] `examples/lynx-spa/src/pages/BadgePage.tsx`

---

## 3. Skeleton

**React 소스**: `packages/react/src/components/Skeleton/Skeleton.tsx`
**Lynx CSS recipe**: `skeleton`

**Variant Props:**
- `radius`: "0" | "8" | "16" | "full", default: "8"
- `tone`: "neutral" | "magic", default: "neutral"

**Lynx 구현 포인트:**
- `height`, `width` 인라인 스타일 지원 → 인라인 `style` prop (CSS var 주입 방식은 도입 시점에 재검토)
- Skeleton 애니메이션이 CSS로 정의되어 있으면 Lynx에서도 동작할 수 있음 (확인 필요)

- [ ] `src/components/Skeleton/Skeleton.tsx`
- [ ] `docs/content/lynx/components/skeleton.mdx`
- [ ] `examples/lynx-spa/src/pages/SkeletonPage.tsx`

---

## 4. MannerTemp

**React 소스**: `packages/react/src/components/MannerTemp/MannerTemp.tsx`
**Lynx CSS recipe**: `mannerTemp`

**Exports:** `MannerTemp`, `MannerTempEmote`

**Variant Props:**
- `level`: "l1" ~ "l10", default: "l1"

**Lynx 구현 포인트:**
- MannerTemp: Context로 level을 MannerTempEmote에 전달
- MannerTempEmote: level별 webp 이미지 렌더링 (10개 variant, 2x/3x/4x srcSet)
- Lynx에서 `<image>` 요소 사용 (HTML `<img>` 대신)
- srcSet 지원 여부 Lynx에서 확인 필요

- [ ] `src/components/MannerTemp/MannerTemp.tsx`
- [ ] `docs/content/lynx/components/manner-temp.mdx`
- [ ] `examples/lynx-spa/src/pages/MannerTempPage.tsx`

---

## 5. Switch

**React 소스**: `packages/react/src/components/Switch/Switch.tsx`
**Lynx CSS recipes**: `switch` (root, label), `switchmark` (root, thumb)

**Exports:** `SwitchRoot`, `SwitchControl`, `SwitchThumb`, `SwitchLabel`

**Variant Props:**
- switch: `size` ("16" | "24" | "32", default: "32")
- switchmark: `tone` ("neutral" | "brand", default: "brand"), `size`

**Lynx 구현 포인트:**
- **별도 `useSwitch` 훅 없이 primitive 인라인 조합**. 웹 headless의 `isHovered`/`isFocused`/`isFocusVisible`/HiddenInput은 Lynx에서 의미 없으므로 제거. 남는 건 `checked`(= `useControllableState`) + `pressed`(= `usePressTap`) + `disabled`뿐.
  ```tsx
  const [checked, setChecked] = useControllableState({ value, defaultValue, onChange });
  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: () => setChecked(!checked),
  });
  ```
- **className variant로 상태 표현** (data-* 대신):
  - checked → recipe에 `checked: true`
  - disabled → recipe에 `disabled: true`
  - active(pressed) → recipe에 `active: true` (recipe가 지원하는 경우)
- **Compound component**: Context로 `{ checked, disabled, active }` 공유 → `SwitchThumb`이 위치 변경
- `<view>` 기반, HiddenInput 불필요

**미지원:**
- HiddenInput (Lynx에 form 제출 없음)
- focus/focus-visible 상태 (Lynx에 키보드 없음)

> `@lynx-js/lynx-ui-switch`도 거의 동일한 패턴이지만, 우리는 이미 primitive 2개를 보유하고 있고 Switch 전체 로직이 10줄 이내이므로 외부 의존 없이 직접 구현한다.

- [ ] `src/components/Switch/Switch.tsx`
- [ ] `docs/content/lynx/components/switch.mdx`
- [ ] `examples/lynx-spa/src/pages/SwitchPage.tsx`

---

## 6. SegmentedControl

**React 소스**: `packages/react/src/components/SegmentedControl/SegmentedControl.tsx`
**React headless**: `packages/react-headless/segmented-control/src/`
**Lynx CSS recipe**: `segmentedControl` (3슬롯: root, indicator, item)

**Exports:** `SegmentedControlRoot`, `SegmentedControlIndicator`, `SegmentedControlItem`

**Variant Props:** 없음 (기본 스타일만)

**웹 headless 동작:**
- `useSegmentedControl()` → value, getItemProps()
- 라디오 버튼 패턴 (단일 선택)
- CSS variable `--segment-index`, `--segment-count`로 indicator 위치

**Lynx 구현 포인트:**
- **useSegmentedControl 훅 구현**
  - `useControllableState`로 선택값 관리
  - `getItemProps(value)` → 해당 아이템의 className + 이벤트 핸들러
- **Indicator 애니메이션**: CSS transition으로 `transform: translateX(...)` 이동
- **HiddenInput 불필요** (Lynx에 form 없음)

- [ ] `src/components/SegmentedControl/useSegmentedControl.ts`
- [ ] `src/components/SegmentedControl/SegmentedControl.tsx`
- [ ] `docs/content/lynx/components/segmented-control.mdx`
- [ ] `examples/lynx-spa/src/pages/SegmentedControlPage.tsx`

---

## 7. ChipTabs

**React 소스**: `packages/react/src/components/ChipTabs/ChipTabs.tsx`
**Lynx CSS recipe**: `chipTabs` (6슬롯: root, list, carousel, carouselCamera, content, trigger)

**Exports:** `ChipTabsRoot`, `ChipTabsList`, `ChipTabsTrigger`, `ChipTabsContent`, `ChipTabsCarousel`, `ChipTabsCarouselCamera`

**Variant Props:**
- `size`: "medium" | "large", default: "medium"
- `variant`: "neutralSolid" | "neutralOutline" | "brandSolid" (deprecated), default: "neutralSolid"
- `contentLayout`: "fill" | "hug", default: "hug"
- `stickyList`: boolean, default: false

**Lynx 구현 포인트:**
- **useTabs 훅 직접 구현** (탭 선택 상태 관리)
  - `useControllableState`로 선택값 관리
  - 선택된 trigger → `selected_true` className variant
- **Carousel**: 네이티브 `<scroll-view scroll-x>`
- **Compound component**: TabsContext로 value/onChange 공유
- 키보드 네비게이션 불필요 (Lynx 모바일)

- [ ] `src/components/ChipTabs/useChipTabs.ts`
- [ ] `src/components/ChipTabs/ChipTabs.tsx`
- [ ] `docs/content/lynx/components/chip-tabs.mdx`
- [ ] `examples/lynx-spa/src/pages/ChipTabsPage.tsx`

---

## 8. Tabs

**React 소스**: `packages/react/src/components/Tabs/Tabs.tsx`
**React headless**: `packages/react-headless/tabs/src/` (13개 파일, 가장 큰 headless)
**Lynx CSS recipe**: `tabs` (7슬롯: root, list, carousel, carouselCamera, content, indicator, trigger)

**Exports:** `TabsRoot`, `TabsList`, `TabsTrigger`, `TabsIndicator`, `TabsContent`, `TabsCarousel`, `TabsCarouselCamera`

**Variant Props:**
- `triggerLayout`: "fill" | "hug", default: "fill"
- `contentLayout`: "fill" | "hug", default: "hug"
- `size`: "small" | "medium", default: "small"
- `stickyList`: boolean, default: false

**Lynx 구현 포인트:**
- ChipTabs와 동일한 탭 선택 로직 → **`useTabs` 훅 공유**
- **TabsIndicator**: 선택된 탭 아래 animated bar
  - 웹: CSS transition으로 위치/너비 변경
  - Lynx: CSS transition 지원 확인. 안되면 main-thread 애니메이션 (ProgressCircle 패턴 참고)
  - CSS variable `--segment-index`, `--segment-count`로 위치 계산
- Carousel: 네이티브 `<scroll-view scroll-x>`

- [ ] `src/components/Tabs/Tabs.tsx` (ChipTabs의 `useTabs.ts` 재사용)
- [ ] `docs/content/lynx/components/tabs.mdx`
- [ ] `examples/lynx-spa/src/pages/TabsPage.tsx`
