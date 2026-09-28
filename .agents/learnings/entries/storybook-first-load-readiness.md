---
id: storybook-first-load-readiness
description: Storybook iframe의 첫 렌더를 검증할 때 읽는다. Vite 의존성 재최적화로 첫 로드가 늦어지는 경우를 컴포넌트 실패와 구분하는 대기 기준을 다룬다.
scope: ["docs/stories/**", "docs/.storybook/**"]
status: active
---

# Storybook 첫 로드는 준비 상태를 기다린다

## 교훈과 다음 행동

- 서버 준비를 확인하고 index.json에서 실제 story id를 찾은 뒤 iframe.html?id=<id>로 접근한다. 첫 로드는 selector를 충분한 제한 시간(예: 30초)으로 기다리고 오류·렌더 상태를 구분한다.

## 발생 근거와 적용 조건

- Vite 의존성 재최적화가 있는 첫 Storybook iframe 로드에 기본 2초 대기를 사용해 렌더 전 실패로 판정했다. 개인 PATH·전역 도구 설치 상태는 저장소 공통 교훈에서 제외했다.

## 변경 이력

- 2026-09-29: major rebase에서 AGENT_LEARNINGS.md 원문 commit `57d9448f8`의 교훈을 이관했다. 이관 과정에서 실행 재검증하지 않았다.
