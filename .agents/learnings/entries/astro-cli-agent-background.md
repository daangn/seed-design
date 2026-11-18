---
id: astro-cli-agent-background
description: docs의 `astro preview`·`astro dev`를 에이전트 셸에서 portless 같은 process wrapper나 foreground 서버로 띄웠는데 명령이 곧바로 끝나 서버 주소가 응답하지 않을 때, 또는 백그라운드로 남은 Astro 서버를 끄려 할 때 읽는다. Astro CLI가 에이전트 실행을 감지해 스스로 background로 빠지는 조건과 foreground로 붙잡는 옵션·종료 명령을 다룬다. 빌드 실패나 port 충돌은 대상이 아니다.
scope: ["docs/package.json", "docs/astro.config.ts"]
status: active
---

# 에이전트 셸의 `astro preview`·`astro dev`는 `--ignore-lock`으로 foreground에 둔다

## 교훈과 다음 행동

- 에이전트 셸에서 Astro 서버를 wrapper 아래 띄울 때는 `--ignore-lock`을 붙인다. 예: `bun run --cwd docs preview --ignore-lock`. 붙이지 않으면 CLI가 background 프로세스로 빠지고 원래 명령은 끝나, wrapper가 붙을 프로세스가 사라진다.
- background로 남은 dev 서버는 `astro dev stop`으로 끈다. 프로세스를 직접 찾아 죽이기 전에 이 명령을 먼저 쓴다.

## 발생 근거와 적용 조건

- 상황(2026-11-13, Astro 재이전 Phase 0 스파이크와 Phase 1 게이트): `portless run … astro preview`가 즉시 끝나고 주소가 응답하지 않았다. `astro@7.4.11` `cli/preview/index.js`(L45)가 에이전트 실행을 감지하면 스스로 background로 빠진다. `--ignore-lock`을 붙이자 foreground에 남아 게이트 캡처가 돌았다. `astro dev`도 같았고 끌 때는 `astro dev stop`이었다.
- 적용 조건: `astro@7.4.11`. 감지 기준은 Astro 내부 구현이라 버전이 바뀌면 `cli/preview/index.js`에서 다시 확인한다. 사람이 터미널에서 직접 실행할 때는 해당하지 않을 수 있다.

## 변경 이력

- 2026-11-18: Astro 재이전 스파이크 S1·Phase 1 근거로 기록했다.
