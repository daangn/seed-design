# SEED Lynx commit 계측

컴포넌트 변경으로 commit 횟수나 처리 시간이 줄었다고 판단할 때 사용한다. 계측은 [community-lynx PR #1071](https://github.com/karrot-emu/community-lynx/pull/1071)의 `commit-probe.ts`와 `commit-log.ts`를 기반으로 한다. 계측 코드와 fixture는 [별도 번들](../assets/commit-probe/)에 둔다.

## 번들 준비

`seed-design-lynx`의 설치된 ReactLynx와 Rspeedy를 그대로 사용한다. 스크립트는 기존 playground 소스와 설치를 수정하지 않고 새 디렉터리에 번들을 만든다. fixture는 탭 목록, 눌림, 이미지 로딩과 값·레이아웃 변경을 실행할 수 있다.

```sh
probe_dir=$(mktemp -d /tmp/seed-commit-probe.XXXXXX)
bash skills/seed-verify-lynx-component/scripts/build-commit-probe.sh ../seed-design-lynx HEAD "$probe_dir/baseline"
bash skills/seed-verify-lynx-component/scripts/build-commit-probe.sh ../seed-design-lynx working-tree "$probe_dir/changed"
```

기준 ref는 styled 패키지와 Tabs·Image·AppBar·TextField·SegmentedControl headless 원천을 고정한다. 공유 headless 패키지와 CSS는 양쪽 모두 같은 checkout에서 불러온다. 공유 경로의 변경을 측정하는 경우 해당 원천도 버전별로 고정한다. build 로그의 파일과 SHA-256, fixture, ReactLynx 버전과 실제 `SystemInfo.engineVersion`을 기록한다.

## 실행

1. 생성된 번들을 로컬 HTTP로 제공한다. [Card 수명 규칙](concurrency/session-ownership.md)에 따라 소유한 session에서만 열고, 전후 교차 실행에는 그 session을 재사용한다.
2. Background evaluate로 `JSON.stringify(globalThis.__seedCommitProbe)`를 읽어 `source`, `reactLynx`, `engine`, `hasBridge`, `hasObserver`를 확인한다. 선택 변경처럼 native mutation이 있는 대조 동작으로 bridge가 실제 호출을 포착하는지 확인한다. Snapshot의 `rLynxChange`를 거치지 않는 렌더링 경로를 측정할 때는 해당 런타임의 전송 지점을 따로 확인한다.
3. 같은 session에서 아래 표현식을 evaluate한 뒤 `JSON.stringify(globalThis.__probeResult ?? null)`을 반복해서 읽는다. `"tabs"` 또는 `"chip-tabs"`, 동작은 `"mount"`, `"select"`, `"rerender"`를 사용한다.

   ```js
   globalThis.__probeResult = null;
   globalThis.__seedCommitProbe.run("tabs", "mount", 5, 350).then(
     (result) => { globalThis.__probeResult = result; },
     (error) => { globalThis.__probeResult = { error: String(error) }; },
   );
   "started";
   ```

4. 같은 host, fixture, 동작 및 반복 수를 유지해 전후를 교차 측정한다. 소유 session을 정리하고 원자료를 남긴다.

## 이미지·Checkbox 시나리오

- 이미지 로딩은 `run("avatar", "mount", 5, 600, imageUrl)` 또는 `run("image-frame", "mount", 5, 600, imageUrl)`로 잰다. 같은 로컬 HTTP 서버에서 정상 PNG와 디코딩할 수 없는 응답을 각각 제공한다. 반복마다 8개의 `loaded` 또는 `error` 상태가 도착했는지 `statuses`에서 확인한다. 정상 로드에서 fallback이 사라지고 실패에서 남는지 native DOM으로 확인한다.
- Checkbox·Switch·ReactionButton과 AttachmentDisplay·AttachmentInput의 ItemActionButton은 `await __seedCommitProbe.preparePress("switch")`처럼 장면을 준비한다. 장면 ID는 각각 `checkbox`, `switch`, `reaction-button`, `attachment-display`, `attachment-input`이다. `reset()` 뒤 native press 이벤트를 수행하고 `capture()`의 `touches`, 전체 호출, empty patch를 기록한다. 탭을 완료할 때는 실제 터치 전달과 접근성 선택 상태 또는 콜백을 확인한다. 첨부 액션의 fixture 콜백은 소비자 상태를 갱신하지 않는다.
- `await __seedCommitProbe.prepareState("app-bar")`로 상태 장면을 준비하고, `reset()`과 `updateState()`를 호출해 commit을 센다. AppBar는 작은 쪽 슬롯의 너비를 바꿔 제목 padding이 그대로인지 확인한다. `field-focus`는 Field 아래 TextField의 focus 값을 바꾸고, `segment-registration`은 SegmentedControl의 항목 등록·해제를 반복한다. `slider-values`는 눈금 20개를 유지한 채 제어 값을 바꾸고 native range 너비도 확인한다. 이 장면들은 상태 입력을 직접 실행한다.

## 판정

- `updates[].count`로 각 동작의 `rLynxChange` 호출 수를 센다. empty, non-empty, 판별 불가, hydration 여부와 payload 바이트도 같이 남긴다. `emptySource`는 런타임의 명시적 플래그(`flag`)와 구버전 payload로부터 판별한 결과(`payload`)를 나타낸다. `roundTripMs`는 bridge 콜백까지 걸린 시간이다. 미완료 콜백은 `-1`로 기록한다.
- `pipelineEntries`는 timing flag가 붙은 pipeline record 수다. `pipeline.count`는 모든 단계 timestamp가 있는 표본 수다. `diff`, `pack`, `wait`, `parse`, `patch`, `resolve`, `layout`, `flush`, `frame`, `total`의 median·p95·max를 같이 본다. `pipeline: null`은 완전한 표본이 없음을 뜻한다.
- flag의 업데이트가 별도 native patch를 만들 수 있으므로 동일 fixture의 전후 차이를 비교한다. timing flag가 없는 추가 commit과 empty patch는 pipeline 집계에 빠질 수 있으므로 전체 호출 수는 항상 bridge 기록으로 판정한다.
- 첫 진입 모양, 선택·접근성 상태, 실제 탭 동작은 기존 native 검증으로 확인한다. 별도 결과가 필요하면 실제 서비스 화면에서도 같은 동작을 재현한다.
