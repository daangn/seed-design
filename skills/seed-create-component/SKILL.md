---
name: seed-create-component
description: SEED의 React, Lynx 또는 공통 컴포넌트를 새로 만들거나 공개 API·스타일·문서까지 함께 변경할 때 현재 구현을 찾고, 플랫폼과 배포 방식을 정해 최소 파일 계획부터 구현·검증·changeset·PR 준비까지 연결한다. API를 바꾸지 않는 Storybook 문서 작업은 짧은 경로로 처리한다.
---

# SEED 컴포넌트 작업

이 스킬은 컴포넌트 작업의 진입점을 정하는 라우터다. 모든 참고 문서를 순서대로 읽지 않는다. 현재 작업에 필요한 스킬과 reference만 선택한다.

## 먼저 확인할 것

1. 저장소 루트부터 수정 경로까지 적용되는 `AGENTS.md`를 읽는다.
2. [`seed-component-map`](../seed-component-map/SKILL.md)으로 현재 구현, 공개 export, Recipe, Registry, 문서, 예제를 찾는다. 신규 컴포넌트라면 `not-found` 결과를 현재 구현이 없다는 근거로 남긴다.
3. 결과에 나온 실제 파일을 직접 읽는다. 맵 결과만으로 API나 책임을 추정하지 않는다.
4. 요청을 기존 컴포넌트 변경, 새 컴포넌트, 문서·Storybook 전용 중 하나로 분류한다.

## 함께 쓰는 `seed-*` 스킬

| 필요한 판단 | 사용할 스킬 |
| --- | --- |
| 현재 레이어와 공개 경로 찾기 | [`seed-component-map`](../seed-component-map/SKILL.md) |
| React와 Lynx의 API·상태·접근성 차이 비교 | [`seed-api-parity`](../seed-api-parity/SKILL.md) |
| Lynx 문서와 실행 예제 작성 | [`seed-write-lynx-component-docs`](../seed-write-lynx-component-docs/SKILL.md) |
| 공개 패키지 변경의 버전과 changeset 작성 | [`seed-changeset`](../seed-changeset/SKILL.md) |
| 현재 변경의 영향, 검증 순서, PR base 결정 | [`seed-change-plan`](../seed-change-plan/SKILL.md) |
| 확정한 base로 rebase·commit·push·PR 준비 | [`seed-submit-change`](../seed-submit-change/SKILL.md) |

`seed-api-parity`의 차이는 곧바로 누락으로 보지 않는다. 브라우저와 Lynx의 런타임·접근성·입력 방식 때문에 의도적으로 다른 항목인지 먼저 분류한다.

`seed-submit-change`는 사용자가 제출 작업을 요청한 경우에만 사용한다. `seed-change-plan`이 정한 `origin/dev`, `origin/minor`, `origin/major` 중 하나를 rebase와 PR base에 그대로 사용한다.

## 기존 컴포넌트 변경

1. `seed-component-map` 결과에서 이번 요청과 직접 연결된 파일을 읽는다.
2. React와 Lynx를 함께 바꾸거나 한쪽 차이가 문제인지 판단해야 하면 `seed-api-parity`를 사용한다.
3. 바꾸려는 사용자 결과를 한 문장으로 적고 대상 플랫폼과 배포 방식을 확정한다.
4. 구조를 바꾸는 경우에만 [아키텍처 결정](references/architecture-decisions.md)과 [API 설계](references/api-design.md)를 읽는다. 스타일이나 문서만 바꾸는 작업에 전체 설계 절차를 적용하지 않는다.
5. 기존 구현에서 가장 가까운 파일을 기준으로 필요한 원천 파일만 수정한다. 생성 파일은 직접 수정하지 않는다.
6. [검증 체크리스트](references/verification-checklist.md)에서 실제 변경과 관련된 항목을 실행한다.
7. 공개 패키지가 바뀌면 `seed-changeset`을 사용한다. commit·PR을 준비할 때는 변경 종류와 관계없이 `seed-change-plan`으로 base를 정한다. rebase·commit·push·PR 제출을 요청받았다면 마지막에 `seed-submit-change`를 사용한다.

## 새 컴포넌트

1. `seed-component-map`의 `not-found`와 가까운 기존 컴포넌트의 경로를 함께 확인한다.
2. 대상 플랫폼을 `react`, `lynx`, `cross-platform` 중 하나로 정한다. 판단 기준은 [플랫폼 선택](references/platform-gate.md)에 있다.
3. [API 설계](references/api-design.md)에 따라 제공 방식을 `package-only`, `snippet-only`, `package+snippet`, `docs-only` 중 하나로 정한다.
4. 요구사항에 구현을 바꿀 빈칸이 있을 때만 [요구사항 탐색](references/brainstorming.md)을 사용한다. 이미 구체적인 요청을 다시 인터뷰하지 않는다.
5. [아키텍처 결정](references/architecture-decisions.md)에서 Headless 책임, Recipe 종류, 접근성, 레이어별 참조 컴포넌트를 정한다.
6. 다음 명령으로 확정한 결정을 파일 계획으로 바꾼다.

```bash
bun skills/seed-create-component/scripts/scaffold-plan.ts <component> \
  --platform <react|lynx|cross-platform> \
  --surface <package-only|snippet-only|package+snippet|docs-only>
```

스크립트는 아키텍처나 Registry 필요성을 대신 결정하지 않는다. `items`는 파일 경계만 제안하며 시나리오 완전성을 보장하지 않는다. `source`, `reference`, `generated`, `conflicts`, `referenceScenarios`, `warnings`를 검토하고 이번 작업에 필요한 원천 파일만 계획에 남긴다.

다른 플랫폼의 문서 예제가 있으면 `referenceScenarios`의 모든 ID를 `동일 지원`, `Lynx식 변환`, `미지원`으로 분류한 대응표를 파일 생성 전에 작성한다. `preview.tsx` 하나가 계획에 있다는 이유로 다른 예제를 범위 밖으로 두지 않는다. Lynx 문서·예제를 포함하면 [Lynx 문서 작성 스킬](../seed-write-lynx-component-docs/SKILL.md)의 asset, frame, 초기 상태, 입력, 전이, 화면 셸 대응표를 완료 조건으로 삼는다.

7. [구현 순서](references/implementation-steps.md)에 따라 Headless, Rootage, Recipe, Styled UI, Registry, 문서, 예제 중 필요한 레이어만 구현한다.
8. [검증 체크리스트](references/verification-checklist.md)를 실행한다. 공개 패키지가 바뀌면 `seed-changeset`을 사용한다. commit·PR을 준비할 때는 `seed-change-plan`으로 base를 정하고, 제출을 요청받은 경우에만 `seed-submit-change`로 이어간다.

새 패키지, 외부 의존성, CI 설정이 필요하면 구현 전에 사용자 확인을 받는다.

## 짧은 경로

### Lynx 문서·예제만 변경

컴포넌트와 런타임 동작을 바꾸지 않으면 `seed-component-map`으로 배포 방식을 확인한 뒤 `seed-write-lynx-component-docs`를 사용한다. 실제 호스트 앱에서도 재현되는 문제를 발견하면 문서용 우회를 만들지 않고 컴포넌트 변경 흐름으로 돌아온다.

### Storybook만 변경

`docs/stories/*.stories.tsx`나 `docs/.storybook/*`만 바꾸고 공개 API와 동작은 유지한다면 [Storybook 규칙](references/storybook.md)과 [시각 검증](references/visual-testing.md)만 사용한다. 작업 중 컴포넌트 API나 Recipe 변경이 필요해지면 기존 컴포넌트 변경 흐름으로 전환한다.

### 생성물만 어긋난 경우

원천 파일과 생성 명령을 먼저 찾는다. 생성 파일을 직접 고치지 않는다. 원천이 맞다면 저장소 지침의 생성 명령을 실행하고 예상한 생성물만 바뀌었는지 확인한다.

## 구현 reference 라우팅

| 상황 | 읽을 문서 |
| --- | --- |
| 플랫폼이 모호하거나 교차 플랫폼 | [platform-gate.md](references/platform-gate.md) |
| 공개 API나 Registry 여부 결정 | [api-design.md](references/api-design.md) |
| 요구사항에 중요한 빈칸이 있음 | [brainstorming.md](references/brainstorming.md) |
| 새 컴포넌트 또는 레이어 구조 변경 | [architecture-decisions.md](references/architecture-decisions.md), [pattern-catalog.md](references/pattern-catalog.md) |
| React Styled UI 구현 | [react-patterns.md](references/react-patterns.md) |
| Lynx 구현, native 텍스트 배치나 상태 전환 | [lynx-patterns.md](references/lynx-patterns.md) |
| Recipe 구현 | [recipe-patterns.md](references/recipe-patterns.md) |
| 레이어별 경로와 생성 관계만 확인 | [guide.md](references/guide.md) |
| Registry·문서·예제를 포함한 구현 순서 | [implementation-steps.md](references/implementation-steps.md) |
| 외부 인터페이스·접근성 패턴 조사 | [external-references.md](references/external-references.md) |
| 검증과 시각 확인 | [verification-checklist.md](references/verification-checklist.md), [visual-testing.md](references/visual-testing.md) |
| 막힘이 생김 | [sticking-policy.md](references/sticking-policy.md) |
| 이 스킬의 라우팅을 수정한 뒤 검토 | [review-prompts.md](references/review-prompts.md) |

## 완료 조건

- 요청한 사용자 결과와 대상 플랫폼이 구현·타입·문서에서 일치한다.
- package와 Registry 중 선택한 배포 방식이 문서와 예제에도 그대로 적용된다.
- 원천 파일을 수정하고 생성 파일을 직접 고치지 않았다.
- 변경과 관련된 기존 테스트와 저장소 필수 검증을 통과했다.
- 공개 패키지 변경에는 확정한 changeset이 있다.
- commit·PR을 준비한다면 changeset 유무와 관계없이 확정한 base를 쓰는 변경 계획이 있다.
