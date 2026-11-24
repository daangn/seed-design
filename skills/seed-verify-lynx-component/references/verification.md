# Lynx 검증 런북

`seed-component`의 Lynx 문서 분기와 `seed-verify-lynx-component`가 함께 쓰는 실행 절차다. 기본 native 검증은 `examples/lynx-spa` 개발 서버에서 문서 예제를 선택하거나 query로 직접 여는 것이다. docs build·정적 serve·manifest는 문서 인프라 자체를 바꾼 경우에만 쓴다([6절](#6-문서-인프라를-실제로-바꾼-경우만)).

온라인 실행 전에 [session 소유권과 Card 수명](concurrency/session-ownership.md)을 읽는다. URL은 미리 만들어 두되 page 열기와 화면 검증은 `scripts/lynx-card.ts`로 얻은 공유 잠금 안에서 한다. CLI·MCP·OS 딥 링크 중 어느 경로도 잠금과 소유권 확인을 건너뛰지 않는다.

## 1. 사전 점검과 서버 소유권

먼저 기록한다: 대상 컴포넌트, React·Lynx 예제 ID, SPA query ID `lynx/<component>/<scenario>`, 기대 결과, 필수·선택 환경.

새 컴포넌트·공개 package·Registry·생성물이 포함되거나 native 동작·bundle 결과를 새로 주장하거나 바꿨으면 버전을 따로 기록한다.

- 실행 host/app과 Engine 버전
- bundle 생성에 쓴 `@lynx-js/react`, React plugin, Rspeedy 버전
- Web preview를 검증하면 그 runtime 버전
- 변경 전 기준 결과: 변경본과 실행 명령 또는 시나리오를 연결한다. 기준 결과가 없으면 현재 결과와 합치지 않고 이유와 함께 `미확인`으로 남긴다.

서버·host app·기기·전역 overlay·캡처 자원마다 수명과 조작 소유자를 정한다. 단독 작업이면 현재 담당자가 소유자다.

- 기존 서버·사용자 session·사용자 변경을 임의로 종료하거나 되돌리지 않는다. 도구로 소유권이나 충돌을 확인할 수 없을 때만 소유자에게 묻는다.
- 서버를 재사용하면 프로세스의 작업 디렉터리와 실행 명령으로 현재 worktree의 `examples/lynx-spa`인지 확인한다.
- 빌드·생성처럼 파일을 쓰는 검증을 실행할 때만 실행 전후 작업 파일 상태를 비교한다. 새로 생긴 소스·문서 변경이나 예상 밖 생성물은 원인과 경로를 보고한다. 기존 사용자 변경을 덮어쓰거나 되돌려 정리하지 않는다.

host 소유자는 설치된 `portless`가 정확히 `0.15.3`인지 확인한 뒤 `examples/lynx-spa`에서 서버를 띄운다.

```bash
portless --version
cd examples/lynx-spa
portless run --name ette bun run dev
```

- 버전이 다르면 서버를 띄우지 않고 전역 지침의 `portless@0.15.3` 설치 안내를 전달한다.
- 개발 서버가 컴파일을 마쳤는지 확인하고, 로그에 찍힌 실제 `main.lynx.bundle` URL을 쓴다. 로그가 없으면 실행 프로세스의 주소와 bundle 응답을 확인한다.
- 실기기 URL에는 기기에서 접근할 수 있는 LAN 또는 배포 URL을 쓴다. `localhost`·`127.0.0.1`은 호스트 자신만 가리키므로 실기기 검증에 쓰지 않는다. 예외: Android 기기에 `adb reverse tcp:<port> tcp:<port>`로 서버 port를 연결했으면 `127.0.0.1:<port>`를 쓸 수 있다. iOS 시뮬레이터는 호스트의 `127.0.0.1`에 접근한다.
- lazy 예제가 열리려면 `ASSET_PREFIX`도 같은 조건을 만족해야 한다([`examples/lynx-spa/AGENTS.md`](../../../examples/lynx-spa/AGENTS.md)). host가 portless 도메인을 막으면 session 없는 오류 Card가 남아 [정리 절차](concurrency/session-ownership.md#5-성공실패-모두-정리-후-해제)의 `--confirmed-no-card` 확인이 필요해진다 → open 전에 URL과 `ASSET_PREFIX`를 맞춘다.

서버를 띄운 뒤 컴포넌트 원천을 고쳤으면, 예제 파일은 hot reload되지만 컴포넌트는 서버 시작 때 만든 `lib`로 남는다. 이전 구현과 새 예제가 섞인 화면을 변경 결과로 판정하지 않는다.

- `packages/lynx-react/src`를 고쳤으면 서버 소유자가 서버를 다시 시작하고, 로그의 `@seed-design/lynx-react` build `changes:`에 고친 파일이 있는지 확인한다.
- headless 패키지를 고쳤으면 서버를 멈춘 상태에서 `bun --filter <패키지 이름> build`를 실행한 뒤 다시 시작한다. 재시작만으로는 headless `lib`가 바뀌지 않는다. 서버를 띄운 채 lib를 따로 빌드하지 않는다 → 중간 빌드 실패가 host 종료로 이어질 수 있다.
- 고친 코드의 고유 식별자가 해당 패키지 `lib`와 서버가 주는 `main.lynx.bundle`에 있는지 `grep`으로, 바뀐 구조가 실제 tree에 있는지 snapshot으로 확인한 뒤 판정한다. port가 바뀌면 소유 Card를 새 URL의 `Page.reload`로 다시 연다.

## 2. 문서 예제 선택과 query 직접 진입

query 없이 bundle을 열고 `홈 → 문서 예제 → 컴포넌트 → 시나리오` 순서로 대상 예제를 선택한다. 선택한 장면의 사용자 결과·초기 상태·필요한 상호작용을 직접 확인한다.

직접 진입은 확인한 `main.lynx.bundle` URL에 `example` query를 붙인다. base URL이 `http://192.0.2.10:3000/main.lynx.bundle`, ID가 `lynx/accordion/preview`이면:

```text
http://192.0.2.10:3000/main.lynx.bundle?example=lynx%2Faccordion%2Fpreview
```

- 이미 query가 있으면 `&example=`을 쓰고, ID 값만 URL 인코딩한다. `#` fragment가 있으면 query는 fragment 앞에 둔다.
- 로딩이 끝나면 대상 시나리오와 화면의 `docs/examples/lynx/<component>/<scenario>.tsx` 경로를 확인한다. query가 적용되지 않아 홈이 계속 보이면 통과가 아니다.
- PlayLynx는 query를 `__globalProps`에 넣지 않는다. SPA는 `lynx.getNativeApp().__pageUrl`(native page URL)의 `example` query를 읽는다(`examples/lynx-spa/src/App.tsx`). 이 URL 해석을 바꿨으면 로컬 확인으로 끝내지 않고 실제 기기에서 이 절차를 반드시 실행한다.
- host가 bundle URL의 query를 지워 `__pageUrl`에 `example`이 남지 않으면 홈이 열린다. query URL로 `Page.reload`해도 화면이 그려지지 않을 수 있다 → 검증 동안만 `App.tsx`에서 `setRoute`를 전역에 노출하고(HMR로 반영된다) `evaluate`로 예제를 연 뒤, 끝나면 되돌린다.

SPA 진입·탐색 코드를 바꾼 경우에만 다음도 확인한다. 일반 컴포넌트 검증에서는 대상 시나리오의 변경 동작에 집중한다.

- query 없는 URL의 홈
- 잘못된 형식·존재하지 않는 ID에서 `예제를 찾을 수 없습니다.` 상태
- 정상 직접 진입 뒤 뒤로 가기: 예제 화면 → 해당 컴포넌트의 예제 목록 → 홈

## 3. `lynx://open?url=`와 session 식별

`agent-lynx open`에는 확인한 HTTP(S) bundle URL을 바로 넘길 수 있다. host가 `lynx://open?url=`를 요구하면 bundle URL 전체(경로와 전체 query 포함)를 URL 인코딩해 딥 링크를 만든다. query 값이나 bundle 경로만 인코딩하지 않는다.

```bash
BUNDLE_URL='http://192.0.2.10:3000/main.lynx.bundle?example=lynx%2Faccordion%2Fpreview'
ENCODED_BUNDLE_URL="$(node -p 'encodeURIComponent(process.argv[1])' "$BUNDLE_URL")"
DEEP_LINK="lynx://open?url=${ENCODED_BUNDLE_URL}"
```

위 코드는 URL만 만든다. 실제 열기는 [한 번 열기](concurrency/session-ownership.md#3-한-번-열기) 단계의 `lynx-card.ts open`으로 한다.

- client를 지정할 수 있는 PATH의 `agent-lynx`를 기본으로 쓰고, PATH에 없을 때만 접두사를 `bunx agent-lynx`로 바꾼다.
- OS URI opener를 잠금 없는 대체 경로로 쓰거나 구식 DevTool script를 직접 호출하지 않는다.
- console·screenshot·DOM/layout 명령의 현재 이름은 설치된 CLI의 `--help`로 확인한다.
- client 고정 → `acquire` → `open`으로 소유 session을 확정한 뒤 증거 수집으로 넘어간다. 새 client가 생긴다고 가정하지 않고, URL이나 최신 ID로 소유권을 추정하지 않는다. `open`이 session을 확정하지 못하면 새 Card를 열지 않고 `release`로 정리를 시도한 뒤 `환경 차단`으로 기록한다.

증거 수집:

- session 대상 명령은 `lynx-card.ts exec`로 실행해 소유 client·session을 붙인다.
- 주장에 필요한 만큼 DOM 또는 ReactLynx tree, 대상 node의 layout·computed style, console, screenshot을 수집한다. 증거에는 소유 session과 bundle URL을 함께 적는다.
- 화면 상태를 바꾸는 tap·drag는 조작 전후를 나눠 남긴다. transition·비동기 상태가 있으면 실제 입력으로 `initial → immediately after input → settled/final`을 수행한다.
- 같은 화면을 다시 검증할 때는 새로 open하지 않고 `Page.reload`를 쓴다.
- `tap`의 `ok: true`는 handler 실행의 증거가 아니다. 예제의 로그나 상태 변화로 전달을 확인한다. host가 CDP 탭을 handler에 전달하지 않으면 임시 예제가 `useEffect`에서 `globalThis.__probe = { open, hide, set, logs }`처럼 상태 setter와 로그 조회를 노출하게 하고 `exec -- evaluate '(__probe.open(), "ok")'`로 호출한다. CLI가 식을 감싸 실행하므로 `;`로 문장을 이으면 `SyntaxError: expecting ')'`가 난다 → 쉼표 식을 쓴다. 탭 전달 자체는 이 방법으로 확인할 수 없으므로 `환경 차단`으로 남긴다.

DevTool MCP는 연결돼 있고 현재 schema에서 도구 이름을 확인할 수 있을 때만 같은 증거를 보강하는 선택 경로다. MCP가 없어도 `agent-lynx` CLI 검증은 진행한다. CLI가 없다고 MCP 설치로 해결하지 않는다. 어느 경로로도 client/session을 식별하지 못하면 native 결과만 `환경 차단`이다.

## 4. 공개 소비 경로와 React 대응

다음 연결 중 이번 변경에 포함된 부분만 확인한다.

```text
package public export → SPA example import → lynx/<component>/<scenario> → main.lynx.bundle?example=…
```

- 공개 이름·예제 import·문서 예제 ID·SPA 목록·실행한 query가 같은 컴포넌트·시나리오를 가리켜야 한다.
- Registry·doc-gen·manifest·문서 index는 그 표면을 실제로 바꾼 경우에만 확인한다.
- 같은 사용자 결과를 주장하면 React와 Lynx의 문서 섹션·ID, asset·frame·초기 상태·보조 요소, 입력·중간·최종 상태, 화면 셸을 내용 단위로 비교한다.
- 판정은 `동일 지원`, `Lynx식 변환`, `미지원` 중 하나다. `미지원`은 실행하는 척하지 않고 문서의 제한과 대안을 확인한다.

### main-thread·background 산출물 비교

`'background only'` 지시어의 효과나 리팩터링 전후 산출물 차이를 주장할 때만 한다. 테스트 통과는 main-thread에서 본문이 빠졌는지 보여 주지 않는다.

1. lynx-spa는 `@seed-design/lynx-react`를 `lib/`로 소비한다. 전후 빌드마다 먼저 `bun --filter @seed-design/lynx-react build`(고친 headless 패키지가 있으면 그 패키지도)를 실행하고 `lib/`에 바뀐 코드가 들어갔는지 확인한다.
2. `DEBUG=rspeedy bun --filter lynx-spa build`는 `examples/lynx-spa/dist/.rspeedy/main/`에 `main-thread.js`와 `background.*.js`를 남긴다. 변경 전 파일을 복사해 두고, 두 파일을 `tr ';{}' '\n\n\n'`로 나눈 뒤 diff한다.
3. lynx-spa page가 import하지 않고 문서 예제에서만 쓰는 컴포넌트는 `examples/lynx-spa/dist/.rspeedy/lazy-bundle/______docs_examples_lynx_<component>_<example>.tsx/`에 들어간다. 저장소 루트에서 `grep -l -a 'seed-<component>__' -r examples/lynx-spa/dist/.rspeedy`로 대상 bundle을 먼저 찾는다. main bundle의 차이가 hash·debugmetadata뿐이라고 "변경 없음"으로 판정하지 않는다.

## 5. 시각·시간축 증거

### 시각적 동등성 판정

같은 사용자 결과를 목표로 하는 React·Lynx 예제는 같은 viewport·frame·기준 요소 위치·내용·초기 상태에서 비교한다.

- host/frame의 크기·여백과 내부 컴포넌트 배치를 따로 판정한다.
- Menu·Popover처럼 기준 요소에 붙는 UI는 요소와의 간격·정렬·겹침과 공간이 부족할 때의 정책을 비교한다.
- 대상 예제마다 개별 화면 증거를 남긴다. 전체 페이지 축소 캡처만으로 통과시키지 않는다.
- 위치·크기 주장은 같은 좌표계의 기준 요소·host/frame·대상 rect와, 참조에 맞는 허용 오차로 확인한다.
- asset은 종류·개수·크기·색상을 확인한다. multicolor·monochrome을 쓰면 tint 적용 여부를 구분하고, Web raster tint와 native tint는 별도 결과로 남긴다.

상호작용 예제:

- 실제 click·tap으로 `initial → immediately after input → settled/final`을 실행하고, 각 시점의 화면·layout·asset·disabled/loading 상태를 기록한다.
- 시간축과 경과 시간은 CSS transition·animation, layout 측정 뒤 크기 갱신, 지연 mount, 한 제스처로 pressed와 selected/checked가 함께 바뀌는 경우, loading 중간 상태가 있을 때만 추가한다. 정적 장면에는 임의의 중간 프레임을 요구하지 않는다.
- 눌림 상태는 `exec -- long-press <ref> --duration 3000`을 background로 실행하고 약 1.3초 뒤 screenshot으로 캡처한다. 놓은 뒤의 짧은 fade(예: 0.15s) 중간 프레임은 screenshot 명령 지연보다 짧아 잡히지 않는다 → `미확인`으로 보고한다.
- 다음 장면으로 넘어가기 전에 그 검사에서 연 menu·overlay를 닫고 기대 초기 상태를 확인한다. 상태 복원이 필요하면 소유한 같은 Card에서 탐색하거나 reload한다. 이 정리는 마지막 Card 제거 확인을 대신하지 않는다.

### 화면 녹화 판정

첫 진입 전환처럼 screenshot으로 잡을 수 없는 프레임은 iOS 시뮬레이터나 macOS PlayLynx 창 녹화로 판정한다. jsdom 테스트는 `render`가 effect까지 flush하므로 첫 프레임을 보여 주지 않는다.

- macOS PlayLynx 창은 창 ID를 찾아 `screencapture -x -V <초> -l<windowID> <file>.mov`로 녹화하고, 녹화 중 소유 session에 `Page.reload`를 보낸다. `-R` 좌표 녹화는 다중 모니터에서 다른 화면을 찍을 수 있다.
- iOS 시뮬레이터는 `xcrun simctl io booted recordVideo --codec h264 <file>.mov`로 녹화한다. 이 영상은 화면이 바뀔 때만 frame을 내는 가변 frame rate다. `ffmpeg -vf fps=…`로 뽑으면 첫 화면·전환 시점이 실제보다 앞당겨진다 → `ffmpeg -i <영상> -fps_mode passthrough -enc_time_base 1/600 <dir>/frame-%06d.jpg`로 원래 frame만 뽑고 각 frame의 PTS를 쓴다. 성능 측정의 시점 판정도 같다.
- 대상이 처음 보이는 frame부터 대상 ROI(예: Indicator 내부 20×12px)의 픽셀값을 읽고, 값이 바뀌지 않아야 하는 대조 ROI(예: 비선택 Item 내부)를 같은 frame에서 함께 읽는다. 대조 ROI 변동 폭을 넘는 중간값이 여러 frame에 걸쳐 한 방향으로 이어지면 전환, 그 폭 안의 차이는 압축 잡음으로 판정한다.
- `Page.reload` 진입처럼 host가 화면 전체를 어둡게 했다 밝히는 구간은 대조 ROI도 같은 폭으로 움직이므로 전환으로 보지 않는다.

브라우저·Web preview 결과는 native 결과가 아니다. preview, native bundle, 로컬 Lynx 런타임, 실기기는 별도 증거 행으로 기록한다. React 기준·asset·host/frame·초기 상태를 직접 확인하지 않았거나 상호작용 전이를 실행하지 않았으면 `시각적 동등성 통과`로 판정하지 않는다.

## 6. 문서 인프라를 실제로 바꾼 경우만

MDX 페이지, 코드 탭, QR, Web preview, docs build pipeline 자체를 바꾼 경우에만 이 절을 추가한다. Preview·코드 탭·QR·Explorer가 같은 논리 ID와 entry를 가리키는지 실제 문서에서 확인한다. 일반 Lynx 컴포넌트 변경의 기본 native 검증에는 docs build·manifest 생성·정적 serve를 선행 조건이나 최종 의무로 넣지 않는다.

### 빌드와 공유 출력

docs Lynx watcher(`bun docs:dev`가 띄우는 `dev:lynx-examples`)와 정적 빌드는 둘 다 `docs/public/__lynx__`를 갱신하므로 동시에 실행하지 않는다.

- 출력 소유자가 실행 중인 watcher를 확인하고 자신이 시작한 watcher만 중지한다.
- 다른 소유자의 watcher가 계속 출력을 갱신하면 인계·중지를 조율하기 전까지 정적 빌드를 `환경 차단`으로 남긴다. 출력을 지우거나 사용자 프로세스를 종료해 해결하지 않는다.

저장소 루트에서 바꾼 경로에 맞는 명령 하나를 고른다. 모두 연달아 실행하지 않는다. 실제 지원 명령은 `docs/package.json`에서 확인한다.

- 정적 문서 페이지·host·docs pipeline → `bun docs:build` (내부에서 production `build:lynx-examples`도 실행한다)
- 문서용 production 예제 bundle·manifest만 → `bun --filter @seed-design/docs build:lynx-examples`
- 문서용 development 예제 bundle만 → `bun --filter @seed-design/docs build:lynx-examples:development`

문서 예제·도구의 타입·회귀는 [공통 자동 검증](../../seed-component/references/verification-checklist.md#자동-검증)에 따라 `bun docs:test` 등 해당 경로의 기존 명령으로 확인한다. bundle 빌드 성공을 타입 검사나 실제 화면 확인으로 대신하지 않는다.

### 서빙과 소비 경로

1. 서버 소유자가 1절의 `portless` 버전·소유권 조건을 확인한다.
2. 저장소 루트에서 필요한 하나만 띄운다: 정적 문서는 `portless run --name ette bunx serve docs/out`, 문서 페이지 없이 bundle만 볼 때는 `portless run --name ette bunx serve docs/public`. 기존 `ette` 서버를 강제로 교체하지 않는다. `serve`는 `portless`가 넘긴 `PORT`를 쓰므로 실제 주소는 서버 로그에서 확인한다.
3. `docs/public/__lynx__/manifest.json`에서 대상 논리 ID의 `examples[id].lynx`·`web` 값을 읽어 URL을 만든다. bundle 이름이나 해시를 추측하지 않는다. 같은 컴포넌트의 예제는 bundle 하나를 공유하므로 native URL에는 `example` query로 논리 ID를 붙인다(예: `…/badge.<hash>.lynx.bundle?example=lynx%2Fbadge%2Fpreview&fullscreen=true`). query가 없거나 host가 전달하지 않으면 예제 목록이 나온다. `/__lynx__/…` 경로를 유지하려면 bundle 서빙 루트는 `docs/public`이어야 한다. 중간 출력인 `docs/.cache/lynx-rspeedy-dev-dist`는 서빙하지 않는다.
4. 정적 문서는 `docs/out`의 실제 HTML·bundle로 확인한다. `docs/public`의 bundle만 갱신했다고 이전 `docs/out`이 갱신됐다고 가정하지 않는다 → `bun docs:build`를 다시 실행한다. 변경본과 실제 로드한 bundle을 대조하고, native 열기는 3절의 소유권 절차를 따른다.
5. QR 원문이 직접 접근 가능한 HTTP(S) native bundle URL인지, Explorer 링크가 그 전체 URL을 인코딩한 `lynx://open?url=`인지 확인한다. Web preview는 실제 `LynxComponentExample`에서 확인한다.
6. 자동 높이·고정 높이·viewport 단위 처리를 바꿨으면 `docs/components/lynx-example/preview-lifecycle.test.ts`의 `transformVH` 계약과 실제 크기·잘림을 함께 확인한다.

## 7. 상태·정리·보고

각 시나리오·환경에 상태를 하나만 준다.

- `통과`: 해당 환경에서 기대 결과를 직접 확인함
- `실패`: 기대 결과와 실제 결과의 차이를 재현함
- `환경 차단`: 도구, 버전, 주소, 네트워크 때문에 확인을 시작할 수 없음
- `미확인`: 확인할 수 있었지만 아직 실행하지 않음

생성물·공개 소비 경로와 실행 환경은 따로 기록한다. 시작 전에 정한 필수 항목이 모두 `통과`면 `완료`, 하나라도 `실패`면 `실패`, `환경 차단`이나 `미확인`이 있으면 `미완료`다. 선택 환경의 `환경 차단`·`미확인`은 전체를 막지 않지만 보고에 남긴다.

보고에 넣을 것:

- 대상 컴포넌트·시나리오, React↔Lynx 대응과 공개 소비 경로
- 실행한 명령, 실제 bundle URL과 query, client·session
- 환경별 기대·실제 결과, screenshot·console·layout 증거 경로(쓴 경우)
- 재현 단계·수정 범위, 미검증 환경과 정확한 차단 사유
- 소유 session 제거 확인과 잠금 해제 여부. 미완료면 client·session·잠금 경로·오류

정리:

- 직접 시작한 서버·브라우저는 그 수명 소유자가 정리한다. 기존 서버·host app·기기 session은 종료하지 않는다.
- Card는 성공·실패와 관계없이 [정리 후 해제](concurrency/session-ownership.md#5-성공실패-모두-정리-후-해제)를 끝낸다.
- 증거로 참조하지 않는 임시 파일만 지운다.
