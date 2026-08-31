# AGENTS.md

## 디렉토리 개요

`stackflow-spa`를 실제 모바일 브라우저 환경에서 검증하는 Playwright E2E 테스트를 둔다. 테스트 전용 UI는 `src/activities`에 두고 공개 패키지 API는 변경하지 않는다.

## 파일 작성 컨벤션

- 논리 테스트 파일은 `*.e2e.ts`로 작성한다.
- 테스트 전용 route는 `/e2e/*` 아래에 두며 홈 화면에 링크하지 않는다.
- barrel file은 만들지 않고 필요한 도우미를 파일에서 직접 import한다.

## 코드 작성 컨벤션

- locator는 접근성 role이나 `data-testid`를 사용하고 CSS class 및 인라인 style 문자열에 의존하지 않는다.
- 이미지의 공개 loading 상태, 실제 레이아웃, hit-test 결과처럼 사용자에게 관측되는 값을 검증한다.
- screenshot이나 AppScreen의 transition 내부 상태를 단언하지 않는다.
