---
id: lynx-spa-build-prerequisites
description: 새 worktree에서 기기 검증용 `bun --filter lynx-spa build`(production bundle)를 처음 실행하거나, 이 build가 `@seed-design/rsbuild-plugin-lynx-icon/lib/index.js` 또는 `@seed-design/tailwind3-plugin/lib/index.cjs`의 `ERR_MODULE_NOT_FOUND`·`Cannot find module`로 멈출 때 읽는다. headless lib 선행 build에서 Ultra가 `No changes. Skipping build...`를 출력했는데도 소비 build가 headless 패키지 해석 실패나 TS2307로 멈출 때도 읽는다. `prepare-workspace.ts`가 준비하지 않는 두 workspace lib의 선행 build 순서와 Ultra cache를 무시하는 `--rebuild` 조건을 다룬다. ASSET_PREFIX·기기 URL 문제는 `iphone-lan-asset-prefix`를 본다.
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["iphone-lan-asset-prefix", "workspace-installation"]
---

# lynx-spa production build는 icon·tailwind plugin lib를 먼저 build해야 한다

## 교훈과 다음 행동

- 새 worktree에서 `examples/lynx-spa`를 build하기 전에 설치 상태를 맞추고(`workspace-installation`) 두 plugin을 먼저 build한다.
  - `bun --filter @seed-design/rsbuild-plugin-lynx-icon build`
  - `bun --filter @seed-design/tailwind3-plugin build`
- 그다음 `ASSET_PREFIX=<기기에서 접근 가능한 URL>/ bun --filter lynx-spa build`를 실행한다. `@seed-design/lynx-react`와 그 의존 lib는 build 스크립트의 `prepare-workspace.ts`가 준비한다.
- 두 오류는 순서대로 하나씩 드러난다. icon plugin 오류는 config 로드 단계, tailwind plugin 오류는 Rspack bundle 단계에서 난다. 첫 오류만 고치고 다시 실행하면 두 번째 오류가 나므로, 두 plugin을 함께 build한다.
- headless lib 선행 build(`ultra -r --build`)에서 일부 패키지가 `No changes. Skipping build...`로 넘어갔는데 그 패키지 lib을 소비하는 build가 해석 실패나 TS2307로 멈추면, 같은 filter에 `--rebuild`를 더해 cache를 무시하고 다시 build한다. 이 cache skip을 lib이 준비됐다는 증거로 보지 않는다.

## 발생 근거와 적용 조건

- 원인: `examples/lynx-spa/lynx.config.ts`가 `@seed-design/rsbuild-plugin-lynx-icon`을 import하고, `examples/lynx-spa/tailwind.config.ts`가 `@seed-design/tailwind3-plugin`을 import한다. 두 패키지는 `lib/` 산출물을 commit하지 않는다. `docs/scripts/lynx-examples/prepare-workspace.ts`는 `@seed-design/lynx-react`(와 `ultra --build` 의존)만 build한다. 루트 `lynx:generate`는 tailwind plugin만 build하고 icon plugin은 build하지 않는다.
- 상황(DES-2655): `bun install`과 `bun lynx-headless:build`만 마친 worktree에서 `bun --filter lynx-spa build`가 먼저 `Cannot find module '.../node_modules/@seed-design/rsbuild-plugin-lynx-icon/lib/index.js' imported from .../lynx.config.ts`로 멈췄다. 이 plugin을 build한 뒤에는 `Cannot find module '.../@seed-design/tailwind3-plugin/lib/index.cjs'`로 Rspack build가 실패했다. 두 plugin을 build한 뒤에는 build가 성공했다.
- 피할 패턴: 첫 `ERR_MODULE_NOT_FOUND`를 설치 누락으로 보고 `bun install`을 반복하는 것. `lynx:generate`로 모든 선행 build가 끝난다고 가정하는 것.
- 상황(DES-2708): 새 worktree에서 작업 중인 패키지를 제외한 기존 headless 33개를 이름 filter로 `ultra -r --build`했다. `floating`이 `No changes. Skipping build...`를 출력했고, 그 lib을 소비하는 `menu`가 TS2307로 실패했다. 이어진 lynx-spa build도 아직 없는 `toggle` lib 해석에서 실패했다. 같은 filter에 `--rebuild`를 더하자 headless build, scale-feedback build, lynx-spa production build가 모두 통과했다.
- 근거: Ultra 3.10.5 `node_modules/ultra-runner/lib/build.js`의 `needsBuild()`(75–97행)는 패키지의 `.ultra.cache.json`(gitignore 대상)에 기록한 Git 입력 hash·mtime과 의존 cache를 비교할 뿐, export 산출물이 있는지는 검사하지 않는다. lib 없이 cache만 남은 경위는 확인하지 못했다[추론: 이전 build 차수의 cache가 남은 상태].

## 변경 이력

- 2026-09-30: DES-2655 ReactionButton 기기 검증 중 확인한 선행 build 순서를 기록했다.
- 2026-10-06: DES-2708 PullToRefresh 환경 준비에서 Ultra cache skip과 `--rebuild` 조건을 추가했다.
