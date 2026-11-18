---
id: lynx-spa-toolchain-version-alignment
description: "`examples/lynx-spa` build·dev가 `ESModulesLinkingError: export 'captureMainThreadObject' ... was not found in '@lynx-js/react/internal'`이나 `worklet-runtime`·`worklet-dev-runtime` 오류로 멈출 때, 또는 Renovate 등으로 다른 workspace의 `@lynx-js/react`·`react-rsbuild-plugin`·`rspeedy`를 올린 뒤 읽는다. lynx-spa의 고정 버전이 hoisted Lynx 툴체인과 어긋나는 조건과 어떤 패키지를 함께 맞출지를 다룬다. plugin lib 누락으로 인한 ERR_MODULE_NOT_FOUND는 lynx-spa-build-prerequisites를 본다."
scope: ["examples/lynx-spa/**", "docs/package.json", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-spa-build-prerequisites", "lynx-spa-dev-prerequisites"]
verified_at: "2026-11-10"
---

# lynx-spa의 Lynx 툴체인은 docs와 같은 버전 조합으로 맞춘다

## 교훈과 다음 행동

- lynx-spa는 `@lynx-js/react`·`@lynx-js/react-rsbuild-plugin`·`@lynx-js/rspeedy`·`@lynx-js/config-rsbuild-plugin`을 정확한 버전으로 고정한다. 다른 workspace(docs, `packages/lynx-*`의 devDependencies)만 올라가면 lynx-spa 런타임과 컴파일 결과가 서로 다른 ReactLynx 버전을 기준으로 만들어진다.
- 위 증상이 나면 `examples/lynx-spa/package.json`의 네 패키지를 `docs/package.json`과 같은 버전으로 `bun add`(툴체인은 `bun add -d`)한다. react만 올리면 plugin 쪽에서 `worklet-dev-runtime` 오류가 나므로 네 패키지를 함께 맞춘다.
- 맞춘 뒤 `bun.lock`에 `lynx-spa/@lynx-js/...` 중첩 항목이 남지 않았는지 확인한다. 남아 있으면 아직 별도 버전으로 해석되고 있다는 뜻이다.
- `bun add`가 package.json의 무관한 항목 순서를 정렬할 수 있다. diff를 확인해 순서 변경은 되돌리고, `bun install`이 `no changes`인지 확인한다.

## 발생 근거와 적용 조건

- #2574가 `@lynx-js/react`를 0.129.1로 올리고 docs를 `react-rsbuild-plugin 0.22.1`·`rspeedy 0.18.4`·`config-rsbuild-plugin 0.2.5`로 맞췄다. lynx-spa는 `react 0.123.3`·`react-rsbuild-plugin 0.18.3`·`rspeedy 0.16.4`·`config-rsbuild-plugin 0.2.2`로 남았다.
- 이 상태에서 `bun --filter lynx-spa build`가 `captureMainThreadObject`(imported as `__captureMainThreadObject`)를 `@lynx-js/react/internal`에서 찾지 못해 실패했다. 이 export는 0.129.1 runtime에는 있고, lynx-spa의 0.123.3 runtime에는 없다. 그런데 컴파일 결과가 이 export를 import했다. 컴파일 쪽은 0.129 기준이고 런타임은 0.123.3이었다는 뜻이다[추론: transform이 hoisted 0.129.1을 해석].
- 네 패키지를 docs 버전으로 맞추자 lockfile의 `lynx-spa/@lynx-js/*` 중첩 항목이 모두 사라졌다. `bun lynx-headless:build`, `bun --filter lynx-spa build`, `portless`로 띄운 dev server(`ready built in 29.2s`, bundle HTTP 200), `bun test:lynx-react`가 모두 통과했다. 기기 실행은 이 기록 시점에 확인하지 않았다.

## 변경 이력

- 2026-11-10: #2574 이후 lynx-spa build 실패를 고치며 기록했다.
