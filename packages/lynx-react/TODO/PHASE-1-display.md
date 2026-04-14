# Phase 1: 단순 표시 컴포넌트

variant/size props만 받아 className을 생성하는 가장 단순한 컴포넌트들.
ActionButton 패턴과 동일: `recipe.splitVariantProps()` → `clsx(classes.slot)` → `<view>`/`<text>`.

---

## 1. Text

**React 소스**: `packages/react/src/components/Text/Text.tsx`
**Lynx CSS recipe**: `text` (단일 className, 슬롯 없음)

**Variant Props:**
- `textStyle`: 54개 프리셋 (t1Regular ~ t10Bold, t1Static ~ t10Static 등), default: "t5Regular"
- `maxLines`: "none" | "single" | "multi", default: "none"
- `textDecorationLine`: "none" | "line-through" | "underline", default: "none"

**Lynx 구현 포인트:**
- 웹에서 `as` prop으로 HTML 요소 변경 → Lynx에서는 항상 `<text>` 사용
- 웹에서 CSS variable (`--seed-text-color`, `--seed-font-size` 등) → Lynx에서 `dynamicStyle()` 필요
- `maxLines` 매핑: number → "none"(undefined), "single"(1), "multi"(>1)
- `inherit` 패턴 미지원 — 직접 값 지정

**미지원 기능:**
- `color`, `fontSize`, `lineHeight`, `fontWeight` 오버라이드 (CSS variable 동적 주입 제한)
- `userSelect`, `whiteSpace` (Lynx 미지원 CSS 속성)

- [ ] `src/components/Text/Text.tsx`
- [ ] `docs/content/lynx/components/text.mdx`
- [ ] `examples/lynx-spa/src/pages/TextPage.tsx`

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

## 3. Count

**React 소스**: `packages/react/src/components/Count/Count.tsx`
**Lynx CSS recipe**: 없음 (정적 class `"seed-count"`)

**구현:**
- 최소 래퍼. `<text className="seed-count">{children}</text>`
- variant props 없음

- [ ] `src/components/Count/Count.tsx`
- [ ] `docs/content/lynx/components/count.mdx`
- [ ] `examples/lynx-spa/src/pages/CountPage.tsx`

---

## 4. Divider

**React 소스**: `packages/react/src/components/Divider/Divider.tsx`
**Lynx CSS recipe**: 없음 (Box 기반 스타일링)

**Lynx 구현 포인트:**
- 웹에서 Box 컴포넌트 사용 → Lynx에서는 `<view>` + 인라인 스타일
- `orientation`: "horizontal" | "vertical", default: "horizontal"
- `inset`: boolean → 16px 마진 추가
- 한쪽 border만 설정 (horizontal → borderBottom, vertical → borderRight)
- `color` 기본값: "stroke.neutralMuted" → Lynx CSS variable로 매핑

**미지원 기능:**
- `as` prop (항상 `<view>`)
- `aria-orientation` (Lynx에서 의미 없음)

- [ ] `src/components/Divider/Divider.tsx`
- [ ] `docs/content/lynx/components/divider.mdx`
- [ ] `examples/lynx-spa/src/pages/DividerPage.tsx`

---

## 5. NotificationBadge

**React 소스**: `packages/react/src/components/NotificationBadge/NotificationBadge.tsx`
**Lynx CSS recipe**: `notificationBadge`, `notificationBadgePositioner`

**Exports:** `NotificationBadge`, `NotificationBadgePositioner`

**Variant Props:**
- NotificationBadge: `size` ("small" | "large", default: "large")
- Positioner: `attach` ("icon" | "text", default: "icon"), `size` ("small" | "large", default: "large")

**Lynx 구현 포인트:**
- Compound component: Positioner가 size 컨텍스트를 Badge에 전달
- Lynx에서 Context API 사용 가능 (React 기본 기능)

- [ ] `src/components/NotificationBadge/NotificationBadge.tsx`
- [ ] `docs/content/lynx/components/notification-badge.mdx`
- [ ] `examples/lynx-spa/src/pages/NotificationBadgePage.tsx`

---

## 6. Skeleton

**React 소스**: `packages/react/src/components/Skeleton/Skeleton.tsx`
**Lynx CSS recipe**: `skeleton`

**Variant Props:**
- `radius`: "0" | "8" | "16" | "full", default: "8"
- `tone`: "neutral" | "magic", default: "neutral"

**Lynx 구현 포인트:**
- `height`, `width` 인라인 스타일 지원 → `dynamicStyle()` 사용
- Skeleton 애니메이션이 CSS로 정의되어 있으면 Lynx에서도 동작할 수 있음 (확인 필요)

- [ ] `src/components/Skeleton/Skeleton.tsx`
- [ ] `docs/content/lynx/components/skeleton.mdx`
- [ ] `examples/lynx-spa/src/pages/SkeletonPage.tsx`

---

## 7. Celsius

**React 소스**: `packages/react/src/components/Celsius/Celsius.tsx`
**Lynx CSS recipe**: 없음

**구현:**
- 가장 단순. `value` prop → `"${value}°C"` 문자열 반환
- FC (forwardRef 아님)

- [ ] `src/components/Celsius/Celsius.tsx`
- [ ] `docs/content/lynx/components/celsius.mdx`
- [ ] `examples/lynx-spa/src/pages/CelsiusPage.tsx`

---

## 8. MannerTemp

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

## 9. MannerTempBadge

**React 소스**: `packages/react/src/components/MannerTempBadge/MannerTempBadge.tsx`
**Lynx CSS recipe**: `mannerTempBadge`

**Variant Props:**
- `level`: "l1" ~ "l10", default: "l1"

**구현:**
- 단일 컴포넌트, 슬롯 없음
- MannerTemp과 유사하지만 Emote 없음

- [ ] `src/components/MannerTempBadge/MannerTempBadge.tsx`
- [ ] `docs/content/lynx/components/manner-temp-badge.mdx`
- [ ] `examples/lynx-spa/src/pages/MannerTempBadgePage.tsx`

---

## 10. VisuallyHidden

**React 소스**: `packages/react/src/components/VisuallyHidden/VisuallyHidden.tsx`
**Lynx CSS recipe**: 없음 (인라인 스타일)

**구현:**
- `@seed-design/dom-utils`의 `visuallyHidden` 스타일 객체 적용
- 접근성용 — Lynx에서의 접근성 모델 확인 필요
- 스크린 리더 지원이 없으면 불필요할 수 있음

- [ ] `src/components/VisuallyHidden/VisuallyHidden.tsx`
- [ ] `docs/content/lynx/components/visually-hidden.mdx`
- [ ] `examples/lynx-spa/src/pages/VisuallyHiddenPage.tsx`
