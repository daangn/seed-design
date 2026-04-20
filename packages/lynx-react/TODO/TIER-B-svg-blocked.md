# Tier B: SVG 의존 — Lynx 3.7 대기

아이콘 glyph(체크마크·라디오 점·loading spinner·CloseButton의 X 아이콘 등)가 UX의 필수 구성요소인 컴포넌트. Lynx 3.7의 SVG 지원이 들어오면 순차적으로 Tier A로 승격한다.

**공통 원칙:**
- 본체 렌더가 아이콘 없이 완결되는 경우(버튼류의 spinner, iconOnly)에는 **해당 prop만 `Omit`하고 Tier A에서 구현**. ActionButton·ProgressCircle이 이 패턴.
- 본체가 아이콘 없이는 의미가 없는 경우(Checkbox의 체크마크, RadioGroup의 라디오 점)에는 **컴포넌트 전체를 Tier B에 둔다**.
- Tier A2 래핑 컴포넌트(Dialog/BottomSheet/MenuSheet)는 **본체는 착수, CloseButton 서브컴포넌트만 Tier B로 분리**.

---

## 1. ToggleButton / ReactionButton / ContextualFloatingButton

**Tier B 사유:** loading spinner (SVG) + iconOnly layout (SVG).
**Tier A 승격 가능성:** 본체는 ActionButton처럼 `loading`/`layout="iconOnly"`만 `Omit`하고 Tier A에서 구현할 수 있음. 우선순위 결정 필요.

| 컴포넌트 | Lynx CSS recipe | 원본 |
|---|---|---|
| ToggleButton | `toggleButton` | `packages/react/src/components/ToggleButton/` |
| ReactionButton | `reactionButton` | `packages/react/src/components/ReactionButton/` |
| ContextualFloatingButton | `contextualFloatingButton` | `packages/react/src/components/ContextualFloatingButton/` |

**착수 시 참고:**
- `useControllableState` + `usePressTap`으로 pressed 토글 (ToggleButton/ReactionButton)
- ContextualFloatingButton은 pressed 상태 없이 단순 `bindtap`
- IconRequired 검증 로직은 Lynx에서 불필요 (iconOnly 자체가 미지원)

---

## 2. Checkbox

**Tier B 사유:** 체크마크 glyph 자체가 SVG. CSS만으로는 SEED 디자인 재현 불가.
**래핑 후보:** `@lynx-js/lynx-ui-checkbox` (헤드리스는 제공, 마크는 consumer가 children으로 주입)

**Exports(웹):** `Checkbox`, `CheckboxGroup`

**Tier A 승격 조건:** Lynx 3.7 SVG 지원 + SEED 체크마크 SVG 포팅.

---

## 3. RadioGroup

**Tier B 사유:** 라디오 점이 SVG 디자인. CSS 중첩 `<view>`로는 디자인 가이드에 부합하지 않음.
**래핑 후보:** `@lynx-js/lynx-ui-radio-group`

**Exports(웹):** `RadioGroupRoot`, `RadioGroupItem`

**Tier A 승격 조건:** Lynx 3.7 SVG 지원 + SEED 라디오 점 SVG 포팅.

---

## 4. List (Checkbox/Radio/Switch 통합)

**Tier B 사유:** 웹의 `List`는 `ListItem`에 Checkbox/RadioGroup/Switch headless를 통합하는 방식. 통합 대상 컨트롤이 전부 SVG 의존.
**래핑 후보:** `@lynx-js/lynx-ui-list` (virtualized list 용, 서브컨트롤 통합은 별개)

**Exports(웹):** `ListRoot`, `ListItem`, `ListContent`, `ListPrefix`, `ListSuffix`, `ListTitle`, `ListDetail`

**Tier A 승격 경로:**
- **부분 착수 가능**: List 구조(`ListRoot/Item/Content/Prefix/Suffix/Title/Detail`) 자체는 `<view>`/`<text>` 조합으로 렌더 가능. Checkbox/Radio 통합만 제외하면 Tier A1로 착수 가능.
- 이 접근을 택할 경우 `Tier A1`로 올리고, 통합 prop만 Tier B에 남긴다.

---

## 5. ImageFrame

**Tier B 사유:** `ImageFrameIcon` (SVG prop), `ImageFrameReactionButton` (SVG 하트).
**Tier A 승격 경로:**
- **부분 착수 가능**: `ImageFrame`, `ImageFrameFloater`, `ImageFrameBadge`, `ImageFrameIndicator` 본체는 AspectRatio 래퍼 + `<image>` 로딩으로 가능. SVG 하위 컴포넌트만 Tier B.

**Exports(웹):** `ImageFrame`, `ImageFrameFloater`, `ImageFrameBadge`, `ImageFrameIcon`, `ImageFrameIndicator`, `ImageFrameReactionButton`

---

## 6. PageBanner / Callout

**Tier B 사유:** `PageBannerCloseButton` / `CalloutCloseButton`의 X 아이콘.
**Tier A 승격 경로:**
- **부분 착수 가능**: 본체 compound(`Root/Content/Body/Title/Description/Button/Link`)는 SVG 없이 가능. CloseButton만 분리해 Tier B.

**Exports(웹 PageBanner):** `PageBannerRoot`, `PageBannerContent`, `PageBannerBody`, `PageBannerTitle`, `PageBannerDescription`, `PageBannerButton`, `PageBannerCloseButton`
**Exports(웹 Callout):** `CalloutRoot`, `CalloutContent`, `CalloutTitle`, `CalloutDescription`, `CalloutLink`, `CalloutCloseButton`

---

## 7. Avatar (AvatarBadge with icon)

**Tier B 사유:** `AvatarBadge` 일부 케이스에서 아이콘 포함.
**Tier A 승격 경로:**
- **부분 착수 가능**: `AvatarRoot`, `AvatarImage`, `AvatarFallback`, `AvatarStack`는 `<image>` 기반으로 가능. 아이콘이 있는 AvatarBadge 사용 케이스만 Tier B.

---

## 8. Tier A2 래핑 컴포넌트의 CloseButton

Tier A2에서 본체는 착수하지만 CloseButton만 Tier B로 분리되는 항목:

- `DialogCloseButton`
- `BottomSheetCloseButton`
- `MenuSheetCloseButton`
- `HelpBubbleCloseButton` (있는 경우)

모두 X 아이콘 SVG 필요. Lynx 3.7 후 추가.

---

## 승격 전략

Lynx 3.7 SVG 지원이 들어오면:

1. SEED 아이콘 라이브러리(`@seed-design/react-icon`)의 Lynx 버전을 제공 (또는 `@karrotmarket/react-monochrome-icon` Lynx 포팅)
2. 본 문서의 컴포넌트들을 "부분 착수 가능" 표시가 된 것부터 Tier A로 승격
3. 완전 SVG 의존 항목(Checkbox, RadioGroup, 각 CloseButton)은 아이콘 포팅 이후 별도 착수
