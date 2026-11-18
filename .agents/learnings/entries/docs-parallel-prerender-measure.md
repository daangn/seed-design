---
id: docs-parallel-prerender-measure
description: docs Astro 빌드 시간을 줄이려고 `parallelPrerender`(`SEED_DOCS_PRERENDER_WORKERS`)를 켜거나 CI 빌드 단계 시간을 분석할 때 읽는다. 렌더가 빌드에서 차지하는 비율과 지금까지 잰 workers 이득, 채택 기준과 다시 잴 시점을 다룬다. incremental 캐시 적중이나 Lynx 예제 빌드 시간은 대상이 아니다.
scope: ["docs/astro.config.ts", "docs/package.json", ".github/workflows/deploy-seed-design-docs-*"]
status: active
related: ["astro-build-determinism-useid"]
---

# docs 빌드는 렌더가 작아 `parallelPrerender` 이득이 적다

## 교훈과 다음 행동

- `parallelPrerender`를 켜기 전에 같은 환경에서 serial과 workers=3의 렌더 시간을 잰다. 채택 기준은 렌더가 serial의 50% 이하다. 기준에 못 미치면 `SEED_DOCS_PRERENDER_WORKERS`는 측정용 스위치로만 둔다.
- 빌드 시간을 줄일 곳은 렌더보다 번들(type table 생성 포함)이다. 단계별 시간은 `build:pre`·`build:post`의 `concurrently --timings`와 CI `docs-build-timings` artifact로 본다.
- 렌더 비중이 크게 바뀌는 변경(셸 hydrate island 추가, 수백 쪽 route 추가) 뒤에는 다시 잰다. incremental과 함께 켜도 복원 수·산출물이 같았으므로 켤 때 분기를 두지 않는다.

## 발생 근거와 적용 조건

- 측정(2026-11-13, Docker): 문서 섹션 558 route 렌더 serial 4.02초 → workers=3 2.86초(71%). 빌드의 66–79%가 번들이었다. Phase 1 셸 정적 SSR·endpoint를 더한 693 route에서도 serial 중앙 7.9초 → 5.2초(66%)였다. 두 플래그를 함께 켜도 복원 수와 산출물이 incremental 단독·serial과 같았다.
- Astro config hash는 두 플래그를 보지 않는다(`astro@7.4.11` `core/build/config-hash/input.js`).
- 적용 조건: `astro@7.4.11`. Phase 2(셸 island)·Phase 4(토큰 reference 약 338쪽) 뒤의 재측정은 하지 않았다.

## 변경 이력

- 2026-11-18: docs Astro 재이전 스파이크 S4·Phase 1 측정 근거로 기록했다.
