# Lynx session 소유권과 Card 수명

Lynx 온라인 검증은 단독 작업도 이 절차를 따른다. 같은 app/client를 여러 에이전트나 worktree가 쓸 때, `open → reload → snapshot/evaluate`를 이어갈 때, 자신이 연 page를 정리할 때 먼저 읽는다. CLI·MCP·OS 딥 링크 모두 같은 소유권과 잠금을 적용한다.

순서는 1–5절과 같다. 각 절의 완료 조건을 채워야 다음 절로 간다. 막히면 잠금을 유지한 채 보고한다.

1. client를 고정한다.
2. 공유 lifecycle lock을 atomic하게 얻고 owner를 기록한다.
3. 잠금 안에서 한 번만 열고 소유 session을 식별한다.
4. 같은 session에서 검증하고, 재검증은 reload로 한다.
5. 성공·실패 모두 소유 session 제거를 확인한 뒤 잠금을 푼다.

## 안전 기준

- 같은 PlayLynx client에서 에이전트가 검증용으로 유지하는 Card는 모든 worktree를 합쳐 최대 하나다.
- 잠금 범위는 `open` 호출만이 아니라 Card 생성부터 검증·reload·제거 확인까지다. session ID가 달라도 같은 client의 Card 검증은 병렬로 하지 않는다.
- Card마다 runtime과 메모리를 쓴다. 재검증 때 새 Card를 열지 않고, 검증이 끝나면 소유한 Card를 닫아 누적을 막는다.
- 빌드·정적 검사는 [검증 분담과 자원](../../../seed-orchestrate-component/references/collaboration.md#검증-분담과-자원)에 따라 별도로 실행한다.
- client가 다르고 host process·기기·전역 overlay·캡처 자원이 독립적이면 각 client의 잠금으로 함께 진행할 수 있다.
- 메모리 압박이 보이면 추가 open을 멈추고 자신이 소유한 Card부터 정리한다. 다른 session 일괄 제거나 app 강제 종료로 해결하지 않는다.

## client와 Card의 구분

`client`는 DevTool에 연결된 host endpoint이고 `session`은 그 안의 Lynx view다. PlayLynx에서 `agent-lynx open`은 지정한 client에 새 Card의 session을 추가한다. 생성한 `(client ID, session ID)` 쌍을 점유하고 bundle URL을 식별 근거로 기록한다. 같은 URL, 비어 보이는 화면, 쓰이지 않는 것처럼 보이는 client는 소유권 근거가 아니다.

## 1. client 고정

1. 설치된 CLI의 `--help`로 명령을 확인하고 `list-clients`를 실행한다. PATH에 CLI가 없으면 접두사 `agent-lynx`만 `bunx agent-lynx`로 바꾼다.
2. 대상 endpoint를 `CLIENT_ID`로 고정한다. `SESSION_ID`는 Card 생성 뒤 식별한다.
3. 같은 이름의 client가 여럿이면 bundle ID·device·process 정보로 구분한다. 첫 client나 이름만으로 고르지 않는다. 구분할 수 없으면 open 전에 충돌과 후보를 보고한다.

완료 조건: 대상 client ID와 host 식별 근거를 작업 상태에 기록했다.

## 2. 공유 lifecycle lock 획득

모든 worktree와 에이전트가 같은 잠금 규약을 쓴다. 획득은 다음 형태로 한다.

```bash
LOCK="/tmp/agent-lynx-client-$(node -p 'encodeURIComponent(process.argv[1])' "$CLIENT_ID").lifecycle.lock"
ACQUIRED=0
for _ in $(seq 1 60); do
  if mkdir "$LOCK" 2>/dev/null; then ACQUIRED=1; break; fi
  sleep 1
done
```

- 잠금 경로는 `/tmp/agent-lynx-client-<key>.lifecycle.lock`이다. `<key>`는 `CLIENT_ID` 문자열에 JavaScript `encodeURIComponent`를 적용한 값이다. worktree·작업·bundle URL·session ID별로 경로를 나누지 않는다.
- atomic `mkdir` 성공만 획득으로 인정한다. 존재 여부를 검사한 뒤 만드는 방식은 쓰지 않는다.
- 획득 직후 디렉터리 안 `owner.json`에 고유 owner token, 작업/에이전트 ID, worktree, 생성 요청 client·host 식별 정보, 획득 시각을 적는다. host의 `debugRouterId`나 process 식별 근거도 남긴다.
- 진행하면서 `owner.json`에 baseline, 생성 시도, 점유한 client/session 쌍, 요청 bundle URL, 마지막으로 확인한 로드 URL, cleanup 상태를 갱신한다.
- 짧은 CLI 호출의 PID가 끝났다고 잠금이 만료됐다고 판단하지 않는다.
- 잠금이 이미 있으면 최대 60초 동안 1초 간격으로 다시 시도한다. 기한이 지나면 잠금 경로·확인한 소유자·대기 상태를 보고하고 그 client의 온라인 검증을 `환경 차단`으로 남긴다. 독립적인 정적 검사는 계속한다.
- 소유자가 불명확하거나 사라진 잠금은 자동 삭제하지 않는다. 인계받은 담당이 남은 Card와 소유권을 확인하고 정리한 뒤에만 수동으로 회수한다. 대기자는 임의로 회수하지 않는다.

완료 조건: atomic 획득 성공과 owner 기록. 그 전에는 `open`, `App.openPage`, OS 딥 링크, reload, 화면 조작을 시작하지 않는다. 프로세스 종료 때 잠금을 무조건 지우는 exit trap을 쓰지 않는다 → 해제는 5단계에서만 한다.

## 3. 잠금 안에서 한 번 열고 소유 session 식별

```bash
agent-lynx list-clients
agent-lynx list-sessions --client "$CLIENT_ID"
# client 목록과 session ID 집합을 baseline으로 저장하고 생성 시도를 기록한 뒤 한 번만 실행한다.
agent-lynx open "$BUNDLE_URL" --client "$CLIENT_ID"
agent-lynx list-clients
agent-lynx list-sessions --client "$CLIENT_ID"
```

`agent-lynx` 0.14.2의 `open`에는 session 선택 옵션이 없고 결과로 전체 SessionList를 반환한다. 생성 요청별 correlation ID도 없다. 반환 목록의 마지막 항목이나 `max(session_id)`는 소유권 근거가 아니다.

- `open`에는 HTTP(S) bundle URL을 바로 넘길 수 있다. host가 딥 링크를 요구하면 전체 bundle URL을 인코딩한 `$DEEP_LINK`를 대신 넘긴다. 두 경로를 연달아 실행하지 않는다.
- 생성 전후 client 목록을 대조하고, 같은 client의 session ID 집합 차이를 구한다. 차이가 정확히 하나이고 새 ID의 bundle 경로·전체 query가 요청 대상과 일치하는지 확인한다.
- PlayLynx가 붙이는 `#__playlynx_http_context=…`는 URL 비교에서 뺀다. baseline에 있던 같은 URL의 session은 점유하지 않는다.
- 새 ID가 0개나 여러 개면 같은 client 목록을 최대 30초 동안 다시 조회한다. open은 반복하지 않는다. baseline·URL·host의 생성 근거로 이번 호출의 session 하나를 확정할 수 있을 때만 계속한다. URL 일치만으로 중복 후보 중 하나를 고르지 않는다.
- open이 timeout이나 오류로 끝나도 Card가 생겼을 수 있다 → 같은 식별 절차로 확인한다.

완료 조건: 생성한 `CLIENT_ID`·`SESSION_ID` 쌍, 요청 bundle URL, 식별 근거를 owner 기록에 저장했다. 고정한 client에서 소유 session을 확정하지 못하면 잠금을 유지한 채 baseline·새 후보·생성 결과를 보고한다. 다른 client로 옮기거나 추정한 session을 조작하지 않는다.

## 4. 같은 session에서 검증하고 reload

session 대상 명령에는 항상 `--client "$CLIENT_ID" --session "$SESSION_ID"`를 함께 넘긴다. CDP, evaluate, snapshot·tap·fill·clear·scroll·wait·get, screenshot, console·sources·inspect, ReactLynx, session 범위 memory·trace 작업이 모두 해당한다. MCP도 같은 ID를 명시한다. 이 저장소의 검증에서는 단독 실행이라도 latest session 자동 선택에 기대지 않는다.

- 명령 대상은 매번 목록에서 다시 고르지 않고 owner 기록의 같은 쌍을 쓴다. 같은 bundle URL의 기존 Card나 다른 에이전트의 Card로 바꾸지 않는다.
- 점유 기록을 잃었거나 owner token·host 식별 근거가 바뀌면 조작을 멈춘다.
- 잠금 없이 남은 Card도 임의로 점유하지 않는다. 소유권 이전은 정확한 쌍·URL·상태를 명시한 인계로만 한다.
- client 범위 App·recorder·trace 명령에는 지원하는 client 옵션만 쓴다. 전역 `Memory.getAllMemoryUsage`의 `--session -1`은 명시적인 전역 대상이므로 owned session으로 바꾸지 않는다. 전역 조회 결과의 session을 정리 대상으로 삼지 않는다.

```bash
agent-lynx snapshot --client "$CLIENT_ID" --session "$SESSION_ID"
agent-lynx cdp --client "$CLIENT_ID" --session "$SESSION_ID" --method DOM.getDocument
agent-lynx evaluate 'JSON.stringify(lynx.__globalProps)' --client "$CLIENT_ID" --session "$SESSION_ID"
# 같은 Card의 bundle을 다시 검증한다.
agent-lynx cdp --client "$CLIENT_ID" --session "$SESSION_ID" --method Page.reload '{}'
```

reload:

- 같은 화면의 재검증은 `Page.reload`로 한다. 화면·tree가 비었거나 명령이 실패해도 대체 Card를 열지 않고 같은 session에서 원인을 찾는다.
- reload 뒤에는 같은 ID가 목록에 남았는지, DOM·console·load event 또는 실제 화면으로 로딩 결과를 확인한다. snapshot ref가 무효화되면 같은 ID로 snapshot을 다시 얻는다.
- `Page.reload`의 `url`에는 HTTP(S) bundle URL을 쓴다. `list-sessions`의 URL은 바뀌지 않을 수 있으므로 URL 문자열 변화로 성공을 판정하지 않는다.
- 요청 범위의 다른 시나리오는 점유한 Card 안에서 탐색하거나 reload하고, 실제 로드를 확인한 URL을 owner 기록에 갱신한다. 다른 작업의 bundle을 이 Card에 덮어쓰지 않는다.
- 새 Card가 꼭 필요하면 5단계로 이전 Card 제거를 먼저 확인한다.

완료 조건: 고정한 session에서 대상 장면과 요청한 사용자 결과의 증거를 확보했다. session 소실·ID 변경을 발견하면 최신 session으로 갈아타지 않고 멈춘다.

## 5. 성공·실패 모두 cleanup 후 잠금 해제

cleanup은 검증의 마지막 필수 단계다. 명령이나 검증이 실패해도 owner 기록과 잠금을 유지한 채 자신이 만든 session만 닫는다. baseline에 있던 session이나 소유권을 확정하지 못한 session은 닫지 않는다.

- 설치된 CLI에 session 대상 close가 있거나 host가 공식 종료 명령을 구현했으면 그 경로를 먼저 쓴다.
- `agent-lynx` 0.14.2에는 `close` 명령이 없다. `App.closePage`가 문서에 있다고 구현됐다고 보지 않는다. PlayLynx가 `not implemented`를 반환하면 종료 실패다.
- PlayLynx에서 공식 종료 경로가 없거나 미구현이면 아래 임시 종료 명령을 소유 session에만 쓴다. 사용한 host/app 버전, client/session, 명령 결과, 제거 확인 증거를 보고한다. 다른 host나 검증하지 않은 버전에서도 된다고 일반화하지 않는다.

```bash
agent-lynx evaluate \
  'lynx.getNativeApp().nativeModuleProxy.NavigationModule.close()' \
  --client "$CLIENT_ID" --session "$SESSION_ID"
agent-lynx list-sessions --client "$CLIENT_ID"
```

제거 확인:

- 완료 조건은 성공한 목록 조회에서 소유한 session ID가 사라진 것이다. 필요하면 같은 client 목록을 최대 30초 동안 다시 조회한다.
- close 명령이 성공했다는 것만으로 통과시키지 않는다. 반대로 close 도중 연결이 끊겨도 목록으로 제거를 확인할 수 있다.
- 목록 조회 실패·client 소실은 빈 목록이 아니다.

잠금 해제:

- 제거를 확인하면 cleanup 결과를 기록하고, owner token이 자신과 일치하는 잠금만 해제한다.
- open을 전혀 시도하지 않은 실패라면 생성된 Card가 없으므로 자신의 잠금을 해제한다. open을 시도한 뒤에는 응답 실패를 생성 실패로 단정해 해제하지 않는다.
- 종료 실패나 제거 미확인이면 추가 open을 멈추고 잠금을 유지한다. 정확한 client·owned session 또는 미확정 후보, baseline, 잠금 경로, 종료 오류를 인계한다. 후속 담당이 남은 Card를 확인·정리한 뒤 잠금을 회수한다. 전체 app 종료나 다른 창 닫기로 대신하지 않는다.

## 잠금의 효력

`owner.json`과 atomic 잠금은 이 절차를 따르는 에이전트 사이의 점유 규약이다. 잠금을 획득한 소유자만 기록된 client/session 쌍을 조작한다. 파일 잠금이 다른 호출자의 CLI 명령까지 막는다고 보고하지 않는다.
