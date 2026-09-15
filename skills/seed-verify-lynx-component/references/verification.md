# Lynx 검증 런북

이 문서는 `seed-write-lynx-component-docs`와 `seed-verify-lynx-component`가 공유하는 실행 절차다. 기본 native 검증은 `examples/lynx-spa` 개발 서버에서 실제 문서 예제를 선택하거나 query로 직접 여는 경로다. docs build·정적 serve·manifest는 문서 인프라 자체를 바꾼 경우에만 쓴다.

온라인 실행 전 [session 소유권과 Card 수명](concurrency/session-ownership.md)을 읽는다. URL은 미리 준비하되 실제 page 열기·화면 검증은 공유 lifecycle lock 안에서 수행한다. 같은 Card 재검증과 종료는 해당 절차를 따른다. CLI·MCP·OS 딥 링크 중 어느 경로도 잠금과 소유권 확인을 생략하지 않는다.

## 1. 사전 점검과 서버 소유권

대상 컴포넌트, React·Lynx 예제 ID, SPA query ID `lynx/<component>/<scenario>`, 기대 결과와 필수·선택 환경을 먼저 기록한다. 새 컴포넌트·공개 package·Registry·생성물이 포함되거나 native 동작·bundle 결과를 새로 주장하거나 바꿨다면 실행 host/app·Engine 버전과 bundle 생성에 사용한 `@lynx-js/react`·React plugin·Rspeedy 버전을 구분해 기록한다. Web preview를 검증할 때는 해당 runtime 버전도 남긴다. 변경 전 기준 결과에는 변경본과 실행 명령 또는 시나리오를 연결하고, 기준 결과가 없으면 현재 결과와 합치지 않고 이유와 함께 `미확인`으로 남긴다.

서버·host app·기기·전역 overlay·캡처 자원마다 수명과 조작 소유자를 정한다. 단독 작업에서는 현재 담당자가 소유한다. 기존 서버·사용자 session·사용자 변경을 임의로 종료·되돌리지 않는다. 서버를 재사용할 때는 프로세스의 작업 디렉터리와 실행 명령으로 현재 worktree의 `examples/lynx-spa`인지 확인한다. 도구로 소유권이나 충돌을 확인할 수 없을 때만 해당 소유자에게 문의한다.

빌드·생성처럼 파일을 쓰는 검증을 실행할 때만 실행 전후 작업 파일 상태를 비교한다. 새로 생긴 소스·문서 변경이나 예상 밖 생성물은 원인과 경로를 보고하며, 기존 사용자 변경을 덮어쓰거나 되돌려 정리하지 않는다.

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

`agent-lynx open`에는 확인한 HTTP(S) bundle URL을 직접 전달할 수 있다. host가 `lynx://open?url=`를 요구하면 native bundle URL 전체를 URL 인코딩해 딥 링크를 만든다. 경로와 전체 query를 포함하며 query 값이나 bundle 경로만 인코딩하면 안 된다.

```bash
BUNDLE_URL='http://192.0.2.10:3000/main.lynx.bundle?example=lynx%2Faccordion%2Fpreview'
ENCODED_BUNDLE_URL="$(node -p 'encodeURIComponent(process.argv[1])' "$BUNDLE_URL")"
DEEP_LINK="lynx://open?url=${ENCODED_BUNDLE_URL}"
```

위 코드는 URL만 만든다. 실제 열기는 [잠금 안에서 한 번 열고 소유 session 식별](concurrency/session-ownership.md#3-잠금-안에서-한-번-열고-소유-session-식별) 단계에서 수행한다. client를 지정할 수 있는 PATH의 `agent-lynx`를 기본으로 사용하고, PATH에 없을 때만 접두사를 `bunx agent-lynx`로 바꾼다. OS URI opener를 잠금 없는 대체 경로로 쓰거나 구식 DevTool script를 직접 호출하지 않는다.


설치된 CLI의 `--help`로 console·screenshot·DOM/layout 명령의 현재 이름을 확인한다. 생성 요청 client 고정·잠금 획득·baseline 저장·한 번의 open·생성된 client/session 쌍 점유를 순서대로 마친 뒤 아래 증거 수집으로 진행한다. 새 client가 생긴다고 가정하지 않으며, URL이나 최신 ID만으로 소유권을 추정하지 않는다. 식별이 모호하면 새 Card를 열지 않고 잠금과 식별 자료를 유지한 채 `환경 차단`으로 기록한다.

고정한 client·owned session을 모든 session 대상 명령에 명시한다. DOM 또는 ReactLynx tree, 대상 node의 layout·computed style, console, screenshot을 필요한 주장에 맞춰 수집한다. 화면 상태를 바꾸는 tap·drag는 조작 전후를 분리해 남기고, transition·비동기 상태가 있으면 `initial → immediately after input → settled/final`을 실제 입력으로 수행한다. 소유 session 및 해당 bundle URL을 포함해 증거를 기록한다. 같은 화면의 재검증은 새 open이 아니라 `Page.reload`로 수행한다.

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

시각적 동등성을 주장할 때는 대상 예제의 개별 화면 증거를 남긴다. 위치·크기 주장은 같은 좌표계의 기준 요소·host/frame·대상 rect와 참조에 맞는 허용 오차로 확인한다. asset은 종류·개수·크기·색상을 확인하고, multicolor·monochrome을 쓰면 tint 적용 여부를 구분한다. Web raster tint와 native tint는 별도 결과로 남긴다. 전체 페이지 축소 캡처만으로 통과시키지 않는다.

상호작용 예제는 실제 click·tap으로 `initial → immediately after input → settled/final`을 실행하고 각 시점의 화면·layout·asset·disabled/loading 상태를 기록한다. CSS transition·animation, layout 측정 뒤 크기 갱신, 지연 mount, 한 제스처의 pressed와 selected/checked 동시 변경, loading 중간 상태가 있을 때만 시간축과 경과 시간을 추가한다. 정적 장면에는 임의의 중간 프레임을 요구하지 않는다.

다음 장면으로 넘어가기 전에 해당 검사에서 연 menu·overlay를 닫고 기대 초기 상태를 확인한다. 상태를 복원해야 하면 소유한 같은 Card에서 탐색하거나 reload한다. 이 상태 정리는 마지막 Card 제거 확인을 대신하지 않는다.

브라우저나 Web preview 결과는 native 결과가 아니다. preview·native bundle·로컬 Lynx 런타임·실기기는 별도 증거 행으로 기록한다. React 기준·asset·host/frame·초기 상태를 직접 확인하지 않았거나 상호작용 전이를 실행하지 않았다면 `시각적 동등성 통과`로 판정하지 않는다.

## 6. 문서 인프라를 실제로 바꾼 경우만

MDX 페이지, 코드 탭, QR, Web preview 또는 docs build pipeline 자체를 변경한 경우에만 이 절차를 추가한다. Preview·코드 탭·QR·Explorer가 같은 논리 ID와 entry를 가리키는지 실제 문서에서 확인한다.

### 빌드와 공유 출력

docs Lynx watcher와 정적 빌드는 `docs/public/__lynx__`를 함께 갱신하므로 동시에 실행하지 않는다. 출력 소유자가 실행 중인 watcher를 확인하고 자신이 시작한 watcher만 중지한다. 다른 소유자의 watcher가 출력 갱신을 계속하면 인계·중지 조율 전까지 해당 정적 빌드를 `환경 차단`으로 남긴다. 임의의 출력 삭제나 사용자 프로세스 종료로 해결하지 않는다.

아래 명령은 저장소 루트에서 변경한 경로에 맞춰 선택한다. 실제 지원 명령은 `docs/package.json`에서 확인하며, 모든 명령을 연달아 실행하지 않는다.

| 검증 대상 | 기존 명령 |
| --- | --- |
| 정적 문서 페이지·host·docs pipeline | `bun docs:build` |
| 문서용 production 예제 bundle·manifest | `bun --filter @seed-design/docs build:lynx-examples` |
| 문서용 development 예제 bundle | `bun --filter @seed-design/docs build:lynx-examples:development` |

문서 예제·도구의 타입·회귀 검사는 [공통 자동 검증](../../seed-create-component/references/verification-checklist.md#자동-검증)에 따라 `bun docs:test` 등 해당 경로의 기존 명령으로 확인한다. bundle 빌드 성공을 타입 검사나 실제 화면 확인으로 대체하지 않는다.

### 서빙과 소비 경로

1. 서버 소유자가 1절의 `portless` 버전·소유권 조건을 확인한다. 정적 문서는 `portless run --name ette bunx serve docs/out`, 문서 페이지 없이 bundle만 확인할 때는 `portless run --name ette bunx serve docs/public`을 저장소 루트에서 실행한다. 둘 중 필요한 하나만 사용하고 기존 `ette` 서버를 강제로 교체하지 않는다. `serve`는 `portless`가 전달한 `PORT`를 사용하며, 실제 주소는 서버 로그에서 확인한다.
2. `docs/public/__lynx__/manifest.json`에서 대상 논리 ID의 `examples[id].lynx`·`web` 값을 읽어 URL을 만든다. bundle 이름이나 해시를 추측하지 않는다. `/__lynx__/…` 경로를 유지하려면 bundle 서빙 루트는 `docs/public`이어야 한다. 중간 출력인 `docs/.next/lynx-rspeedy-dev-dist`를 서빙하지 않는다.
3. 정적 문서는 `docs/out`의 실제 HTML·bundle을 기준으로 확인한다. `docs/public`의 bundle만 갱신해도 이전 `docs/out`이 갱신됐다고 가정하지 않는다. 변경본과 실제 로드한 bundle을 대조하고, native 열기는 3절의 소유권 절차를 따른다.
4. QR 원문은 직접 접근 가능한 HTTP(S) native bundle URL이고 Explorer는 그 전체 URL을 인코딩한 `lynx://open?url=`인지 확인한다. Web preview는 실제 `LynxComponentExample`에서 확인한다. 자동 높이·고정 높이 또는 viewport 단위 처리를 바꾸면 `docs/components/lynx-example/preview-lifecycle.test.ts`의 `transformVH` 계약과 실제 크기·잘림을 함께 확인한다.

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

직접 시작한 서버·브라우저는 그 수명 소유자가 정리한다. Card는 성공·실패 모두 [cleanup과 잠금 해제](concurrency/session-ownership.md#5-성공실패-모두-cleanup-후-잠금-해제)를 완료한다. 보고에 소유 session 제거 확인과 잠금 해제 여부를 포함하고, 미완료라면 client·session·잠금 경로·오류를 남긴다. 증거로 참조하지 않는 임시 파일만 정리하고, 기존 서버·host app·기기 session은 종료하지 않는다.
