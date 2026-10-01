---
id: docs-build-prerequisites
description: workspace lib가 준비되지 않았거나 오래된 checkout에서 docs 테스트·빌드를 시작하거나, @seed-design 패키지를 찾지 못하는 TS2307·module-resolution 오류, 또는 `typecheck:lynx-examples`에서 이미 있는 export가 없다는 TS2305·TS2322가 날 때 읽는다. 의존성 설치만으로 해결되지 않는 선행 lib 빌드와 docs:test·docs:build별 준비 순서를 다룬다.
scope: ["docs/**"]
status: active
related: ["workspace-installation"]
---

# 새 worktree의 docs 검증은 선행 lib 빌드가 필요하다

## 교훈과 다음 행동

- docs 검증 전에 필요한 lib를 빌드하고, 판정은 선행 빌드 후 재실행 결과로만 내린다.
- `bun docs:test` 전 `bun utils:build && bun headless:build && bun --filter @seed-design/react build && bun --filter @seed-design/rsbuild-plugin-lynx-icon build && bun lynx:generate`. `bun docs:build` 전 `bun ecosystem:build && bun packages:build`.
- `bun lynx:generate`가 새 Lynx headless 패키지에서 `@lynx-js/react`를 찾지 못하는 TS2307로 실패하면 checkout 뒤 추가된 workspace 패키지가 설치되지 않은 것이다. `bun install --frozen-lockfile` 후 다시 실행한다.

## 발생 근거와 적용 조건

- 상황: 새 worktree에서 `bun docs:test`와 `bun docs:build`를 바로 실행했다.
- 영향: `@seed-design/react`, `@seed-design/rootage-core`, `@seed-design/stackflow` 모듈을 찾지 못해 실패했다. 변경과 무관한 실패였지만 재실행이 필요했다.
- 피할 패턴: 누락된 workspace `lib` 때문에 난 TS2307·module-resolution 실패를 docs 변경의 실패로 판정하는 것.
- 재확인(DES-2654, 2026-09-30): 새 worktree에서 앞의 세 빌드만 하면 `docs:test`의 bun test 345개는 통과했지만 `typecheck:lynx-tooling`이 `docs/lynx.config.ts`의 `@seed-design/rsbuild-plugin-lynx-icon`을 찾지 못해 TS2307로 실패했다. 이 패키지를 빌드한 뒤 재실행하자 모두 통과했다.
- 재확인(DES-2627, 2026-10-01): pull 뒤 오래된 worktree에서 앞의 네 빌드만 하자 bun test 345개와 `typecheck:lynx-tooling`은 통과했지만 `typecheck:lynx-examples`가 실패했다. `lynx-react`·Lynx headless `lib`가 source보다 오래되어 `MenuSheet`·`FieldButton` export가 없다는 TS2305와 props TS2322, 새 패키지 `@seed-design/lynx-react-sortable`·`-switch`를 찾지 못하는 TS2307이 났다. `bun lynx:generate`는 `lynx-react-field`가 `@lynx-js/react`를 찾지 못해 실패했고, `bun install --frozen-lockfile`(lockfile 변경 없음) 뒤 `bun lynx:generate`를 다시 실행하자 `typecheck:lynx-examples`가 통과했다.
- 위험: 잘못된 실패 판정을 내리거나, 검증을 건너뛰고 미검증으로 남긴다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
- 2026-09-28: frontmatter만으로 읽기 대상을 고를 수 있도록 대상·적용 조건·본문에서 다루는 판단을 보강했다. 실행 재검증은 하지 않았다.
- 2026-09-30: `docs:test` 준비에 `@seed-design/rsbuild-plugin-lynx-icon` 빌드를 추가했다(DES-2654 재실행으로 확인).
- 2026-10-01: `docs:test` 준비에 `bun lynx:generate`와 새 workspace 패키지 설치 조건을 추가했다(DES-2627 재실행으로 확인).
