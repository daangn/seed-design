# Lynx session 소유권과 Card 수명

Lynx 온라인 검증은 단독 작업도 이 절차를 따른다. 같은 app/client를 여러 에이전트나 worktree가 사용할 때, `open → reload → snapshot/evaluate`를 이어갈 때, 자신이 연 page를 정리할 때 먼저 읽는다. CLI·MCP·OS 딥 링크 모두 같은 소유권과 잠금을 적용한다.

## 안전 기준

같은 PlayLynx client에서 에이전트가 검증용으로 유지하는 Card는 전체 worktree를 합쳐 최대 하나다. 잠금 범위는 `open` 호출만이 아니라 Card 생성부터 검증·reload·제거 확인까지다. session ID가 다르더라도 같은 client의 Card 검증을 병렬 실행하지 않는다.

Card마다 runtime과 메모리를 사용하므로 재검증 때 새 Card를 열지 않는다. 검증이 끝나면 소유한 Card를 닫아 누적을 막는다.

빌드·정적 검사는 [검증 분담과 자원](../../../seed-orchestrate-component/references/collaboration.md#검증-분담과-자원)에 따라 별도로 실행한다. client가 다르고 host process·기기·전역 overlay·캡처 자원이 독립적이면 각 client의 잠금으로 진행할 수 있다. 메모리 압박이 관찰되면 추가 open을 중단하고 자신이 소유한 Card의 정리부터 수행한다. 다른 session 일괄 제거나 app 강제 종료로 해결하지 않는다.

## client와 Card의 구분

`client`는 DevTool에 연결된 host endpoint이고 `session`은 그 안의 Lynx view다. PlayLynx에서 `agent-lynx open`은 지정한 client에 새 Card의 session을 추가한다. 생성한 `(client ID, session ID)` 쌍을 점유하고 bundle URL을 식별 근거로 기록한다. 같은 URL, 비어 보이는 화면, 사용 중이 아닌 것처럼 보이는 client는 소유권 근거가 아니다.

## 1. client 고정

설치된 CLI의 `--help`로 명령을 확인하고 `list-clients`를 실행한다. 대상 endpoint를 `CLIENT_ID`로 고정한다. `SESSION_ID`는 Card 생성 후 식별한다. PATH에 CLI가 없으면 명령 접두사 `agent-lynx`만 `bunx agent-lynx`로 바꾼다.

동일 이름의 client가 여러 개면 bundle ID·device·process 정보로 구분한다. 첫 client나 이름만으로 선택하지 않는다. 구분할 수 없으면 open 전에 충돌과 후보를 보고한다.

완료 조건은 대상 client ID와 host 식별 근거를 작업 상태에 기록한 것이다.

## 2. 공유 lifecycle lock 획득

모든 worktree와 에이전트가 다음 잠금 규약을 공유한다.

- 잠금 경로는 `/tmp/agent-lynx-client-<key>.lifecycle.lock`이다. `<key>`는 `CLIENT_ID` 문자열에 JavaScript `encodeURIComponent`를 적용한 값이다. worktree·작업·bundle URL·session ID별로 경로를 나누지 않는다.
- atomic `mkdir` 성공만 획득으로 인정한다. 존재 여부 검사 후 생성하는 방식은 사용하지 않는다.
- 획득 직후 디렉터리 안 `owner.json`에 고유 owner token, 작업/에이전트 ID, worktree, 생성 요청 client·host 식별 정보, 획득 시각을 기록한다. host의 `debugRouterId`나 process 식별 근거도 보존한다. baseline·생성 시도·점유한 client/session 쌍·요청 bundle URL·마지막으로 확인한 로드 URL·cleanup 상태를 진행 중 갱신한다. 짧은 CLI 호출의 PID가 종료됐다는 이유로 잠금이 만료됐다고 판단하지 않는다.
- 이미 있으면 최대 60초 동안 1초 간격으로 획득을 재시도한다. 기한이 지나면 잠금 경로·확인한 소유자·대기 상태를 보고하고 해당 client의 온라인 검증을 `환경 차단`으로 남긴다. 독립적인 정적 검사는 계속할 수 있다.
- 소유자가 불명확하거나 사라진 잠금은 자동 삭제하지 않는다. 인계받은 담당은 남은 Card와 소유권을 확인하고 정리한 뒤에만 수동 회수한다. 대기자는 임의 회수하지 않는다.

완료 조건은 atomic 획득 성공과 owner 기록이다. 그 전에는 `open`, `App.openPage`, OS 딥 링크, reload나 화면 조작을 시작하지 않는다. 프로세스 종료 시 잠금을 무조건 지우는 exit trap도 사용하지 않는다.

## 3. 잠금 안에서 한 번 열고 소유 session 식별

```bash
agent-lynx list-clients
agent-lynx list-sessions --client "$CLIENT_ID"
# client 목록과 session ID 집합을 baseline으로 저장하고 생성 시도를 기록한 뒤 한 번만 실행한다.
agent-lynx open "$BUNDLE_URL" --client "$CLIENT_ID"
agent-lynx list-clients
agent-lynx list-sessions --client "$CLIENT_ID"
```

`agent-lynx` 0.14.2의 `open`에는 session 선택 옵션이 없고 결과는 전체 SessionList다. 생성 요청별 correlation ID도 없다. 반환 목록의 마지막 항목이나 `max(session_id)`는 소유권 근거가 아니다.

`open`에는 HTTP(S) bundle URL을 직접 전달할 수 있다. host가 딥 링크를 요구하면 전체 bundle URL을 인코딩한 `$DEEP_LINK`를 대신 전달하되 두 경로를 연달아 실행하지 않는다. 생성 전후 client 목록을 대조하고 같은 client의 session ID 집합 차이를 구한다. 차이가 정확히 하나인지와 새 ID의 bundle 경로·전체 query가 요청 대상에 일치하는지 확인한다. PlayLynx가 붙이는 `#__playlynx_http_context=…`는 URL 비교에서 제외한다. baseline에 있던 동일 URL의 session은 점유하지 않는다.

새 ID가 0개 또는 여러 개라면 같은 client의 목록을 최대 30초 동안 다시 조회할 수 있지만 open은 반복하지 않는다. baseline·URL·host의 생성 근거로 이번 호출의 session 하나를 확정할 수 있을 때만 계속한다. URL 일치만으로 중복 후보 중 하나를 고르지 않는다. open이 timeout이나 오류로 끝나도 Card가 생성됐을 수 있으므로 같은 식별 절차로 확인한다.

완료 조건은 생성한 `CLIENT_ID`·`SESSION_ID` 쌍, 요청 bundle URL과 식별 근거를 owner 기록에 저장한 것이다. 고정한 client에서 소유 session을 확정하지 못하면 잠금을 유지하고 baseline·새 후보·생성 결과를 보고한다. 다른 client로 이동하거나 추정한 session을 조작하지 않는다.

## 4. 같은 session에서 검증하고 reload

session 대상 명령에는 항상 `--client "$CLIENT_ID" --session "$SESSION_ID"`를 함께 전달한다. CDP, evaluate, snapshot·tap·fill·clear·scroll·wait·get, screenshot, console·sources·inspect, ReactLynx, session 범위 memory·trace 작업에 적용한다. MCP도 같은 ID를 명시한다. 이 저장소의 검증에서는 단독 실행도 latest session 자동 선택에 의존하지 않는다.

명령 대상은 매번 목록에서 다시 고르지 않고 owner 기록의 같은 쌍을 사용한다. 같은 bundle URL의 기존 Card나 다른 에이전트의 Card로 대체하지 않는다. 점유 기록을 잃었거나 owner token·host 식별 근거가 바뀌면 조작을 중단한다. 잠금 없이 남아 있는 Card도 임의 점유하지 않으며, 소유권 이전은 정확한 쌍·URL·상태를 명시한 인계로만 한다.

client 범위 App·recorder·trace 명령은 지원하는 client 옵션만 사용한다. 전역 `Memory.getAllMemoryUsage`의 `--session -1`은 명시적인 전역 대상이며 owned session으로 바꾸지 않는다. 전역 조회 결과의 session을 정리 대상으로 삼지 않는다.

```bash
agent-lynx snapshot --client "$CLIENT_ID" --session "$SESSION_ID"
agent-lynx cdp --client "$CLIENT_ID" --session "$SESSION_ID" --method DOM.getDocument
agent-lynx evaluate 'JSON.stringify(lynx.__globalProps)' --client "$CLIENT_ID" --session "$SESSION_ID"
# 같은 Card의 bundle을 다시 검증한다.
agent-lynx cdp --client "$CLIENT_ID" --session "$SESSION_ID" --method Page.reload '{}'
```

같은 화면의 재검증은 `Page.reload`로 한다. 화면·tree가 비었거나 명령이 실패해도 대체 Card를 열지 않고 같은 session에서 원인을 확인한다. reload 후에는 같은 ID가 목록에 남았는지와 DOM·console·load event 또는 실제 화면으로 로딩 결과를 확인한다. reload로 snapshot ref가 무효화되면 같은 ID로 snapshot을 새로 얻는다.

`Page.reload`의 `url`에는 HTTP(S) bundle URL을 사용하며 `list-sessions`의 URL은 바뀌지 않을 수 있다. URL 문자열 변경만으로 성공을 판정하지 않는다. 요청 범위의 다른 시나리오는 점유한 Card 안에서 탐색하거나 reload하고, 실제 로드를 확인한 URL을 owner 기록에 갱신한다. 다른 작업의 bundle을 이 Card에 덮어씌우지 않는다. 새 Card가 꼭 필요하면 먼저 5단계로 이전 Card 제거를 확인한다.

완료 조건은 고정한 session에서 대상 장면과 요청한 사용자 결과의 증거를 확보한 것이다. session 소실·ID 변경을 발견하면 최신 session으로 갈아타지 않고 중단한다.

## 5. 성공·실패 모두 cleanup 후 잠금 해제

cleanup은 검증의 마지막 필수 단계다. 명령 실패나 검증 실패에도 owner 기록과 잠금을 유지한 채 자신이 만든 session만 닫는다. baseline에 있던 session이나 소유권을 확정하지 못한 session은 닫지 않는다.

설치된 CLI에 session-targeted close가 있거나 host가 공식 종료 명령을 구현했다면 그 경로를 우선한다. `agent-lynx` 0.14.2에는 `close` 명령이 없다. `App.closePage` 문서의 존재만으로 구현됐다고 보지 않는다. PlayLynx의 `not implemented`는 종료 실패다.

PlayLynx에서는 공식 종료 경로가 없거나 미구현이면 다음 임시 종료 명령을 소유 session에만 사용한다. 사용한 host/app 버전·client/session·명령 결과와 제거 확인 증거를 보고하고, 다른 host나 검증하지 않은 버전의 지원으로 일반화하지 않는다.

```bash
agent-lynx evaluate \
  'lynx.getNativeApp().nativeModuleProxy.NavigationModule.close()' \
  --client "$CLIENT_ID" --session "$SESSION_ID"
agent-lynx list-sessions --client "$CLIENT_ID"
```

완료 조건은 성공한 목록 조회에서 소유한 session ID가 사라진 것이다. 필요하면 최대 30초 동안 같은 client의 목록을 다시 조회한다. close 명령 성공만으로 통과시키지 않는다. 반대로 close 도중 연결이 끊겨도 목록으로 제거를 확인할 수 있다. 목록 조회 실패·client 소실은 빈 목록이 아니다.

제거를 확인하면 cleanup 결과를 기록하고 자신의 owner token이 일치하는 잠금만 해제한다. open을 전혀 시도하지 않은 실패라면 생성할 Card가 없으므로 자신의 잠금을 해제할 수 있다. open 시도 후에는 응답 실패를 생성 실패로 단정해 해제하지 않는다.

종료 실패나 제거 미확인 상태에서는 추가 open을 중단하고 잠금을 유지한다. 정확한 client·owned session 또는 미확정 후보·baseline·잠금 경로·종료 오류를 인계한다. 후속 담당이 남은 Card를 확인하고 정리한 뒤 잠금을 회수한다. 전체 app 종료나 다른 창 닫기로 대체하지 않는다.

## 잠금의 효력

`owner.json`과 atomic 잠금은 이 절차를 따르는 에이전트 사이의 점유 규약이다. 잠금을 획득한 소유자만 기록된 client/session 쌍을 조작한다. 파일 잠금이 다른 호출자의 CLI 명령까지 강제로 차단한다고 보고하지 않는다.
