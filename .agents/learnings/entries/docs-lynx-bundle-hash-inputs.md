---
id: docs-lynx-bundle-hash-inputs
description: docs 빌드 산출물을 두 checkout·두 commit 사이에서 비교하다가 `public/lynx-examples`의 `*.<hash>.lynx.bundle` 이름이나 `manifest.json`이 달라졌을 때, 또는 `docs/postcss.config.js`·Lynx entry 생성 경로를 옮기거나 지우려 할 때 읽는다. 예제 원천이 같아도 번들 hash가 바뀌는 빌드 입력과, 그 차이를 회귀와 구분하는 비교 방법을 다룬다. Lynx 예제의 화면·런타임 회귀 조사는 대상이 아니다.
scope: ["docs/scripts/lynx-examples/**", "docs/scripts/compare-build-output*", "docs/postcss.config.js", "docs/examples/lynx/**"]
status: active
related: ["isolated-regression-baselines"]
verified_at: "2026-11-11"
---

# Lynx 예제 번들 hash는 예제 원천 밖의 빌드 입력에도 반응한다

## 교훈과 다음 행동

- 산출물 동일성을 볼 때 Lynx 번들은 파일 이름이 아니라 hash를 지운 `manifest.json`의 예제 목록과 나머지 필드로 비교한다. `docs/scripts/compare-build-output.allowlist.ts`의 `lynx-bundle-content-hash`·`lynx-manifest-bundle-hash` 항목이 이 정규화를 맡는다.
- 번들 hash가 달라졌으면 예제 원천보다 먼저 빌드 입력이 같았는지 본다. entry 디렉터리 경로, checkout 경로, `docs/postcss.config.js`가 hash에 들어간다.
- `docs/postcss.config.js`는 웹 번들러가 쓰지 않더라도 지우지 않는다. Lynx 예제 빌드(rspeedy)가 이 파일로 Tailwind를 돌린다. 웹 쪽에서 이 파일이 중복 적용되면 번들러 설정에서 PostCSS 설정을 따로 고정한다(`docs/astro.config.ts`의 `vite.css.postcss`).

## 발생 근거와 적용 조건

- 상황: docs를 Next.js에서 Astro로 옮기면서 기준 commit의 산출물과 파일 단위로 비교했다. 예제 원천(`docs/examples/lynx/**`)은 건드리지 않았는데 Lynx 번들 이름이 달랐다.
- 확인한 것:
  - 같은 checkout에서 캐시를 지우고 다시 빌드하면 번들 이름이 모두 같다. 빌드 자체는 결정적이다.
  - entry 생성 디렉터리 이름만 `.next/lynx-entries`에서 `.cache/lynx-entries`로 바꾸자 번들 20개의 hash가 바뀌었다.
  - checkout 경로가 다른 두 worktree에서 같은 commit을 빌드해도 일부 번들의 hash가 달랐다.
  - `docs/postcss.config.js`를 지우고 Lynx 예제를 다시 빌드하자 번들 22개의 hash가 바뀌었고, 파일을 되돌리고 다시 빌드하자 원래 이름으로 돌아왔다.
- 적용 조건: `@lynx-js/rspeedy` 0.18.5, `docs/scripts/lynx-examples/`가 entry를 `docs/.cache/lynx-entries`에 생성하는 구성에서 확인했다. hash에 반영되는 입력은 번들러 버전에 따라 달라질 수 있으므로, 다른 버전에서는 같은 checkout 재빌드부터 다시 확인한다.

## 변경 이력

- 2026-11-11: docs Astro 이전 작업에서 기준 산출물 비교 중 확인한 내용을 기록했다. 검증 범위는 위 네 가지 재빌드 비교다.
