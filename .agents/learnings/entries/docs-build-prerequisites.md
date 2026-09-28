---
id: docs-build-prerequisites
description: workspace lib가 준비되지 않은 checkout에서 docs 테스트·빌드를 시작하거나, @seed-design 패키지를 찾지 못하는 TS2307·module-resolution 오류를 조사할 때 읽는다. 의존성 설치만으로 해결되지 않는 선행 lib 빌드와 docs:test·docs:build별 준비 순서를 다룬다.
scope: ["docs/**"]
status: active
related: ["workspace-installation"]
---

# 새 worktree의 docs 검증은 선행 lib 빌드가 필요하다

## 교훈과 다음 행동

- docs 검증 전에 필요한 lib를 빌드하고, 판정은 선행 빌드 후 재실행 결과로만 내린다.
- `bun docs:test`·`bun --filter @seed-design/docs typecheck:web`·`bun docs:build` 모두 먼저 `bun ecosystem:build && bun packages:build`를 실행한다. 빌드 뒤에도 남는 오류는 변경분을 `git stash`한 같은 worktree에서 다시 실행해 기존 오류인지 가른다.

## 발생 근거와 적용 조건

- 상황: 새 worktree에서 `bun docs:test`와 `bun docs:build`를 바로 실행했다.
- 영향: `@seed-design/react`, `@seed-design/rootage-core`, `@seed-design/stackflow` 모듈을 찾지 못해 실패했다. 변경과 무관한 실패였지만 재실행이 필요했다.
- 상황: 이 항목의 옛 해결책대로 utils·headless·react만 빌드하고 `bun docs:test`와 `typecheck:web`을 실행했다.
- 영향: `docs:test`의 `typecheck:lynx-examples`가 `@seed-design/lynx-react`를, `typecheck:web`이 `@seed-design/rootage-core`를 찾지 못해 다시 실패했다.
- 피할 패턴: 누락된 workspace `lib` 때문에 난 TS2307·module-resolution 실패를 docs 변경의 실패로 판정하는 것.
- 위험: 잘못된 실패 판정을 내리거나, 검증을 건너뛰고 미검증으로 남긴다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
- 2026-09-28: frontmatter만으로 읽기 대상을 고를 수 있도록 대상·적용 조건·본문에서 다루는 판단을 보강했다. 실행 재검증은 하지 않았다.
- 2026-09-28: utils·headless·react만 빌드한 뒤에도 `docs:test`·`typecheck:web`이 실패한 근거를 추가하고, 모든 docs 검증의 선행 빌드를 `bun ecosystem:build && bun packages:build`로 통일했다.
