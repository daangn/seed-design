# Lynx 검증 런북

이 문서는 `seed-write-lynx-component-docs`와 `seed-verify-lynx-component`가 공유하는 실행 절차다. 기본 native 검증은 `examples/lynx-spa` 개발 서버에서 실제 문서 예제를 선택하거나 query로 직접 여는 경로다. docs build·정적 serve·manifest는 문서 인프라 자체를 바꾼 경우에만 쓴다.

## 1. 사전 점검과 서버 소유권

대상 컴포넌트, React·Lynx 예제 ID, SPA query ID `lynx/<component>/<scenario>`, 기대 결과와 필수·선택 환경을 먼저 기록한다. native 동작·bundle 결과를 새로 주장하거나 바꿨다면 런타임 버전과 변경 전 기준 결과도 별도 행으로 기록한다. 기준 결과가 없으면 현재 결과와 합치지 않고 `미확인`으로 남긴다.

서버·host app·기기·전역 overlay·캡처 자원마다 수명과 조작 소유자를 정한다. 단독 작업에서는 현재 담당자가 소유한다. 기존 서버·사용자 session·사용자 변경을 임의로 종료·되돌리지 않는다. 서버를 재사용할 때는 프로세스의 작업 디렉터리와 실행 명령으로 현재 worktree의 `examples/lynx-spa`인지 확인한다. 도구로 소유권이나 충돌을 확인할 수 없을 때만 해당 소유자에게 문의한다.

host 소유자는 먼저 설치된 `portless`가 정확히 `0.15.3`인지 확인한 뒤 다음 명령을 실행한다. 두 번째 명령의 cwd는 `examples/lynx-spa`다.

```bash
portless --version
cd examples/lynx-spa
portless run --name ette bun run dev
```

버전이 다르면 서버를 실행하지 않고 전역 지침의 `portless@0.15.3` 설치 안내를 전달한다. 개발 서버가 컴파일을 마쳤는지 확인하고 로그의 실제 `main.lynx.bundle` URL을 사용한다. 로그가 없으면 실행 프로세스의 주소와 bundle 응답을 확인한다. `localhost`를 실기기 URL로 사용하지 않는다.

## 2. 문서 예제 선택과 query 직접 진입

query 없이 bundle을 열어 `홈 → 문서 예제 → 컴포넌트 → 시나리오` 순서로 대상 문서 예제를 선택한다. 선택한 장면의 사용자 결과·초기 상태·필요한 상호작용을 직접 확인한다.

PlayLynx는 query를 `__globalProps`에 넣지 않는다. native page URL을 읽어 예제를 고르는 구현을 바꿨다면 로컬 확인만으로 끝내지 말고 실제 기기에서 이 절차를 필수로 실행한다.

직접 진입은 확인한 `main.lynx.bundle` URL에 예제 ID를 붙여 수행한다. 예를 들어 base URL이 `http://192.0.2.10:3000/main.lynx.bundle`이고 ID가 `lynx/accordion/preview`이면 다음 URL이 대상이다.

```text
http://192.0.2.10:3000/main.lynx.bundle?example=lynx%2Faccordion%2Fpreview
```

이미 query가 있는 URL은 `&example=`을 사용하며, ID 값만 URL 인코딩한다. `#` fragment가 있다면 query는 fragment 앞에 붙인다. 직접 URL을 연 뒤 로딩이 끝나면 대상 시나리오와 화면의 `docs/examples/lynx/<component>/<scenario>.tsx` 경로를 확인한다. query가 적용되지 않아 홈이 계속 보이면 통과가 아니다.

SPA 진입·탐색 코드를 바꾼 경우에는 query 없는 URL의 홈, 잘못된 형식·존재하지 않는 ID의 `예제를 찾을 수 없습니다.` 상태, 정상 직접 진입 후 `컴포넌트 목록 → 홈` 뒤로 가기를 함께 확인한다. 일반 컴포넌트 검증에서는 대상 시나리오의 변경 동작에 집중한다.

실기기에서는 기기에서 접근할 수 있는 LAN 또는 배포 URL을 base URL로 사용한다. `127.0.0.1`과 `localhost`는 호스트 자신만 가리키므로 실기기 검증 URL로 쓰지 않는다.

## 3. `lynx://open?url=`와 session 식별

native bundle URL 전체(경로와 `example` query 포함)를 URL 인코딩해 딥 링크를 만든다. query 값이나 bundle 경로만 인코딩하면 안 된다.

```bash
BUNDLE_URL='http://192.0.2.10:3000/main.lynx.bundle?example=lynx%2Faccordion%2Fpreview'
ENCODED_BUNDLE_URL="$(node -p 'encodeURIComponent(process.argv[1])' "$BUNDLE_URL")"
DEEP_LINK="lynx://open?url=${ENCODED_BUNDLE_URL}"
open "$DEEP_LINK"
```

URI opener를 사용할 수 없으면 PATH의 `agent-lynx`를 사용하고, PATH에 없을 때만 `bunx agent-lynx`를 사용한다. 구식 DevTool script를 직접 호출하지 않는다.

```bash
agent-lynx --help
agent-lynx list-clients
agent-lynx list-sessions --client <client-id>
agent-lynx open "$DEEP_LINK" --client <client-id>
# PATH에 agent-lynx가 없을 때만:
bunx agent-lynx --help
bunx agent-lynx list-clients
bunx agent-lynx list-sessions --client <client-id>
bunx agent-lynx open "$DEEP_LINK" --client <client-id>
```

설치된 CLI의 `--help`로 console·screenshot·DOM/layout 명령의 현재 이름을 확인한다. 열기 전 client·session 목록과 bundle URL을 기록하고, 연 뒤 다시 조회한다. bundle 경로와 `example` 값이 일치하는 session을 선택한다. PlayLynx가 덧붙인 `#__playlynx_http_context=…`는 식별 비교에서 제외하며, 최근 항목이라는 이유만으로 선택하지 않는다. 대상 URL을 식별할 수 없으면 연결 상태와 host의 열기 결과를 확인하고 해결되지 않은 원인을 `환경 차단`으로 기록한다.

선택한 session에서 DOM 또는 ReactLynx tree, 대상 node의 layout·computed style, console, screenshot을 필요한 주장에 맞춰 수집한다. 화면 상태를 바꾸는 tap·drag는 조작 전후를 분리해 남기고, transition·비동기 상태가 있으면 `initial → immediately after input → settled/final`을 실제 입력으로 수행한다. 새 session 및 해당 bundle URL을 포함해 증거를 기록한다.

DevTool MCP는 연결되어 있고 현재 schema의 도구 이름을 확인할 수 있을 때만 같은 증거를 보강하는 선택 경로다. MCP 부재는 `agent-lynx` CLI 검증을 막지 않으며, CLI 부재를 MCP 설치로 해결하려 하지 않는다. 어느 경로도 client/session을 식별하지 못하면 native 결과만 `환경 차단`이다.

## 4. 공개 소비 경로와 React 대응

다음 연결 중 이번 변경에 포함된 부분만 확인한다.

```text
package public export → SPA example import → lynx/<component>/<scenario> → main.lynx.bundle?example=…
```

공개 이름·예제 import·문서 예제 ID·SPA 목록·실행한 query가 같은 컴포넌트·시나리오를 가리켜야 한다. Registry·doc-gen·manifest·문서 index는 그 표면을 실제로 바꾼 경우에만 추가한다.

같은 사용자 결과를 주장하면 React와 Lynx의 문서 섹션·ID, asset·frame·초기 상태·보조 요소, 입력·중간·최종 상태, 화면 셸을 내용 단위로 비교한다. 판정은 `동일 지원`, `Lynx식 변환`, `미지원` 중 하나로 기록한다. `미지원`은 실행하는 척하지 않고 제한과 대안을 문서에서 확인한다.

## 5. 시각·시간축 증거

### 시각적 동등성 판정

같은 사용자 결과를 목표로 하는 React·Lynx 예제는 같은 viewport·frame·기준 요소 위치·내용·초기 상태에서 비교한다. host/frame의 크기·여백과 내부 컴포넌트 배치를 별도로 판정한다. Menu·Popover 같은 기준 요소 부착 UI는 요소와의 간격·정렬·겹침·공간 부족 시 정책을 비교한다.

상호작용 예제는 실제 click·tap으로 `initial → immediately after input → settled/final`을 실행하고 각 시점의 화면·layout·asset·disabled/loading 상태를 기록한다. CSS transition·animation, layout 측정 뒤 크기 갱신, 지연 mount, 한 제스처의 pressed와 selected/checked 동시 변경, loading 중간 상태가 있을 때만 시간축과 경과 시간을 추가한다. 정적 장면에는 임의의 중간 프레임을 요구하지 않는다.

브라우저나 Web preview 결과는 native 결과가 아니다. preview·native bundle·로컬 Lynx 런타임·실기기는 별도 증거 행으로 기록한다. React 기준·asset·host/frame·초기 상태를 직접 확인하지 않았거나 상호작용 전이를 실행하지 않았다면 `시각적 동등성 통과`로 판정하지 않는다.

## 6. 문서 인프라를 실제로 바꾼 경우만

MDX 페이지, 코드 탭, QR, Web preview 또는 docs build pipeline 자체를 변경한 경우에만 해당 문서 인프라를 검증한다. 이 경우 문서 예제의 실제 논리 ID·entry, Preview·코드 탭·QR·Explorer가 같은 대상을 가리키는지 확인하고, 필요하다면 저장소에 이미 있는 docs build·serve 절차를 사용한다.

이 절차는 docs 인프라 변경의 증거일 뿐이다. 일반적인 Lynx 컴포넌트 변경의 기본 native 검증에 docs build·manifest 생성·정적 serve를 선행하거나 최종 의무로 추가하지 않는다.

## 7. 상태·정리·보고

| 상태 | 의미 |
| --- | --- |
| 통과 | 해당 환경에서 기대 결과를 직접 확인함 |
| 실패 | 기대 결과와 실제 결과의 차이를 재현함 |
| 환경 차단 | 도구, 버전, 주소, 네트워크 때문에 확인을 시작할 수 없음 |
| 미확인 | 확인할 수 있었지만 아직 실행하지 않음 |

생성물·공개 소비 경로와 실행 환경은 별도 표로 둔다. 시작 전에 정한 필수 항목이 모두 `통과`면 `완료`, 하나라도 `실패`면 `실패`, `환경 차단` 또는 `미확인`이 있으면 `미완료`다. 선택 환경의 `환경 차단`·`미확인`은 전체를 막지 않지만 남긴다.

보고에는 대상 컴포넌트·시나리오, React↔Lynx 대응과 공개 소비 경로, 실행한 명령, 실제 bundle URL과 query, client·session, 환경별 기대·실제 결과, screenshot·console·layout 증거 경로(사용한 경우), 재현 단계·수정 범위, 미검증 환경과 정확한 차단 사유를 포함한다.

직접 시작한 서버·브라우저·DevTool session만 그 수명 소유자가 정리한다. 증거로 참조하지 않는 임시 파일만 정리하고, 기존 서버·host app·기기 session은 종료하지 않는다.
