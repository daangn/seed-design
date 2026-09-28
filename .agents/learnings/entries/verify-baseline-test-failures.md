---
id: verify-baseline-test-failures
description: 전체 테스트·타입 검증 실패를 현재 변경의 회귀와 기준 브랜치의 기존 실패로 구분할 때 읽는다.
scope: ["**"]
status: active
related: ["workspace-installation"]
---

# 전체 검증 실패는 기준 브랜치에서 재현되는지부터 가른다

## 교훈과 다음 행동

- diff 비교로 후보만 좁히고, 기준 브랜치에서 같은 실패가 재현될 때만 기존 실패로 보고한다. 재현되지 않으면 현재 변경의 간접 영향으로 보고 조사한다. 어느 경우든 변경 경로의 검증 명령은 따로 실행해 결과를 보고한다.
- `git diff --stat origin/dev -- <테스트 파일> <대상 파일>`이 비어 있으면 후보다 → `git worktree add --detach <scratch 경로> origin/dev` → 그 안에서 `bun install --frozen-lockfile --ignore-scripts`와 같은 `bun test <테스트 파일>`을 실행한다 → 같은 단언으로 실패할 때만 기존 실패로 적고, 끝나면 `git worktree remove`한다.

## 발생 근거와 적용 조건

- 상황: `bun test:all`이 `tools/rootage-cdn/src/release-workflow.test.ts` 1건으로 실패했다. `#2255`가 workflow 입력을 `publish-script`로 바꾸면서 테스트의 `publish: bun release` 기대값이 낡은 상태였다. 처음에는 두 파일의 `git diff`가 비어 있다는 것만으로 기존 실패라고 판정했다.
- 영향: `test:unit`에서 멈춰 뒤따르는 Lynx 검증이 실행되지 않았다. diff 비교는 다른 변경 파일이나 설치 상태를 거친 간접 영향을 배제하지 못해 리뷰에서 지적받았고, `origin/dev` worktree에서 다시 재현해 확정했다.
- 피할 패턴: 전체 검증의 실패를 곧바로 현재 변경의 회귀로 보거나, 반대로 확인 없이 무관하다고 보고하는 것.
- 위험: 기준 브랜치의 기존 실패를 고치느라 범위를 넓히거나, 실제 회귀를 놓친다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
