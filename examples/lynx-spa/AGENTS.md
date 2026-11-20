# examples/lynx-spa

Rsbuild(`pluginReactLynx`가 등록하는 Lynx 빌드 엔진) 기반 Lynx SPA 예제 앱이다. Lynx native 기본 장면 검증에 쓰인다.

## 검증

- 변경 후 → `bun --filter lynx-spa typecheck`와 `bun --filter lynx-spa build`
- 개발 서버 → `bun lynx:dev`, 빌드 결과 미리보기 → `bun --filter lynx-spa preview`, Rsbuild 설정 확인 → 이 디렉터리에서 `bunx rsbuild inspect`
- 패키지의 `check`·`format` script는 이 앱 전체를 다시 쓴다 → 실행하지 말고 변경한 파일만 `bun biome format --write <파일>`로 맞춘다.

## 규칙

- Lynx intrinsic element(`<view>`, `<text>` 등)는 런타임 변수로 치환하지 않고 리터럴 JSX로 쓴다.
- `VariantTable`(`src/components/variant-table.tsx`)의 아이콘 색상·타이밍을 고칠 때만 `docs/content/lynx/hooks/use-icon-color.mdx`의 근거를 확인한다. 근거 없이 timer 재시도나 색상 token 예외를 넣지 않는다 → 근거가 없으면 원인을 보고한다.
- Lynx·Rsbuild 동작이 불확실하면 그 부분의 공식 문서만 확인한다.
- `rsbuild.config.ts`의 `enableCSSInlineVariables: true`를 끄지 않는다. SEED 컴포넌트가 inline으로 넘기는 변수(예: `--slider-thumb-left`)와, lynx-css Recipe가 class 안에서 다른 변수를 담는 사용자 정의 속성(예: `--seed-checkmark-pressed-color: var(...)`)이 이 플래그가 켜져 있을 때만 해석된다.
- `rsbuild.config.ts`의 asset prefix는 `ASSET_PREFIX`이고, 없으면 dev는 `PORTLESS_URL`(portless 도메인), build는 `/`다. host가 이 주소에 접근하지 못하면 main bundle만 열리고 lazy 예제가 로드되지 않는다 → 기기에서 접근 가능한 절대 origin을 준다(예: `portless run --name ette sh -c 'ASSET_PREFIX="http://<LAN 주소>:$PORT/" exec bun run dev'`, iOS 시뮬레이터는 `http://127.0.0.1:$PORT/`). prefix는 `main.lynx.bundle`에 문자열로 들어가므로 전후 bundle을 byte로 비교할 때는 두 build에 같은 `ASSET_PREFIX`를 쓰거나 비교 전에 prefix를 같은 값으로 치환한다.

## 작업 절차

### workspace 준비

`dev`·`build`가 먼저 실행하는 `docs/scripts/lynx-examples/prepare-workspace.ts`는 `ultra -r --build --filter @seed-design/lynx-react build`로 `@seed-design/lynx-react`만 빌드한다. filter에 `+`가 없어 headless 등 의존 workspace lib와 config가 쓰는 plugin lib는 빌드하지 않는다.

1. 새 worktree에서 처음 띄우기 전에 `bun lynx-headless:build`, `bun --filter @seed-design/rsbuild-plugin-lynx-icon build`, `bun --filter @seed-design/tailwind3-plugin build`를 실행한다. 루트 `lynx:generate`는 icon plugin을 빌드하지 않는다.
2. icon plugin lib가 없으면 `rsbuild.config.ts` 로드에서 `ERR_MODULE_NOT_FOUND`로 멈춘다. tailwind plugin lib가 없으면 dev 서버는 bundle URL을 출력한 채 떠 있지만 lynx-css recipe CSS가 postcss-loader에서 실패하고, 기기에는 빈 화면만 보인다 → 기기 화면을 판정하기 전에 서버 로그의 `ready built in`과 `Module build failed` 여부를 확인한다. plugin을 빌드한 뒤에는 서버를 다시 시작한다.
3. `ultra -r --build`가 `No changes. Skipping build...`로 넘어간 패키지의 lib를 소비하는 build가 해석 실패나 TS2307로 멈추면 같은 filter에 `--rebuild`를 더해 다시 빌드한다. Ultra cache는 산출물이 있는지 검사하지 않는다.
4. 서버 실행 중 컴포넌트를 고친 뒤의 lib 갱신은 [Lynx 검증 런북 1절](../../skills/seed-verify-lynx-component/references/verification.md#1-사전-점검과-서버-소유권)을 따른다.

### Lynx 툴체인 버전

- 이 앱은 `@lynx-js/react`·`@lynx-js/react-rsbuild-plugin`·`@lynx-js/config-rsbuild-plugin`·`@rsbuild/core`를 정확한 버전으로 고정한다. 다른 workspace에서 이 패키지를 올리면 앞의 세 패키지는 `docs/package.json`과 같은 버전으로, `@rsbuild/core`는 docs가 쓰는 `@lynx-js/rspeedy`의 `@rsbuild/core` 의존 버전(`bun.lock`의 `@lynx-js/rspeedy` 항목)으로 함께 맞춘다(`@lynx-js/react`는 `bun add`, 나머지는 `bun add -d --exact`). 어긋나면 `captureMainThreadObject ... was not found in '@lynx-js/react/internal'`이나 `worklet-dev-runtime` 오류로 build가 멈춘다.
- 맞춘 뒤 `bun.lock`에 `lynx-spa/@lynx-js/...` 중첩 항목이 남지 않았는지 확인한다. `lynx-spa/@rsbuild/core`는 루트에 다른 `@rsbuild/core`가 올라가 있어 생기는 항목이므로 버전만 확인한다. `bun add`가 `package.json`의 무관한 항목 순서를 바꾸면 되돌리고, `bun install`이 `no changes`인지 확인한다.
- `@lynx-js/qrcode-rsbuild-plugin`은 0.7.2 이상을 쓴다. 그보다 낮은 버전의 `registerConsoleShortcuts`는 Rspeedy만 노출하는 `rspeedy.api`를 구조 분해하므로, 그 API가 없는 Rsbuild CLI에서는 첫 compile 뒤 QR 출력 단계에서 예외를 던진다.
