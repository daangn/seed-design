---
id: lynx-headless-no-docs
description: Lynx 1.0(DES-2608 하위) 컴포넌트의 Headless 분리 티켓에서 `docs/content/lynx/components/*.mdx`나 `docs/examples/lynx/**`를 갱신하거나, 선례 문서의 `## Headless` 섹션·`headless.tsx` 예제를 따라 만들지 판단할 때 읽는다. Headless 패키지를 문서에 따로 소개하지 않는 결정과, 대신 styled 컴포넌트 문서에 반영할 범위를 다룬다. styled 컴포넌트의 새 기능이나 일반 문서 작업에는 적용하지 않는다.
scope: ["docs/content/lynx/**", "docs/examples/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-split-base-branch"]
---

# Lynx Headless 분리 작업은 Headless를 별도로 문서화하지 않는다

## 교훈과 다음 행동

- Headless 분리 티켓에서 컴포넌트 문서에 `## Headless` 섹션, Headless 패키지 `package-install`, `docs/examples/lynx/<component>/headless.tsx` 예제를 추가하지 않는다.
- 기존 문서의 Headless 섹션·예제(Accordion·ActionButton·AppBar·BottomSheet·Callout·Checkbox·Switch)는 선례로 삼지 않는다. 정리될 예정이므로 새 작업에서 형식을 맞추거나 확장하지 않는다.
- 티켓의 "docs 갱신"·"props/import 계약 갱신"은 styled 컴포넌트 문서의 계약으로 해석한다. `@seed-design/lynx-react` 사용자가 보는 변화(예: `accessibility-traits` 기본값)만 Props 표의 원천 JSDoc과 「웹 버전과의 차이」 같은 기존 절에 반영한다.
- Headless API 설명은 해당 패키지 소스의 JSDoc에 두고, Headless-only consumer 검증은 `examples/lynx-spa` 페이지로 한다. 기준 브랜치에 새로 머지된 형제 PR의 Headless 섹션은 방침 변경의 근거가 아니다. 방침이 다시 바뀌었는지 불명확하면 사용자에게 묻는다.

## 발생 근거와 적용 조건

- 상황: DES-2617(ContextualFloatingButton) 계획에서 ActionButton 문서(#2293)의 `## Headless` 섹션을 선례로 보고 CFB 문서에 Headless 안내 섹션을 추가하는 안을 제시했다.
- 결정: 2026-09-29 유지보수자가 "Headless는 별도로 문서화하지 않는다. 기존 Lynx Headless 문서 내용은 정리할 예정"이라고 정했다. CFB는 styled 문서의 접근성 절에 `accessibility-traits` 기본값만 추가했다.
- 재확인: 2026-10-01 Switch 분리(#2358)가 `switch.mdx`에 `## Headless` 절과 `headless.tsx` 예제를 추가한 채 머지됐다. 같은 날 DES-2632(Tabs) 계획에서 이 충돌을 묻자 유지보수자가 문서에 넣지 않고 `examples/lynx-spa` 페이지로만 검증하도록 정했다.
- 피할 패턴: 기준 브랜치에 있는 형제 티켓의 문서 형식을 현재 방침으로 간주하는 것.
- 위험: 정리 대상 섹션이 늘고, 형제 티켓마다 문서 구조가 달라져 정리 PR과 충돌한다.

## 변경 이력

- 2026-09-29: DES-2617 작업에서 유지보수자의 문서화 결정을 기록했다.
- 2026-10-01: DES-2632에서 Switch #2358과의 충돌과 유지보수자의 재확인을 반영하고, 형제 PR 섹션으로 방침 변경을 판단하던 기준을 바꿨다.
