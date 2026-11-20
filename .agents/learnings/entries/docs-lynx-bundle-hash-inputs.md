---
id: docs-lynx-bundle-hash-inputs
description: docs 빌드 산출물을 두 checkout·두 commit 사이에서 비교하다가 `public/__lynx__`의 `*.<hash>.lynx.bundle` 이름이나 `manifest.json`이 달라졌을 때, 또는 `docs/postcss.config.js`·Lynx entry 생성 경로를 옮기거나 지우려 할 때 읽는다. 예제 원천이 같아도 번들 hash가 바뀌는 빌드 입력과, 그 차이를 회귀와 구분하는 비교 방법을 다룬다. Lynx 예제의 화면·런타임 회귀 조사는 대상이 아니다.
scope: ["docs/scripts/lynx-examples/**", "docs/scripts/compare-build-output*", "docs/postcss.config.js", "docs/examples/lynx/**", "docs/astro.config.ts"]
status: active
related: ["isolated-regression-baselines"]
verified_at: "2026-11-20"
---

# Lynx 예제 번들 hash는 예제 원천 밖의 빌드 입력에도 반응한다

## 교훈과 다음 행동

- 산출물 동일성을 볼 때 Lynx 번들은 파일 이름이 아니라 hash를 지운 `manifest.json`의 예제 목록과 나머지 필드로 비교한다. `docs/scripts/compare-build-output.allowlist.ts`의 `lynx-bundle-content-hash`·`lynx-manifest-bundle-hash` 항목이 이 정규화를 맡는다.
- 번들 hash가 달라졌으면 예제 원천보다 먼저 빌드 입력이 같았는지 본다. entry 디렉터리 경로, checkout 경로, `docs/postcss.config.js`가 hash에 들어간다.
- `docs/postcss.config.js`는 웹 번들러가 쓰지 않더라도 지우지 않는다. Lynx 예제 빌드(Rsbuild)가 이 파일로 Tailwind를 돌린다. 웹 쪽은 `docs/astro.config.ts`의 `vite.css.postcss`를 빈 plugin 목록으로 고정해 이 파일이 중복 적용되지 않게 한다.

## 발생 근거와 적용 조건

- 상황(첫 Astro 이전, c1a2105fd): 기준 commit의 Next 산출물과 파일 단위로 비교했다. 예제 원천(`docs/examples/lynx/**`)은 건드리지 않았는데 Lynx 번들 이름이 달랐다.
- 확인한 것(2026-11-11):
  - 같은 checkout에서 캐시를 지우고 다시 빌드하면 번들 이름이 모두 같다. 빌드 자체는 결정적이다.
  - entry 생성 디렉터리 이름만 `.next/lynx-entries`에서 `.cache/lynx-entries`로 바꾸자 번들 20개의 hash가 바뀌었다.
  - checkout 경로가 다른 두 worktree에서 같은 commit을 빌드해도 일부 번들의 hash가 달랐다.
  - `docs/postcss.config.js`를 지우고 Lynx 예제를 다시 빌드하자 번들 22개의 hash가 바뀌었고, 파일을 되돌리고 다시 빌드하자 원래 이름으로 돌아왔다.
- 확인한 것(2026-11-20): 빌드를 `@lynx-js/rspeedy` 0.18.5 CLI에서 `@rsbuild/core` 2.2.9 CLI(`@lynx-js/rsbuild-plugin` 0.1.8)로 바꾼 뒤에도 같은 checkout의 cold 빌드 산출물 111개(bundle 108개, `web-core.css`, manifest 2개)가 전환 전과 byte 단위로 같았고, cold 재빌드 두 번도 같았다. Rspeedy 0.18.5가 내부에서 같은 Rsbuild 2.2.9를 썼기 때문이다[추론]. 위 네 비교 중 다시 확인한 것은 같은 checkout 재빌드뿐이다.
- 적용 조건: `@rsbuild/core` 2.2.9(이전 확인은 `@lynx-js/rspeedy` 0.18.5), `docs/scripts/lynx-examples/`가 entry를 `docs/.cache/` 아래에 생성하는 구성에서 확인했다. hash에 반영되는 입력은 번들러 버전에 따라 달라질 수 있으므로, 다른 버전에서는 같은 checkout 재빌드부터 다시 확인한다. development 빌드 bundle은 전환 전후에 빌드 시각으로 보이는 13자리 숫자 주석·`__webpack_require__.h` compilation hash·`debugmetadata:` ID만 달랐다 → 산출물 동일성은 production 빌드로 비교한다.

## 변경 이력

- 2026-11-11: 첫 Astro 이전 작업에서 기준 산출물 비교 중 확인한 내용을 기록했다. 검증 범위는 위 네 가지 재빌드 비교다.
- 2026-11-18: revert(ac0162349)로 지워진 항목을 재이전 뒤 복원했다. 게시 경로를 지금 구성(`public/__lynx__`)으로, PostCSS 고정 위치를 `docs/astro.config.ts`로 고쳤다. 재빌드 비교는 다시 하지 않았다.
- 2026-11-20: docs Lynx 예제 빌드를 Rsbuild CLI로 바꾸며 같은 checkout cold 재빌드와 전환 전후 산출물을 다시 비교했다. development bundle에서만 달라지는 항목을 적용 조건에 더했다.
