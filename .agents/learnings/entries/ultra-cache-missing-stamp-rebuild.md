---
id: ultra-cache-missing-stamp-rebuild
description: CI setup의 build output 캐시를 restore-key로 복원했는데도 `packages:build`(ultra-runner)가 변경 없는 패키지 수십 개를 다시 빌드할 때, 또는 `.github/actions/setup` 캐시 path나 ultra 판정을 바꾸려 할 때 읽는다. checkout mtime·lockfile이 아니라 build script 없는 패키지의 `.ultra.cache.json` 부재와 캐시되지 않은 `bin/` 산출물이 연쇄 재빌드를 일으키는 원인과 확인 방법을 다룬다. 패키지 원천이 실제로 바뀐 재빌드는 대상이 아니다.
scope: [".github/actions/setup/**", "package.json", "packages/**/package.json", "ecosystem/**/package.json"]
status: active
---

# ultra 재빌드 연쇄는 `.ultra.cache.json`이 없는 의존 패키지에서 시작한다

## 교훈과 다음 행동

- ultra-runner는 추적 파일을 git blob hash로 비교한다. 복원 뒤 재빌드 원인을 checkout mtime이나 lockfile에서 찾지 않는다 → 재빌드 판정 로그에서 의존 패키지의 mtime이 0인 항목과 `- bin` 항목부터 본다.
- build script가 없는 workspace 패키지(`css`, `lynx-css`, `rootage-artifacts`, `migration-index`, `stylesheet`, `tailwind4-theme`, `lynx-vitest-config`)는 `.ultra.cache.json`을 만들지 않는다. ultra는 이 의존을 mtime 0으로 기록하고 0을 항상 변경으로 보므로, 이들에 의존하는 패키지와 그 하위가 매번 빌드된다. CLI 산출물 `bin/`이 캐시 path에 없으면 CLI 패키지도 복원 뒤 다시 빌드된다.
- 대응은 캐시 path에 `bin/`을 더하고, 캐시 복원 뒤 build script 없는 패키지마다 추적 내용 digest를 `.ultra.cache.json`에 쓰는 것이다. 패키지 단위 content-hash 캐시 key는 필요 없다.

## 발생 근거와 적용 조건

- 상황(2026-11-13, docs Astro 재이전 스파이크 S6): CI setup build 캐시가 exact로 맞은 run은 18회 중 2회였고, restore-key 복원에서도 98개 중 48–50개가 다시 빌드됐다(ultra 53–145초).
- 확인: ultra-runner 3.10.5 `lib/git.js` `parseFiles`(`git ls-files -s` hash), `lib/build.js` `getDependencies`(파일이 없으면 mtime 0)와 `getChanges`(0이면 modified)를 읽었다. 로컬 재현의 재빌드 집합이 CI run의 집합과 정확히 같았다. 위 대응을 적용하자 Version Packages 조건에서 실제로 바뀐 패키지만 빌드됐고, 복원 tree와 `ultra --rebuild` 전체 빌드의 `lib/dist/bin` 2,816개 파일 중 lynx·CLI 산출물이 모두 같았다(`react-headless` 9개 `index.d.ts`의 멤버 순서 차이는 기존 비결정성).
- 적용 조건: ultra-runner 3.10.5, 2026-11 기준 `.github/actions/setup/action.yml`. setup 수정은 docs 이전과 별도 작업이다. 적용 전에 그 action에 `bin` path와 stamp step이 이미 있는지 확인한다.

## 변경 이력

- 2026-11-18: docs Astro 재이전 스파이크 S6 근거로 기록했다.
