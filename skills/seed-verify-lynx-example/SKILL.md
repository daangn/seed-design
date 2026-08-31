---
name: seed-verify-lynx-example
description: SEED Design 저장소의 Lynx 문서 예제 하나를 entry, manifest, WebLynx·native bundle에 연결하고 실제 실행 근거를 수집한다. LynxComponentExample의 번들 준비 상태, WebLynx와 실제 Lynx 결과 분리, Lynx Explorer·PlayLynx client/session 선택, DOM·style·box·screenshot 확인에 사용한다. 문서나 예제 작성 자체는 다루지 않는다.
---

# Lynx 예제 검증

한 예제의 정적 경로를 먼저 확정한 뒤 WebLynx와 실제 Lynx를 따로 확인한다. 번들이 있다는 사실은 런타임 동작 근거가 아니다.

## 대상 해석

저장소 안에서 컴포넌트 이름이나 정확한 예제 ID 하나를 지정한다.

```bash
bun skills/seed-verify-lynx-example/scripts/resolve-example.ts lynx/tabs/layout
```

컴포넌트 이름도 받을 수 있다.

```bash
bun skills/seed-verify-lynx-example/scripts/resolve-example.ts Tabs
```

결과 JSON은 다음 정보를 현재 체크아웃에서 읽는다.

- `target`: 정확한 예제 ID와 탐색 상태
- `entry`: `docs/examples/lynx/<component>/<scenario>.tsx`
- `manifest`: `docs/public/__lynx__/manifest.json`의 연결 상태
- `bundles.web`: WebLynx bundle 경로와 존재 여부
- `bundles.native`: native `.lynx.bundle` 경로와 존재 여부
- `build`: 번들 생성 필요 여부와 명령
- `runtimeEvidence`: 환경별 준비 상태와 아직 수집해야 할 근거

`target.state`가 `ambiguous`면 `candidates`에서 정확한 ID를 고르도록 사용자에게 요청한다. 첫 후보를 임의로 선택하지 않는다. `not-found`면 예제 ID나 entry를 다시 확인한다.

## 번들 준비

`build.required`가 `true`면 실행 전에 사용자의 확인을 받는다. 빌드는 무시된 `docs/public/__lynx__` 산출물을 갱신한다.

```bash
bun --filter @seed-design/docs build:lynx-examples
```

빌드 후 resolver를 다시 실행한다. `manifest.state`가 `matched`이고 검사할 bundle의 `state`가 `ready`일 때만 런타임 확인으로 넘어간다.

## WebLynx 확인

WebLynx는 문서의 `LynxComponentExample`에서만 확인한다. 문서 개발 서버나 `docs/out`의 실제 페이지를 사용하고 독립 HTML이나 임시 앱을 만들지 않는다.

다음 중 실제로 확인한 항목만 기록한다.

- 문서 페이지와 `LynxComponentExample` 주소
- 로드된 web bundle 경로
- 화면 구조와 필요한 상호작용 결과
- 브라우저 콘솔 오류

WebLynx 결과로 native Lynx 동작을 통과 처리하지 않는다.

## 실제 Lynx 확인

런타임 연결에는 `lynx-devtool` 스킬을 사용한다. LynxView에 CDP 명령을 보내기 전에 그 스킬의 지원 메서드 문서를 읽는다.

1. `bundles.native`의 manifest URL을 기기에서 접근 가능한 HTTP(S) origin과 결합한다. 실기기에는 `localhost`나 `127.0.0.1` 주소를 주지 않는다.
2. 연결된 client를 조회한다. Lynx Explorer나 PlayLynx 후보가 여러 개면 정확한 client ID를 사용자에게 요청한다.
3. 확정한 client의 기존 session을 조회한다. 같은 bundle URL과 정확히 일치하는 Lynx session이 하나일 때만 사용한다.
4. 기존 session이 없으면 `App.openPage`나 다른 페이지를 임의로 실행하지 않는다. bundle URL을 수동으로 연 뒤 다시 조회하도록 안내한다.
5. session이 여러 개이고 URL로 하나를 확정할 수 없으면 정확한 session ID를 요청한다.
6. 기존 session을 다른 bundle로 다시 불러와야 하면 먼저 사용자 확인을 받는다. client ID와 session ID를 모두 명시하고 `Page.reload`를 사용한다. reload 뒤 session 목록의 URL은 갱신이 보장되지 않으므로 대상 URL 확인에 사용하지 않는다.
7. 요청한 동작을 입증하는 최소 항목만 확인한다. DOM, 계산 스타일, box, screenshot을 전부 의무로 수집하지 않는다.

client나 session을 찾지 못한 상태는 `manual-required`로 보고한다. 정적 준비가 끝났더라도 실제 Lynx 동작을 확인했다고 쓰지 않는다.

## 근거 기록

결과에는 환경을 나눠 다음 정보를 남긴다.

- 정적 근거: entry, manifest, 사용한 web 또는 native bundle 경로
- WebLynx 근거: 문서 URL과 직접 관찰한 결과
- Lynx 근거: 정확한 client ID와 session ID, 관찰한 session URL, `Page.reload`에 전달한 target URL과 성공 응답, 확인한 DOM·style·box·screenshot
- 미수행 항목: 기기나 session 부재, 사용자 확인 대기, DevTool 미지원 기능

session URL은 관찰값이며 reload target을 증명하지 않는다. 스크린샷은 원문 데이터를 결과에 붙이지 말고 에이전트가 관리하는 임시 파일 경로로 남긴다. 실제로 얻지 못한 DOM, style, box, screenshot은 근거 목록에서 제외한다.
