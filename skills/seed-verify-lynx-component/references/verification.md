# Lynx 검증 런북

이 문서는 `seed-write-lynx-component-docs`와 `seed-verify-lynx-component`가 공유하는 실행 절차다. 검증 명령, 정적 서빙, bundle URL 조립, Lynx DevTool MCP 증거 수집은 이 문서만 수정한다.

## 1. 사전 점검

검증 전에 다음을 기록한다.

- `git status --short`와 현재 branch
- 대상 컴포넌트, 문서 URL, React·Lynx 예제 ID
- docs examples와 host app의 `@lynx-js/react`, React plugin, Rspeedy 버전
- 변경 전 기준 빌드 결과. 기준 빌드를 확보하지 못하면 `미확인`으로 남긴다.
- 필수 환경과 선택 환경
- 생성물 검증과 실행 환경 검증을 구분한 검증표

검증 스킬은 문서·컴포넌트 소스를 수정하지 않는다. 빌드가 만드는 ignored 산출물, 직접 시작한 서버, 검증 중인 런타임 상태 변경은 허용한다. 실행 전후 `git status --short`를 비교하고 새 tracked 변경이 생기면 원인을 보고한다. 사용자 변경이나 기존 서버를 되돌리거나 종료하지 않는다.

검증은 다음 순서로 값싼 확인에서 비싼 확인으로 넓힌다.

1. React↔Lynx 시나리오와 공개 API 대응
2. Registry, 문서 index, entry, manifest, bundle 연결
3. 정적 문서 또는 bundle의 브라우저 확인
4. 필요한 경우 시간축 확인
5. native bundle의 로컬 Lynx 런타임 또는 실제 host app 확인
6. 변경과 관련된 테스트 및 저장소 공통 검증

## 2. 정적 문서와 bundle 서빙

문서 전체를 확인할 때는 `next dev`보다 정적 빌드와 `npx serve`를 사용한다.

```bash
bun docs:build
npx serve docs/out --listen 4173
```

문서 페이지 없이 예제 bundle만 확인할 때는 다음을 사용한다.

```bash
bun --filter @seed-design/docs build:lynx-examples:development
npx serve docs/public --listen 4174
```

`build:lynx-examples:development`의 중간 출력은 `docs/.next/lynx-rspeedy-dev-dist`에 생기고, 실행에 사용할 manifest와 bundle은 `docs/public/__lynx__`로 복사된다. 따라서 `docs/.next/lynx-rspeedy-dev-dist` 또는 `docs/public/__lynx__`를 임의의 서빙 루트로 사용하지 않는다. manifest의 `/__lynx__/...` 경로를 유지하려면 `docs/public`을 서빙 루트로 사용한다.

생성된 manifest는 다음 위치에서 읽는다.

```text
docs/public/__lynx__/manifest.json
```

대상 예제 ID의 `lynx` 값을 읽어 bundle URL을 만든다. URL을 파일명으로 추측하거나 해시를 직접 조립하지 않는다.

```bash
BUNDLE_PATH="$(node -e '
const fs = require("node:fs");
const id = process.argv[1];
const manifest = JSON.parse(fs.readFileSync("docs/public/__lynx__/manifest.json", "utf8"));
const path = manifest.examples[id]?.lynx;
if (!path) throw new Error(`manifest에 예제가 없습니다: ${id}`);
console.log(path);
' 'lynx/<component>/<scenario>')"
BUNDLE_URL="http://127.0.0.1:4174${BUNDLE_PATH}"
```

`docs/out`을 서빙하는 경우에는 실제 `docs/out` 파일과 현재 origin에 맞춰 URL을 만든다. 실기기에서는 `127.0.0.1`이나 `localhost` 대신 기기에서 접근할 수 있는 LAN 또는 배포 주소를 사용한다.

원천이나 생성물이 바뀌면 bundle과 정적 문서를 다시 만들고 서버를 다시 시작한다. 실행 중인 서버가 새 파일을 반영한다고 가정하지 않는다. 브라우저는 새 세션이나 빌드 식별용 쿼리로 캐시를 피한다.

## 3. 브라우저 미리보기 확인

정적 문서를 서빙한 뒤 실제 `LynxComponentExample`에서 확인한다. 독립 HTML, 임시 Vite 앱, 임시 React 페이지로 옮겨 확인하지 않는다.

1. `docs/out`에서 대상 `.html`의 실제 경로를 찾는다.
2. 예제의 로딩이 끝날 때까지 기다린다.
3. 미리보기, 코드 탭, QR, Explorer 버튼이 같은 논리 ID와 entry를 가리키는지 확인한다.
4. `lynx-view`와 `lynx-view.shadowRoot` 안의 대상 root를 찾는다.
5. 텍스트, class, `getBoundingClientRect()`, computed style, clipping, overflow를 기록한다.
6. Registry 예제는 `@/components/ui/<name>`, package-only 예제는 `@seed-design/lynx-react` 공개 export를 사용하는지 확인한다.
7. QR 원문은 직접 접근 가능한 `.lynx.bundle` HTTP(S) URL인지, Explorer 버튼만 `lynx://open?url=`을 사용하는지 확인한다.

BottomSheet처럼 viewport 전체를 기준으로 배치되는 오버레이는 `LynxComponentExample`에 충분한 고정 `height`가 있는지 확인한다. Backdrop·Positioner가 preview 전체를 채우고 Content가 카드 밖으로 넘치지 않는지, 작은 폭에서 잘림이나 가로 스크롤이 없는지 확인한다. preview를 맞추려고 배포 컴포넌트의 스타일을 바꾸지 않는다.

`vw`·`vh`를 사용하는 예제는 preview 초기화 시점의 `transformVW`·`transformVH` 설정을 확인한다. 고정 높이 preview는 두 단위를, 자동 높이 preview는 `transformVW`만 사용해야 한다. `height: auto`에 `transformVH`를 함께 켜서 높이가 `0px`이 되는 상황을 만들지 않는다.

브라우저와 native 결과가 다르면 먼저 다음을 구분한다.

- 문서 preview에서만 실패: preview runtime 또는 web 제한
- native에서도 실패: 컴포넌트, bundle, CSS parser, Engine 또는 host app
- 아이콘 노드가 없거나 크기가 0: entry, 자산, layout
- 아이콘은 존재하지만 웹에서만 색상이 다름: `tint-color` 또는 native 전용 스타일
- `var(...)` shorthand가 `0px`: CSS 변수 해석과 대응 longhand

브라우저 결과만으로 native 통과를 판정하지 않는다.

## 4. `lynx://open?url=` 실행

native bundle을 HTTP(S)로 서빙한 다음 bundle URL 전체를 URL 인코딩해 딥 링크를 만든다. bundle 경로만 인코딩하지 않는다.

```bash
ENCODED_BUNDLE_URL="$(node -p 'encodeURIComponent(process.argv[1])' "$BUNDLE_URL")"
open "lynx://open?url=${ENCODED_BUNDLE_URL}"
```

개발 환경에 URI opener가 없으면 동일한 URI를 `lynx-devtool`의 `open` 명령에 전달한다.

```bash
node <path-to-lynx-devtool-skill>/scripts/index.mjs open "lynx://open?url=${ENCODED_BUNDLE_URL}"
```

딥 링크를 실행한 뒤 대상 bundle을 연 런타임이 실제로 생성되었는지 확인한다. client나 session이 없거나 bundle URL을 식별할 수 없으면 재시도를 반복하지 않고 `환경 차단`으로 기록한다.

## 5. Lynx DevTool MCP 증거 수집

검증 전에 `lynx-devtool` 스킬과 현재 MCP 서버 연결을 확인한다. MCP 서버가 없으면 검증 중에 설치하지 않고 `환경 차단`으로 보고한다. 현재 MCP schema에 노출된 도구 이름을 확인하고 이름을 추측하지 않는다. Elements 도구는 `DOM_*`, `CSS_*` 계열로 제공되며 console, sources, interaction, screenshot 도구가 별도로 제공될 수 있다.

### MCP 순서

1. client 목록 도구로 연결된 Lynx client를 조회한다.
2. bundle을 연 앱의 package/app 식별자와 새로 생성된 client를 확인한다.
3. 해당 client의 session 목록을 조회한다.
4. session의 URL 또는 페이지 식별자가 대상 bundle과 일치하는지 확인한다. 최근 session이라는 이유만으로 선택하지 않는다.
5. Elements 도구에서 `DOM_enable({ useCompression: false })`를 호출한 뒤 `DOM_getDocumentWithBoxModel()`로 root와 node별 layout 정보를 얻는다. 도구가 CDP bridge 형태라면 각각 `DOM.enable`과 `DOM.getDocumentWithBoxModel`을 호출한다.
6. 대상 node의 ID를 얻은 뒤 `CSS_getComputedStyleForNode({ nodeId })`로 computed style을 수집한다. CDP bridge에서는 `CSS.getComputedStyleForNode`를 사용한다.
7. 대상 시나리오를 조작하고 console 도구, screenshot 도구, 필요하면 ReactLynx tree·component 도구로 결과를 기록한다.
8. `Page_reload({ ignoreCache: true })` 또는 CDP `Page.reload` 후 초기 상태를 다시 수집한다.

MCP에서 수집할 최소 증거는 client 식별자, session 식별자, bundle URL, 실행 환경·버전, DOM 또는 ReactLynx tree, layout metric, computed style, console 결과, screenshot 경로다. Elements 도구는 tree를 수정하지 않지만 tap·drag 같은 interaction은 런타임 상태를 바꿀 수 있으므로 조작 전후 상태를 별도로 기록한다.

### CLI 대체 경로

MCP를 사용할 수 없고 CLI로만 확인한 경우, MCP 통과로 표현하지 않고 CLI 확인으로 기록한다. `<path-to-lynx-devtool-skill>`은 실제 `lynx-devtool` 스킬 디렉터리로 바꾼다.

```bash
DEVTOOL="<path-to-lynx-devtool-skill>/scripts/index.mjs"
node "$DEVTOOL" list-clients
node "$DEVTOOL" list-sessions --client <client-id>
node "$DEVTOOL" cdp --client <client-id> --session <session-id> -m DOM.enable '{"useCompression":false}'
node "$DEVTOOL" cdp --client <client-id> --session <session-id> -m DOM.getDocumentWithBoxModel
node "$DEVTOOL" cdp --client <client-id> --session <session-id> -m CSS.getComputedStyleForNode '{"nodeId":<node-id>}'
node "$DEVTOOL" get-console --client <client-id> --session <session-id> --level error,warning
node "$DEVTOOL" take-screenshot --client <client-id> --session <session-id> --output /tmp/seed-lynx-<scenario>.jpeg
node "$DEVTOOL" cdp --client <client-id> --session <session-id> -m Page.reload '{"ignoreCache":true}'
```

CDP 명령을 보내기 전에는 `lynx-devtool`의 지원 CDP method 문서를 확인한다. `list-clients`가 빈 배열이면 대상 앱과 DevTool 연결 상태를 확인하고, 다시 조회해도 client가 없으면 환경 차단으로 끝낸다.

## 6. 시간축 검증

다음 조건은 시간축 검증이 필요하다.

- CSS transition 또는 animation
- layout 측정 뒤 height·width 갱신
- viewport 진입 뒤 지연 마운트
- pressed 상태와 selected·checked 상태가 한 제스처에서 함께 바뀜

이 경우 초기 렌더링, 상태 반영 중간, 최종 안정 상태, 첫 전환과 release 종료를 확인한다. 영상이나 연속 프레임은 `analyze-video-frames` 기준으로 분석하고 프레임 번호와 경과 시간을 기록한다.

처음부터 열린·선택된 상태나 `useIconColor`·`tint-color`만 있는 정적 시나리오는 중간 프레임을 임의로 요구하지 않는다. 초기 프레임과 안정 상태를 확인하고, 실제 transition·animation이 연결된 경우에만 전체 시간축을 적용한다.

## 7. 상태와 완료 판정

각 시나리오와 환경에 다음 상태 중 하나만 부여한다.

| 상태 | 의미 |
| --- | --- |
| 통과 | 해당 환경에서 기대 결과를 직접 확인함 |
| 실패 | 기대 결과와 실제 결과의 차이를 재현함 |
| 환경 차단 | 도구, 버전, 주소, 네트워크 때문에 확인을 시작할 수 없음 |
| 미확인 | 확인할 수 있었지만 아직 실행하지 않음 |

브라우저, native bundle 생성물, 로컬 Lynx 런타임, 실제 기기는 별도 행으로 기록한다. 생성물 연결 검증도 실행 환경과 별도 표로 둔다.

검증 시작 전에 필수 환경을 고정한다.

- 필수 항목이 모두 `통과`면 전체 `완료`
- 필수 항목에 `실패`가 있으면 전체 `실패`
- 필수 항목에 `환경 차단` 또는 `미확인`이 있으면 전체 `미완료`
- 선택 환경의 `환경 차단` 또는 `미확인`은 전체를 막지 않지만 보고서에 남긴다.

## 8. 정리와 보고

검증이 끝나면 직접 시작한 `npx serve`, 브라우저 세션, DevTool 세션, 임시 증거 파일을 정리한다. `git status --short`로 새 tracked 파일이나 예상하지 않은 변경이 없는지 확인한다.

최종 보고는 다음 형식을 사용한다.

```markdown
## 결과

전체: 완료 | 미완료 | 실패

| 구분 | 시나리오 | 결과 | 확인 내용 | 증거 |
|---|---|---|---|---|
| 생성물 | 기본형 | 통과 | entry, manifest, web/native bundle | 경로 |
| 브라우저 | 기본형 | 통과 | text, layout, interaction | URL, screenshot |
| 로컬 Lynx 런타임 | 기본형 | 통과 | DOM, computed style, console | client, session, screenshot |
| 실제 기기 | 기본형 | 환경 차단 | LAN 주소 없음 | 오류 지문 |

## 발견 사항

- 환경, 재현 단계, 기대 결과, 실제 결과, 증거, 수정 범위

## 미검증·제약

- 확인하지 못한 환경과 정확한 이유
```
