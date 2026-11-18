# examples/stackflow-spa/e2e

`stackflow-spa`를 모바일 브라우저 환경(Pixel·iPhone device 프로필)에서 검증하는 Playwright E2E 테스트다. `examples/stackflow-spa/playwright.config.ts`가 `*.e2e.ts`를 찾고 dev 서버를 `127.0.0.1:4173`에 직접 띄운다.

## 검증

1. 브라우저가 없으면 `examples/stackflow-spa`에서 `bunx playwright install --with-deps chromium webkit`을 실행한다.
2. `bun --filter @seed-design/stackflow-spa e2e`를 실행한다.

## 규칙

- 테스트 파일은 `*.e2e.ts`로 쓴다. 다른 이름은 수집되지 않고, `bun test`도 이 파일을 실행하지 않는다.
- 테스트 전용 UI는 `src/activities`의 activity로 만들고 route는 `/e2e/*`에 둔다. 홈 화면에 링크하지 않는다. 공개 패키지 API는 테스트를 위해 바꾸지 않는다.
- barrel file을 만들지 않고 도우미는 파일에서 직접 import한다.
- locator는 접근성 role이나 `data-testid`로 잡는다. CSS class와 인라인 style 문자열에 의존하지 않는다.
- macOS에서 WebKit 프로필의 Tab은 시스템 키보드 탐색 기본값을 따라 button을 건너뛰고 input 같은 텍스트 컨트롤로만 이동한다. CI(Linux)의 WebKit은 button에도 멈춘다. button 사이의 Tab 이동을 단언하는 테스트는 파일 첫머리에 `test.skip(({ browserName }) => browserName === "webkit" && process.platform === "darwin", "macOS WebKit's Tab skips buttons")`를 둔다. WebKit 전체를 skip하면 CI 검증까지 사라진다.
- 이미지의 공개 loading 상태, 실제 레이아웃, hit-test 결과처럼 사용자에게 관측되는 값을 단언한다. screenshot이나 AppScreen transition 내부 상태는 단언하지 않는다.
