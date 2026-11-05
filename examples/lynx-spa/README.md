# SEED Lynx SPA

`docs/examples/lynx`의 컴포넌트 예제를 하나의 ReactLynx 앱에서 실행한다. 컴포넌트의 native 동작을 검증할 때는 이 앱을 사용한다. 문서 사이트 빌드나 개별 예제 bundle 서빙은 필요하지 않다.

## 개발 서버

저장소 루트에서 `bun install`로 의존성을 준비한다. `portless --version`이 `0.15.3`인지 확인한 뒤 다음 명령을 실행한다.

```bash
cd examples/lynx-spa
portless run --name ette bun run dev
```

다른 버전이면 서버를 실행하지 않고 전역 지침에 따라 `portless@0.15.3` 설치를 안내한다. 실행 중인 서버를 재사용할 때는 해당 프로세스가 현재 worktree의 `examples/lynx-spa`를 제공하는지 확인한다.

서버가 출력한 `main.lynx.bundle` 주소를 PlayLynx 같은 호스트 앱에서 연다. 실기기에서는 `localhost`가 아니라 기기에서 접근할 수 있는 LAN 주소를 사용한다. `dev` 명령은 필요한 workspace 준비도 수행한다.

## 문서 예제 직접 열기

기본 진입은 홈의 `문서 예제 → 컴포넌트 → 시나리오` 순서다. 자동 검증에서는 bundle URL에 `example` query를 붙여 같은 예제로 바로 이동할 수 있다.

```text
<실제 서버 origin>/main.lynx.bundle?example=lynx%2Faccordion%2Fpreview
<실제 서버 origin>/main.lynx.bundle?fullscreen=true&example=lynx%2Faccordion%2Fpreview
```

- ID는 `lynx/<component>/<scenario>`이며 `docs/examples/lynx/<component>/<scenario>.tsx`와 대응한다.
- ID 값을 URL 인코딩한다. 기존 query가 있으면 `&example=`을 사용하고, fragment가 있으면 그 앞에 붙인다.
- query가 없으면 홈을 연다. 비어 있거나 존재하지 않는 ID는 `예제를 찾을 수 없습니다.` 화면으로 표시한다.
- 정상 예제에서 뒤로 가면 해당 컴포넌트 목록, 한 번 더 뒤로 가면 홈으로 이동한다.
- query는 앱을 열거나 다시 로드할 때 한 번 적용한다. 일반 화면 이동 중에는 다시 적용하지 않는다.

`lynx://open?url=`을 사용하는 호스트에서는 query를 포함한 bundle URL 전체를 다시 URL 인코딩해 `url` 값에 넣는다. 연결된 기기는 `bunx agent-lynx open <URL> --client <client-id>`로 열 수 있다. 해당 호스트가 받는 HTTP bundle URL 또는 딥 링크를 사용한다.

검증 시 화면 상단의 소스 경로가 목표 예제와 일치하는지 확인한 뒤 실제 입력과 상태 전이를 확인한다. 자세한 실행·증거 수집은 [Lynx 검증 런북](../../skills/seed-verify-lynx-component/references/verification.md)을 따른다.

### 런타임 제약

PlayLynx는 bundle query를 `lynx.__globalProps`에 주입하지 않는다. 현재 직접 진입은 background thread에서 내부 API `lynx.getNativeApp().__pageUrl`을 읽는다. 이 API를 제공하지 않는 호스트에서는 홈에서 수동으로 예제를 선택해야 한다. 직접 진입을 검증할 때 홈이 보이는 것을 성공으로 처리하지 않는다.

호스트의 `URL` polyfill이 query를 해석하지 못하는 경우가 있어 fragment와 query를 분리한 뒤 `URLSearchParams`로 값을 읽는다. 이 경로를 바꾸면 실제 호스트에서 인코딩된 ID와 뒤로 가기를 확인한다.

## 타입 검사

```bash
bun run typecheck
```
