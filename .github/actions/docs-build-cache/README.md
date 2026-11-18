# 문서 빌드 캐시

문서 Alpha·Production workflow는 이 액션을 한 job에서 네 번 부른다.

1. `prepare`: checkout 직후, setup 전. 캐시 key에 쓸 추적 파일 hash를 `GITHUB_ENV`에 남긴다. setup이 `packages/*/lib`·`node_modules`를 만들기 전이라 exclude 패턴 없이 추적 파일만 hash된다.
2. `restore`: setup 뒤. type table 호환성 hash(`bun -e`)를 계산하고 다섯 단위를 복원한다. `outputs.lynx-out-hit`이 `true`면 workflow가 `SEED_DOCS_LYNX_PREBUILT=1`로 Rspeedy를 건너뛴다.
3. `report`: 빌드 step 뒤 항상. 단계 시간·캐시 적중·복원한 페이지 수를 step summary와 artifact `docs-build-timings`(JSON + 빌드 로그, 30일)에 남긴다.
4. `save`: 빌드가 성공한 뒤. 단위별 조건에 맞으면 새 key로 저장한다.

## 캐시 단위

`${gen}`은 Production `github.sha`, Alpha `baseline`, archive 빌드 `${platform}-${version}-archive`(`scripts/docs-archive/build-target.ts`)다. restore 순서는 현재 브랜치 → 기본 브랜치(`dev`)다. `benchmark-cache-key`를 주면 Figma를 뺀 모든 단위가 `benchmark-<값>-` namespace로 갈라진다.

| 단위 | path | key | save 조건 |
| --- | --- | --- | --- |
| figma | `docs/.cache/figma-image` | restore는 항상 miss인 key + restore-key `docs-figma-v2-`, save는 빌드 뒤 `build-manifest.json` hash | save key가 복원한 key와 다를 때 |
| lynx-out | `docs/public/__lynx__`, `docs/.cache/build-data/lynx-manifest.json` | `docs-lynx-out-v1-<Lynx 입력 hash>`, restore-key 없음 | miss일 때 |
| lynx-rspack | `docs/.cache/lynx-rspeedy` | `docs-lynx-rspack-v3-<bun.lock>-scope-<branch>-${gen}` | lynx-out이 miss라 Rspeedy가 돌았고 exact가 아닐 때. lynx-out이 hit면 복원도 하지 않는다(약 600MB) |
| typetable | `docs/.cache/fumadocs-typescript` | `docs-typetable-v3-<호환성 hash>-scope-<branch>-${gen}` | exact가 아닐 때 |
| astro | `docs/.cache/astro` | `docs-astro-v3-<bun.lock>-<설정 hash>-scope-<branch>-${gen}` | `incremental-build.json`이 있고 exact가 아닐 때 |

- lockfile이 바뀌면 lynx-out·lynx-rspack·typetable·astro가 모두 무효다. Astro와 type table 캐시가 스스로 lockfile을 보고 버리므로 key에도 넣어 쓸 수 없는 캐시를 받지 않는다.
- type table 호환성 hash는 `docs/components/type-table/cache-compatibility.ts`가 정한다. `bun.lock`과 패키지 원천 디렉터리 전체가 들어간다.
- Astro는 incremental build(`SEED_DOCS_INCREMENTAL_BUILD=1`)에서 lockfile·설정·route module graph·content entry·페이지 `cacheKey`(본문 digest + 섹션 nav digest + Git 수정일)로 페이지마다 재사용을 판정한다. workflow가 `fetch-depth: 0`·`filter: blob:none`으로 checkout하는 것은 Git 수정일 때문이다.

## Lynx 산출물 key

`prepare`의 `hashFiles` 목록은 예제의 실제 import 그래프에서 정했다. entry 원천(`docs/examples/lynx`), 예제가 `@/components/ui/*`로 부르는 `docs/registry/lynx`, `scripts/lynx-examples/modules.ts`가 부르는 `docs/playground/lynx`, Lynx 패키지 원천(`lynx-react`·headless·`lynx-css`·`utils/lynx-react-scale-feedback`·`rsbuild-plugin-lynx-icon`), web 환경 alias 대상 `packages/css/base.css`, headless가 extends하는 `tsconfig.lynx.json`, lockfile이 내용을 기록하지 않는 `patches/`, Rsbuild build dependency(`package.json`·`tsconfig*.json`·`bunfig.toml`), 외부 의존성 전체(`bun.lock`, `.bun-version`)다. 예제가 새 workspace 패키지·설정 파일을 부르게 되면 이 목록에 더한다. 빠뜨리면 그 입력만 바뀐 push가 이전 번들을 복원해 배포한다.

## 탈출구

- `skip-page-cache`(dispatch 입력): Astro 페이지 캐시를 복원하지 않고 `astro build --force`로 모든 페이지를 렌더링한다. 낡은 페이지가 배포됐다고 의심될 때 쓴다.
- `skip-figma-cache`: Figma 이미지 캐시를 복원하지 않는다.
- 캐시 형식이나 입력 목록을 바꿀 때는 해당 단위의 `vN`을 올린다.
