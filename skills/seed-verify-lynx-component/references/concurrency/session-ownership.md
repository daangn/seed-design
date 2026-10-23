# Lynx session 소유권과 Card 수명

Lynx 온라인 검증은 단독 작업도 이 절차를 따른다. Card 생성부터 제거 확인까지를 [`scripts/lynx-card.ts`](../../scripts/lynx-card.ts)로 한다. 스크립트가 잠금 획득·owner 기록·open 전후 session 대조·heartbeat·정리·만료 잠금 회수를 맡으므로 셸 조각으로 `owner.json`을 직접 만들거나 고치지 않는다. CLI·MCP·OS 딥 링크 모두 같은 잠금을 적용한다. 명령은 저장소 루트에서 실행한다.

```bash
CARD="bun skills/seed-verify-lynx-component/scripts/lynx-card.ts"
$CARD acquire --client "$CLIENT_ID"
$CARD open "$BUNDLE_URL" --client "$CLIENT_ID"
$CARD exec --client "$CLIENT_ID" -- snapshot
$CARD release --client "$CLIENT_ID"
```

모든 명령은 JSON 한 개를 출력한다. `result`가 `blocked`이면 exit code 1이고 `reason`과 판단 근거를 함께 준다 → [막혔을 때](#막혔을-때)를 따른다.

## 안전 기준

- 같은 PlayLynx client에서 에이전트가 검증용으로 유지하는 Card는 모든 worktree를 합쳐 최대 하나다.
- 잠금 범위는 `open` 호출만이 아니라 Card 생성부터 검증·reload·제거 확인까지다. session ID가 달라도 같은 client의 Card 검증은 병렬로 하지 않는다.
- 자신이 만든 session만 조작하고 닫는다. baseline에 있던 session, 같은 URL의 기존 Card, 소유권을 확정하지 못한 session은 건드리지 않는다.
- Card마다 runtime과 메모리를 쓴다. 재검증 때 새 Card를 열지 않고, 검증이 끝나면 소유한 Card를 닫아 누적을 막는다.
- 빌드·정적 검사는 [검증 분담과 자원](../../../seed-orchestrate-component/references/collaboration.md#검증-분담과-자원)에 따라 별도로 실행한다.
- client가 다르고 host process·기기·전역 overlay·캡처 자원이 독립적이면 각 client의 잠금으로 함께 진행할 수 있다.
- 메모리 압박이 보이면 추가 open을 멈추고 자신이 소유한 Card부터 정리한다. 다른 session 일괄 제거나 app 강제 종료로 해결하지 않는다.

## client와 Card의 구분

`client`는 DevTool에 연결된 host endpoint이고 `session`은 그 안의 Lynx view다. PlayLynx에서 `agent-lynx open`은 지정한 client에 새 Card의 session을 추가한다. 같은 URL, 비어 보이는 화면, 쓰이지 않는 것처럼 보이는 client는 소유권 근거가 아니다.

`agent-lynx` 0.14.2(저장소 고정 버전)와 0.14.19 모두 session을 지정하는 open, 생성 요청별 correlation ID, `close` 명령이 없다. `open`은 전체 SessionList를 돌려주므로 마지막 항목이나 `max(session_id)`는 소유권 근거가 아니다. 그래서 스크립트는 open 전 baseline과 open 뒤 목록의 차이로 소유 session을 확정한다.

## 스크립트의 잠금 규약

- 잠금 경로는 `/tmp/agent-lynx-client-<encodeURIComponent(CLIENT_ID)>.lifecycle.lock`이다. 같은 client를 쓰는 모든 worktree가 같은 경로를 쓰고, atomic `mkdir` 성공만 획득으로 인정한다.
- owner는 기본으로 현재 worktree 경로(`git rev-parse --show-toplevel`)다. 한 worktree에서 여러 에이전트가 온라인 검증을 나눠 맡으면 각자 `--owner <작업 ID>`를 모든 명령에 같은 값으로 넘긴다.
- 잠금은 heartbeat가 있는 임대다. `acquire`·`open`·`exec`·`renew`가 heartbeat를 갱신하고, 마지막 갱신 뒤 TTL(기본 600초, `acquire --ttl <초>`)이 지나면 만료로 본다. 짧은 CLI 호출의 PID로 생존을 판단하지 않는다.
- 만료된 잠금은 다음 `acquire`가 회수한다. 회수자 하나만 기록된 Card를 정리하고 잠금을 넘겨받는다. 정리 기준은 `release`와 같다: 기록한 session만 닫고, 확정할 수 없으면 회수하지 않는다.
- `version` 필드가 없는 이전 규약의 잠금은 자동 회수하지 않는다. 이전 문서를 따르는 다른 worktree의 에이전트가 아직 쓰고 있을 수 있다.
- 잠금 정보는 `$CARD status --client "$CLIENT_ID"`로 본다. `heldByMe`·`stale`·기록(state, baseline, sessionId, error)을 준다.

## 1. client 고정

1. `agent-lynx list-clients`로 대상 endpoint를 `CLIENT_ID`로 고른다. PATH에 CLI가 없으면 접두사 `agent-lynx`만 `bunx agent-lynx`로 바꾼다. 스크립트도 같은 순서로 CLI를 찾는다.
2. 같은 이름의 client가 여럿이면 bundle ID·device·process 정보로 구분한다. 첫 client나 이름만으로 고르지 않는다. 구분할 수 없으면 open 전에 충돌과 후보를 보고한다.

완료 조건: 대상 client ID와 host 식별 근거를 작업 상태에 기록했다.

## 2. 잠금 얻기

```bash
$CARD acquire --client "$CLIENT_ID"
```

- `result`가 `acquired`·`reclaimed`·`already-held`면 진행한다. 스크립트가 client의 `debugRouterId`와 host 정보를 기록한다.
- 다른 owner가 잡고 있으면 1초 간격으로 최대 60초(`--wait <초>`) 기다린다. 그래도 `blocked`면 그 client의 온라인 검증을 `환경 차단`으로 남기고 독립적인 정적 검사는 계속한다.

완료 조건: 획득 결과를 받았다. 그 전에는 `open`, `App.openPage`, OS 딥 링크, reload, 화면 조작을 시작하지 않는다.

## 3. 한 번 열기

```bash
$CARD open "$BUNDLE_URL" --client "$CLIENT_ID"
```

- HTTP(S) bundle URL을 바로 넘긴다. host가 딥 링크를 요구하면 전체 bundle URL을 인코딩한 `$DEEP_LINK`를 대신 넘긴다. 두 경로를 연달아 실행하지 않는다.
- 스크립트는 baseline을 기록한 뒤 `agent-lynx open`을 한 번만 호출하고, 최대 30초 동안 목록을 다시 조회한다. baseline에 없고 요청 URL과 같은 session이 정확히 하나면 `opened`와 `sessionId`를 준다. URL 비교에서 PlayLynx의 `#__playlynx_http_context=…`는 빼고, 딥 링크는 안쪽 bundle URL로 푼다.
- open이 오류·timeout으로 끝나도 목록으로 판정한다. 후보가 0개나 여럿이면 `blocked`다 → 다시 open하지 않고 5단계 `release`로 정리를 시도한다.
- 이미 Card를 연 기록이 있으면 `open`을 거부한다. 다른 장면은 같은 Card에서 탐색하거나 reload한다.

완료 조건: `opened` 결과의 `CLIENT_ID`·`SESSION_ID`와 bundle URL을 작업 상태에 남겼다.

## 4. 같은 session에서 검증하고 reload

session 대상 명령은 `exec`로 실행한다. `--` 뒤의 `agent-lynx` 인자에 스크립트가 소유 `--client`·`--session`을 붙이고 heartbeat를 갱신한다. CDP, evaluate, snapshot·tap·fill·clear·scroll·wait·get, screenshot, console·sources·inspect, ReactLynx, session 범위 memory·trace가 모두 해당한다.

```bash
$CARD exec --client "$CLIENT_ID" -- snapshot
$CARD exec --client "$CLIENT_ID" -- cdp --method DOM.getDocument
$CARD exec --client "$CLIENT_ID" -- evaluate 'JSON.stringify(lynx.__globalProps)'
# 같은 Card의 bundle을 다시 검증한다.
$CARD exec --client "$CLIENT_ID" -- cdp --method Page.reload '{}'
# client 범위 명령(app·recorder·trace 등)은 --client만 붙인다.
$CARD exec --client-scope --client "$CLIENT_ID" -- app --method App.openPage '{}'
```

- `exec`는 잠금 owner가 바뀌었으면 실행하지 않는다. 그 결과를 받으면 조작을 멈추고 `status`로 현재 소유자를 확인한다.
- 장치와 무관한 작업(빌드·분석)으로 TTL보다 오래 걸릴 것 같으면 그 전에 `$CARD renew --client "$CLIENT_ID"`를 실행한다. 다만 Card를 연 채 headless lib를 다시 빌드하면 PlayLynx 연결이 끊길 수 있다 → 재빌드 전에 `release`한다.
- MCP처럼 `exec`를 거칠 수 없는 경로는 `opened` 결과의 같은 ID를 명시하고, 사용 중에 `renew`한다. latest session 자동 선택에 기대지 않는다.
- 전역 `Memory.getAllMemoryUsage`의 `--session -1`은 명시적인 전역 대상이다 → `exec --client-scope -- … --session -1`로 넘기고, 결과의 session을 정리 대상으로 삼지 않는다.

reload:

- 같은 화면의 재검증은 `Page.reload`로 한다. 화면·tree가 비었거나 명령이 실패해도 대체 Card를 열지 않고 같은 session에서 원인을 찾는다.
- reload 뒤에는 같은 ID가 목록에 남았는지, DOM·console·load event 또는 실제 화면으로 로딩 결과를 확인한다. snapshot ref가 무효화되면 snapshot을 다시 얻는다.
- `Page.reload`의 `url`에는 HTTP(S) bundle URL을 쓴다. `list-sessions`의 URL은 바뀌지 않을 수 있으므로 URL 문자열 변화로 성공을 판정하지 않는다.
- 요청 범위의 다른 시나리오는 점유한 Card 안에서 탐색하거나 reload한다. 다른 작업의 bundle을 이 Card에 덮어쓰지 않는다. 새 Card가 꼭 필요하면 `release` 뒤 다시 `acquire`·`open`한다.

완료 조건: 고정한 session에서 대상 장면과 요청한 사용자 결과의 증거를 확보했다. session 소실·ID 변경을 발견하면 최신 session으로 갈아타지 않고 멈춘다.

## 5. 성공·실패 모두 정리 후 해제

```bash
$CARD release --client "$CLIENT_ID"
```

정리는 검증의 마지막 필수 단계다. 명령이나 검증이 실패해도 실행한다.

- 스크립트는 host의 `debugRouterId`가 기록과 같은지 확인하고 소유 session만 닫는다. open 뒤 session을 확정하지 못한 기록이면 같은 baseline·URL 기준으로 다시 찾아, 하나면 닫고 없으면 Card가 없다고 본다.
- 닫기는 PlayLynx에서 확인한 임시 경로 `lynx.getNativeApp().nativeModuleProxy.NavigationModule.close()`를 소유 session의 `evaluate`로 실행한다. `App.closePage`는 PlayLynx가 `not implemented`를 반환한다. 다른 host나 버전에서는 이 경로가 실패할 수 있다.
- 완료 조건은 성공한 목록 조회에서 소유 session ID가 사라진 것이다. 스크립트가 최대 30초 동안 다시 조회한다. 목록 조회 실패·client 소실은 빈 목록으로 보지 않는다.
- 제거를 확인하면 잠금을 지우고 `released`와 닫은 `closedSessionId`를 준다. 이미 사라진 session은 정리된 것으로 본다.
- 정리하지 못하면 잠금과 기록을 유지하고 `error`를 남긴다. 다른 창 닫기나 app 전체 종료로 대신하지 않는다.
- 이번 작업에서 직접 실행한 host app(예: LynxExplorer)을 종료해 Card를 정리했으면 `release --host-terminated`를 쓴다. 기록한 `debugRouterId`의 host가 목록에서 사라졌을 때만 해제한다. 원래 실행 중이던 앱은 종료하지 않는다.

## 막혔을 때

`blocked`의 `reason`에 따라 다음만 한다. 잠금 디렉터리를 직접 지우지 않는다.

- 다른 owner가 잠금을 유지함: 그 client의 온라인 검증을 `환경 차단`으로 보고한다. 출력의 `holder`(owner·state·heartbeatAt)를 함께 적는다.
- 이전 규약의 잠금: 기록의 owner·작업에 확인하거나 사람에게 정리를 요청한다. 회수하지 않는다.
- open 뒤 session을 확정하지 못함: 다시 open하지 않고 `release`를 실행한다. `release`도 후보가 여럿이라 막히면 baseline·후보 목록을 보고하고 잠금을 유지한다.
- session이 목록에서 사라지지 않음(종료 실패): 추가 open을 멈추고 client·session·잠금 경로·종료 결과를 보고한다. 사람이 Card를 닫은 뒤 `release`를 다시 실행한다. 보고 없이 떠나도 TTL 뒤 다음 `acquire`가 같은 기준으로 다시 정리를 시도하며, 그때도 남아 있으면 그 작업이 같은 사유로 막힌다.
- host가 목록에 없거나 바뀜: app 재시작으로 같은 client ID가 다른 host를 가리킬 수 있다. 남은 Card를 확인할 수 없으므로 사람에게 확인을 요청한다.
- 이 owner의 잠금이 아님: 만료로 다른 owner가 회수했을 수 있다. 조작을 멈추고 `status`를 확인한다.

## 잠금의 효력

잠금은 이 절차를 따르는 에이전트 사이의 점유 규약이다. 잠금을 획득한 owner만 기록된 client/session 쌍을 조작한다. 파일 잠금이 다른 호출자의 CLI 명령이나 사람이 연 Card까지 막는다고 보고하지 않는다.
