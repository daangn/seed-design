---
id: lynx-spa-dev-prerequisites
description: 새 worktree에서 `examples/lynx-spa`의 dev server·build를 처음 실행해 기기 검증을 준비하거나, `lynx.config.ts` 로드 중 `@seed-design/rsbuild-plugin-lynx-icon/lib/index.js` ERR_MODULE_NOT_FOUND, 또는 lynx-css recipe CSS의 postcss-loader에서 `@seed-design/tailwind3-plugin/lib/index.cjs` Cannot find module이 날 때 읽는다. `prepare-workspace.ts`가 빌드하지 않는 두 plugin의 선행 빌드와, 컴파일 오류가 기기에서 빈 화면으로만 보이는 조건을 다룬다. docs 테스트·빌드 준비는 docs-build-prerequisites를 본다.
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**"]
status: active
related: ["docs-build-prerequisites", "workspace-installation", "iphone-lan-asset-prefix", "lynx-spa-package-lib-staleness"]
---

# 새 worktree의 lynx-spa 실행은 두 plugin의 선행 빌드가 필요하다

## 교훈과 다음 행동

- lynx-spa를 처음 띄우기 전에 `bun --filter @seed-design/rsbuild-plugin-lynx-icon build && bun --filter @seed-design/tailwind3-plugin build`를 실행한다. `bun run dev`의 `prepare-workspace.ts`는 `ultra --filter @seed-design/lynx-react`로 `@seed-design/lynx-react`만 빌드하고 이 두 plugin과 headless 패키지는 빌드하지 않는다. 고친 headless 패키지 lib는 `lynx-spa-package-lib-staleness`대로 따로 빌드한다.
- rsbuild-plugin-lynx-icon이 없으면 config 로드 단계에서 dev server가 종료된다. tailwind3-plugin이 없으면 server는 `main.lynx.bundle` URL을 출력하고 계속 떠 있지만, 모든 lynx-css recipe CSS가 postcss-loader에서 실패한다.
- 두 번째 경우 기기에서는 빈 화면과 `[rspeedy-dev-server]` console 오류만 보인다. 기기 화면을 판정하기 전에 dev server 로그에서 `ready built in`과 Module build failed 여부를 먼저 확인한다.
- plugin을 빌드한 뒤에는 dev server를 다시 시작한다. 실패한 postcss 설정은 실행 중인 server에서 다시 로드되지 않는다. 재시작으로 port가 바뀌면 이미 연 Card는 새 URL의 `Page.reload`로 다시 연다.

## 발생 근거와 적용 조건

- DES-2653(IdentityPlaceholder)에서 `refactor-lynx-components` 기반 새 worktree의 lynx-spa를 iPhone PlayLynx 검증용으로 실행했다. `bun install` 이후 lockfile 변경은 없었다.
- 첫 실행은 `lynx.config.ts`가 `examples/lynx-spa/node_modules/@seed-design/rsbuild-plugin-lynx-icon/lib/index.js`를 찾지 못해 종료됐다.
- plugin을 빌드한 두 번째 실행은 bundle URL을 출력했다. 그러나 `packages/lynx-css/recipes/*.css`가 `@seed-design/tailwind3-plugin/lib/index.cjs`를 찾지 못해 실패했고, 기기 screenshot은 빈 화면이었다.
- tailwind3-plugin을 빌드하고 server를 재시작하자 `ready built in 7.31s`가 출력됐고, 같은 Card의 reload로 문서 예제가 표시됐다.
- 피할 패턴: bundle URL 출력이나 HTTP 200만 보고 컴파일 성공으로 판단하는 것. 빈 화면을 컴포넌트 결함이나 asset prefix 문제로 먼저 해석하는 것.

## 변경 이력

- 2026-09-30: DES-2653 기기 검증 중 확인한 두 선행 빌드와 증상을 기록했다.
- 2026-10-06: `prepare-workspace.ts`가 빌드하는 범위를 원천(`ultra --filter @seed-design/lynx-react`)과 서버 로그에 맞춰 고쳤다. 실행 재검증은 lib 갱신 조건(`lynx-spa-package-lib-staleness`)에서만 했다.
