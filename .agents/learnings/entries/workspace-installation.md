---
id: workspace-installation
description: 새 checkout·pull·rebase·의존성 변경 뒤 테스트·빌드·API 추출을 준비하거나, vitest 실행 파일·workspace 모듈·새 의존성을 찾지 못할 때 읽는다. lockfile에 맞춘 설치와 bin 준비, 병렬 작업의 설치 담당, 과거 prepare 실패의 적용 조건을 다룬다. 실행 검증이 없는 문서 편집에는 적용하지 않는다.
scope: ["**"]
status: active
---

# 검증·추출 전에 설치 상태부터 맞춘다

## 교훈과 다음 행동

- 작업을 배정하기 전에 조율자가 설치 상태를 한 번 확인하고 고친다. 새 workspace 패키지나 의존성을 추가한 뒤에도 조율자만 `bun install`을 실행한다.
- 첫 검증 전에 `bun install --frozen-lockfile --ignore-scripts`를 한 번 실행한다. `ls node_modules/.bin | wc -l`이 0이면 조율자가 `bun install`을 실행한다. `9c4356857`(`fix(extract-api-surface): declare skills-npm where prepare runs it`) 이전 기준에서 `prepare`가 `skills-npm: command not found`로 멈추면 `bun install --ignore-scripts && bun install`로 우회한다. 확인: `cd packages/lynx-react && bun run test -- src/components/Accordion/Accordion.test.tsx`.
- 루트 bin 수만으로 설치 완료를 판단하지 않는다. 검증할 workspace 패키지의 `node_modules/.bin/vitest`처럼 그 패키지의 실행 파일도 확인한다. 기존 checkout에 새 workspace 패키지가 들어온 뒤에는 `--frozen-lockfile` 설치가 `no changes`로 끝나도 그 패키지의 `node_modules`가 없을 수 있다 → 조율자가 `bun install`을 실행하고 `git diff bun.lock`이 비었는지 확인한다.

## 발생 근거와 적용 조건

- 상황: 새 worktree에서 `bun install`이 끝나지 않은 상태(루트 `node_modules/.bin` 없음)를 확인하지 않고 테스트·빌드를 여러 작업자에게 배정했다. 루트 `bun install`도 `tools/extract-api-surface`의 `prepare`(`skills-npm`)가 bin 링크 전에 실행돼 exit 127로 중단됐다.
- 영향: `vitest: command not found`, `ERR_MODULE_NOT_FOUND vitest`, toggle·image 빌드의 TS7006이 코드 문제처럼 보였고, 작업자가 원인 조사와 재실행에 시간을 썼다.
- 상황: 기존 checkout에서도 `dev`를 받은 뒤 설치를 갱신하지 않고 `extract-api-surface`를 실행했다. 새로 추가된 의존성(`@radix-ui/react-focus-scope`)이 `node_modules`에 없었다.
- 영향: 추출이 `unresolved import(s)`로 멈췄다. `bun install --frozen-lockfile --ignore-scripts` 후 재실행해 해결했다.
- 상황(DES-2677): 기존 worktree에서 루트 `node_modules/.bin`은 15개였지만 최근 추가된 `packages/lynx-react-headless/callout`에는 `node_modules`가 없어 `bun --filter @seed-design/lynx-react-callout test`가 `vitest: command not found`(exit 127)로 실패했다. `bun install --frozen-lockfile --ignore-scripts`는 `no changes`로 끝나 상태를 바꾸지 않았고, `bun install` 뒤 `bun.lock` diff 없이 패키지 bin이 생겨 테스트가 통과했다.
- 피할 패턴: 설치 여부를 확인하지 않고 검증·추출 명령부터 실행하거나 배정하는 것. pull·rebase 뒤 lockfile이 바뀌었는데 설치를 건너뛰는 것. 설치 실패를 패키지 코드 오류로 해석하는 것.
- 위험: 환경 문제를 코드 결함으로 오판하고, 병렬 작업자가 같은 실패를 각자 조사한다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
- 2026-09-28: description의 증상·적용 범위를 보강하고 개인 실행 환경에 따른 소요 시간 보장을 제거했다. 실행 재검증은 하지 않았다.
- 2026-09-29: 루트 bin이 있어도 새 workspace 패키지의 bin이 없는 DES-2677 사례와 패키지 단위 확인 절차를 추가했다.
