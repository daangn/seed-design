# Phase 4: 콘텐츠/리스트 컴포넌트

복합 구조를 갖지만 상태 관리는 단순한 컴포넌트들.

---

## 1. List

**React 소스**: `packages/react/src/components/List/List.tsx`
**lynx-ui 참고**: `/Documents/GitHub/lynx-ui/packages/lynx-ui-list/src/`
**Lynx CSS recipe**: `listItem` (6슬롯: root, content, prefix, suffix, title, detail), `listHeader`

**Exports:** `ListRoot`, `ListItem`, `ListContent`, `ListPrefix`, `ListSuffix`, `ListTitle`, `ListDetail`

**Variant Props (ListItem):** variant 없음 (기본 스타일)

**Lynx 구현 포인트:**
- ListRoot: `<view>` 기반 수직 리스트 (VStack 대체)
- 웹에서 Checkbox/RadioGroup/Switch headless 통합 → Lynx에서 미지원 (SVG 의존)
- ListItem의 `alignItems` 스타일 prop → `dynamicStyle()` 사용
- lynx-ui-list 참고: `<scroll-view>` 기반, useMaxSize 훅

**미지원:**
- ListItem의 Checkbox/RadioGroup/Switch 통합 (SVG 의존)

- [ ] `src/components/List/List.tsx`
- [ ] `docs/content/lynx/components/list.mdx`
- [ ] `examples/lynx-spa/src/pages/ListPage.tsx`

---

## 2. Article

**React 소스**: `packages/react/src/components/Article/Article.tsx`
**Lynx CSS recipe**: `article`

**구현:**
- Box 래퍼 → Lynx에서는 `<view className={article()}>` 직접
- `as="article"` → Lynx에서는 `<view>`
- 가장 단순한 구조

- [ ] `src/components/Article/Article.tsx`
- [ ] `docs/content/lynx/components/article.mdx`
- [ ] `examples/lynx-spa/src/pages/ArticlePage.tsx`

---

## 3. LinkContent

**React 소스**: `packages/react/src/components/LinkContent/LinkContent.tsx` (deprecated)
**Lynx CSS recipe**: `linkContent`

**주의:** deprecated (→ ActionButton variant="ghost"). 구현 필요성 재판단.

- [ ] `src/components/LinkContent/LinkContent.tsx`
- [ ] `docs/content/lynx/components/link-content.mdx`
- [ ] `examples/lynx-spa/src/pages/LinkContentPage.tsx`

---

## 4. Avatar

**React 소스**: `packages/react/src/components/Avatar/Avatar.tsx`
**React headless**: `packages/react-headless/avatar/src/` (Image primitive)
**Lynx CSS recipes**: `avatar` (4슬롯: root, image, fallback, badge), `avatarStack`

**Exports:** `AvatarRoot`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarStack`

**Variant Props:**
- Avatar: `size` (다수 프리셋)
- AvatarStack: 별도 recipe

**Lynx 구현 포인트:**
- Image 로딩 → Lynx `<image>` 요소 사용
- Fallback: 이미지 로드 실패 시 대체 UI
- onLoad/onError 이벤트로 상태 전환 → Lynx 이미지 이벤트 확인 필요
- AvatarStack: children을 순회하며 size context 전달

- [ ] `src/components/Avatar/Avatar.tsx`
- [ ] `docs/content/lynx/components/avatar.mdx`
- [ ] `examples/lynx-spa/src/pages/AvatarPage.tsx`

---

## 5. ImageFrame

**React 소스**: `packages/react/src/components/ImageFrame/ImageFrame.tsx`
**Lynx CSS recipes**: `imageFrame`, `imageFrameIcon`, `imageFrameIndicator`, `imageFrameReactionButton`

**Exports:** `ImageFrame`, `ImageFrameFloater`, `ImageFrameBadge`, `ImageFrameIcon`, `ImageFrameIndicator`, `ImageFrameReactionButton`

**Lynx 구현 포인트:**
- AspectRatio 래퍼 (기본 4/3) + Image 로딩
- ImageFrameIcon: SVG prop 필요 → **Lynx 미지원, Omit**
- ImageFrameReactionButton: Toggle + SVG 하트 → **Lynx 미지원, Omit**
- ImageFrame 기본 기능(이미지 + aspect ratio)만 구현

**미지원:**
- `ImageFrameIcon` (SVG)
- `ImageFrameReactionButton` (SVG 하트)

- [ ] `src/components/ImageFrame/ImageFrame.tsx`
- [ ] `docs/content/lynx/components/image-frame.mdx`
- [ ] `examples/lynx-spa/src/pages/ImageFramePage.tsx`

---

## 6. InlineBanner

**React 소스**: `packages/react/src/components/InlineBanner/InlineBanner.tsx` (deprecated → PageBanner)
**Lynx CSS recipe**: `inlineBanner` (6슬롯)

**주의:** deprecated. PageBanner를 우선 구현.

- [ ] `src/components/InlineBanner/InlineBanner.tsx`
- [ ] `docs/content/lynx/components/inline-banner.mdx`
- [ ] `examples/lynx-spa/src/pages/InlineBannerPage.tsx`

---

## 7. PageBanner

**React 소스**: `packages/react/src/components/PageBanner/PageBanner.tsx`
**Lynx CSS recipe**: `pageBanner`

**Exports:** `PageBannerRoot`, `PageBannerContent`, `PageBannerBody`, `PageBannerTitle`, `PageBannerDescription`, `PageBannerButton`, `PageBannerCloseButton`

**Variant Props:**
- `variant` + `tone` 조합 (solid + magic은 유효하지 않음 → 경고)

**Lynx 구현 포인트:**
- Compound component with ClassNamesProvider
- CloseButton: Dismissible 패턴 → Lynx에서 상태 관리로 구현
- variant="solid" + tone="magic" 조합 검증 로직

- [ ] `src/components/PageBanner/PageBanner.tsx`
- [ ] `docs/content/lynx/components/page-banner.mdx`
- [ ] `examples/lynx-spa/src/pages/PageBannerPage.tsx`

---

## 8. Callout

**React 소스**: `packages/react/src/components/Callout/Callout.tsx`
**Lynx CSS recipe**: `callout` (6슬롯: root, content, title, description, link, closeButton)

**Exports:** `CalloutRoot`, `CalloutContent`, `CalloutTitle`, `CalloutDescription`, `CalloutLink`, `CalloutCloseButton`

**Lynx 구현 포인트:**
- PageBanner와 유사한 Dismissible 패턴
- CloseButton: 닫기 상태 관리
- Link: bindtap으로 네비게이션

- [ ] `src/components/Callout/Callout.tsx`
- [ ] `docs/content/lynx/components/callout.mdx`
- [ ] `examples/lynx-spa/src/pages/CalloutPage.tsx`
