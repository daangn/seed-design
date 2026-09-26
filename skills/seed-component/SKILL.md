---
name: seed-component
description: SEED 컴포넌트의 경로 조회·React·Lynx API 비교, 신규·포팅·기존 구현 변경, React·Lynx 문서·예제 작성, 또는 컴포넌트와 무관한 색상 토큰의 지도·WCAG 대비 조사를 할 때 사용한다.
---

# SEED 컴포넌트

요청이 원하는 결과로 분기를 하나 고르고, 그 분기의 reference만 읽는다. 조회·비교·토큰 분기는 **읽기 전용**이다. 결과를 반환하고 끝내며, 사용자가 구현을 요청하지 않는 한 다른 분기로 넘어가지 않는다.

| 요청 결과 | 읽을 reference | 실행 |
| --- | --- | --- |
| 한 컴포넌트의 구현·export·Registry·문서·테스트 경로만 | [component-map.md](references/component-map.md) | `bun skills/seed-component/scripts/component-map.ts <Component>` |
| React·Lynx 공개 API와 사용자 결과 차이만 | [api-parity.md](references/api-parity.md) | `bun skills/seed-component/scripts/api-parity.ts <Component>` |
| 색상 토큰의 정의·alias·사용처·생성 표면 또는 대비만 (컴포넌트 없이도) | [color-token-analysis.md](references/color-token-analysis.md) | `bun skills/seed-component/scripts/token-map.ts '<token>'`, `token-contrast.ts` |
| 새 컴포넌트 또는 한 플랫폼이 없는 포팅 | [implementation-workflow.md 신규·포팅](references/implementation-workflow.md#신규포팅) | `bun skills/seed-component/scripts/scaffold-plan.ts` |
| 기존 컴포넌트의 구현·동작·구조 변경 | [implementation-workflow.md 기존 구현 변경](references/implementation-workflow.md#기존-구현-변경) | 경로 조회 후 필요 시 API 비교 |
| Lynx 문서·실행 예제만 (컴포넌트 동작 유지) | [lynx-docs.md](references/lynx-docs.md) | 경로가 불명확할 때만 경로 조회 |
| React 문서·예제, Storybook, 생성물만 | [implementation-workflow.md 짧은 경로](references/implementation-workflow.md#짧은-경로) | 경로가 불명확할 때만 경로 조회 |

## 경계

- 문서·Storybook 전용 분기는 컴포넌트 구현을 요구하지 않는다. 실제 호스트 앱에서도 재현되는 API·동작 문제를 발견하면 문서용 우회 대신 기존 구현 변경으로 전환한다.
- 새 패키지, 외부 의존성, CI 설정이 필요하면 구현 전에 사용자 확인을 받는다.
- Lynx native 결과를 소스 수정 없이 독립 판정하는 일은 [`seed-verify-lynx-component`](../seed-verify-lynx-component/SKILL.md)가 맡는다.
- 여러 레이어의 담당·병렬 작업·에이전트 간 협의가 요청됐거나 필요하면 [`seed-orchestrate-component`](../seed-orchestrate-component/SKILL.md)를 함께 사용한다.
- changeset·변경 계획·제출은 [`seed-change`](../seed-change/SKILL.md)가 맡는다.
