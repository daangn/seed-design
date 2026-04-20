# Phase 1: 단순 표시 컴포넌트

variant/size props만 받아 className을 생성하는 가장 단순한 컴포넌트들.
ActionButton 패턴과 동일: `recipe.splitVariantProps()` → `clsx(classes.slot)` → `<view>`/`<text>`.

> **스코프 정리 (2026-04-20):** Phase 1은 웹에서 실질적으로 공개·문서화된 컴포넌트 중, Lynx에서 고유 가치가 있는 것만 남겼다.
> - Count: `@seed-design/react`에서 export되지만 rootage 스펙과 docs 페이지가 없는 내부 유틸 → Lynx로 포팅하지 않음.
> - Text: Lynx는 Tailwind v3 + 직접 `<text>` 사용으로 대체 가능하므로 스타일드 래퍼 불요.
> - Divider: Lynx의 `<view>` + border 스타일로 호출부에서 충분히 표현 가능하므로 후순위.
> - NotificationBadge / MannerTempBadge: 웹 페어 컴포넌트 중 상위(NotificationBadge의 Positioner, MannerTemp의 Emote)에 흡수 가능하거나 수요가 낮아 후순위.

---

## 1. Badge

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

## 2. Skeleton

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

## 3. MannerTemp

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
