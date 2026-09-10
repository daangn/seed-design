---
name: seed-verify-lynx-component
description: Lynx 컴포넌트의 문서·예제·런타임 결과를 환경별로 검증할 때 사용한다.
---

# Lynx 컴포넌트 검증

현재 worktree의 한 Lynx 컴포넌트와 관련 문서·실행 예제를 검증한다. 결과는 어떤 환경에서 무엇을 직접 확인했는지와 미확인 범위를 분리한 기록이다. [`seed-orchestrate-component`](../seed-orchestrate-component/SKILL.md)를 통한 협업에서는 구현자와 독립된 검증 담당이 기본 장면과 최종 결과를 확인한다. 구현자의 요약·API 리뷰·작업 종료는 승인 근거가 아니다.

## 범위와 경계

- 한 번에 한 컴포넌트와 요청된 시나리오·변경 표면을 대상으로 한다. 새 컴포넌트나 전체 동등성 주장은 모든 관련 시나리오를 포함한다.
- 대상 경로의 package 공개 export·Recipe·문서 예제·`examples/lynx-spa` 소비 경로·필요한 생성물만 읽기 전용으로 확인한다. 원천 파일의 존재만으로 통과시키지 않는다.
- React와 Lynx가 같은 사용자 결과를 주장하는 시나리오는 내용 단위로 비교한다. 브라우저, native bundle, 로컬 Lynx 런타임, 실제 기기의 결과를 서로 합치지 않는다.
- 검증자는 컴포넌트·문서 소스를 수정하지 않는다. 문제가 발견되면 원인과 수정 범위를 보고한다.
- 협업에서는 통합 담당이 넘긴 변경본 식별 정보와 bundle을 확인한다. 후속 수정이 있으면 영향받은 항목을 `미확인`으로 되돌린다. [검증 분담과 자원](../seed-orchestrate-component/references/collaboration.md#검증-분담과-자원)에 따라 공유 서버·host app·기기·전역 overlay·캡처 자원별 조작 소유자를 정한다. 조율자는 결과를 통합·승인하며, 모든 검사를 직접 실행하지 않는다.
- 기존 서버·사용자 session·사용자 변경을 임의로 종료·되돌리지 않는다. `examples/lynx-spa` 서버를 새로 시작·재시작·중지하는 일은 그 host 소유자만 한다.

문서와 예제를 작성하거나 수정하는 요청이면 [`seed-write-lynx-component-docs`](../seed-write-lynx-component-docs/SKILL.md)를 사용한다. 이 스킬은 실행 가능한 기본 장면부터 적용하고, 나머지 범위를 구현한 뒤 최종 검증에도 사용한다.

## 함께 사용하는 스킬

검증 목적에 따라 필요한 스킬만 사용한다.

- [`seed-component-map`](../seed-component-map/SKILL.md): 실제 package, Recipe, 공개 export, 문서 예제와 SPA 소비 경로 확인
- [`seed-api-parity`](../seed-api-parity/SKILL.md): React와 Lynx의 공개 API, 상태, 이벤트, 접근성 차이 확인
- `lynx-api-docs`: Lynx element, layout, API 동작 확인
- `lynx-check-css-support`: CSS 속성·값의 backend와 Engine 버전 확인
- `lynx-devtool`: 사용할 수 있을 때 DOM, layout, console, screenshot 증거 보강
- `analyze-video-frames`: transition과 첫 렌더링의 시간축 분석

공통 실행 절차와 런타임 증거 수집은 [검증 런북](references/verification.md)을 읽고 따른다. `agent-lynx` CLI가 기본 경로이며, DevTool MCP는 사용할 수 있을 때만 보강한다. 둘 다 사용할 수 없으면 가능한 정적 확인만 하고 native 결과는 `환경 차단`으로 남긴다.

## 검증 흐름

### 1. 대상·소비 경로·필수 환경 고정

대상 컴포넌트·시나리오·기대 결과와 이번 변경에 필요한 환경만 기록한다. 대상 경로·공개 소비 경로가 불명확할 때만 `seed-component-map`을 사용하고, 공개 API 차이가 검증 대상일 때만 `seed-api-parity`를 사용한다.

- 문서 URL, React 예제와 Lynx 예제 ID, SPA query ID `lynx/<component>/<scenario>`
- package 공개 export에서 예제까지 이어지는 실제 소비 경로
- 변경한 사용자 결과와 기대 결과
- 필수·선택 환경과 사용할 수 없는 경우의 처리

원래 요청·참조 화면·시나리오를 직접 받아 [관찰 가능한 결과 판정](../seed-create-component/references/verification-checklist.md#관찰-가능한-결과-판정)으로 승인 조건을 고정한다. 구현자의 지원 목록이나 완료 요약에서 기대 결과를 역으로 만들지 않는다. 기본 장면의 통과와 요청 범위 전체의 통과를 구분한다.

문구·코드 노출만 바뀐 작업은 내용·링크·형식을 확인하고, 문서 페이지의 렌더링을 바꾼 경우에만 브라우저를 사용한다. native 동작을 새로 주장하거나 실행 결과가 바뀐 작업은 `examples/lynx-spa`를 로컬 Lynx 런타임 또는 실제 host app에서 실행한다. PlayLynx의 query 선택처럼 host의 page URL에 의존하는 경로를 바꾸면 해당 host에서 직접 확인한다.

새 컴포넌트·공개 package·Registry·생성물이 포함되거나 native 동작·bundle 실행 결과가 바뀌면, 런타임 버전과 변경 전 기준 결과를 현재 결과와 분리해 기록한다. 기준 결과가 없으면 `미확인`으로 남긴다. 기본 native 장면의 선행조건이나 최종 의무로 docs build·manifest·정적 serve를 넣지 않는다.

### 2. React↔Lynx 시나리오와 SPA 선택 대응 확인

새 시나리오, 사용자 결과 변경, 전체 동등성 요청에는 React와 Lynx 문서·예제를 대조한다. 이미 알려진 단일 시나리오의 국소 변경은 그 대응 파일만 대조한다. 제목이 같은지만으로 동등하다고 판정하지 않는다.

| 항목 | React | Lynx / SPA | 판정 | 근거 |
| --- | --- | --- | --- | --- |
| 문서 섹션·예제 ID | 제목·순서·논리 ID | `lynx/<component>/<scenario>` | 동일·변환·미지원 | MDX·예제 entry·SPA 목록 |
| 사용자 결과 | asset·frame·초기 상태·보조 요소 | 대응 값 | 동일·변환·미지원 | package import·JSX·runtime |
| 입력·전이 | click·callback·중간·최종 상태 | bindtap·공개 callback·대응 상태 | 동일·Lynx식 변환·미지원 | handler·runtime |
| 화면 셸 | AppScreen·AppBar·하단 CTA | native layout·하단 CTA | 동일·변환·미지원 | SPA runtime |

판정은 `동일 지원`, `Lynx식 변환`, `미지원` 중 하나로 남긴다. `미지원`은 실행하는 척하지 않고 문서에 제한과 대안을 적는다.

query 없이 연 SPA에서는 `홈 → 문서 예제 → 컴포넌트 → 시나리오` 순서로 문서 예제를 선택한다. `example=lynx/<component>/<scenario>` 직접 진입에서는 로딩 후 대상 장면과 화면의 정확한 소스 경로를 확인한다. query가 적용되지 않아 홈이 계속 보이면 통과로 처리하지 않는다. SPA 진입·탐색을 바꾼 경우에는 없는 ID의 오류 화면과 `컴포넌트 목록 → 홈` 뒤로 가기도 검증한다.

### 3. 공개 소비 경로와 bundle 연결 확인

이번 변경에 포함된 package 공개 export, Registry, doc-gen, 예제 entry 또는 bundle은 같은 컴포넌트·시나리오를 가리켜야 한다. 필요할 때만 연결을 확인한다.

```text
package public export → SPA example import → lynx/<component>/<scenario> → main.lynx.bundle?example=…
```

공개 이름·논리 ID·예제 import·SPA 목록·실행한 query가 일치하는지 확인한다. Registry·문서 index·manifest는 그 표면을 실제로 변경하거나 문서 인프라를 검증할 때만 확인한다. bundle 파일명·URL·생성물 경로는 추측하지 않고 SPA 개발 서버 로그의 실제 `main.lynx.bundle` URL을 사용한다.

### 4. 실행과 증거 수집

변경한 표면과 필수 환경에 맞는 [검증 런북](references/verification.md) 항목만 선택한다. 기본 native 경로는 `examples/lynx-spa`를 열고 문서 예제를 선택하거나 `example` query로 직접 진입하는 것이다. bundle URL·딥 링크·새 client/session 식별·뒤로 가기·없는 ID 확인은 런북의 순서를 따른다.

정적 문서의 MDX·코드 탭·QR·Web preview·docs build pipeline 자체를 변경했을 때만 문서 인프라 검증을 추가한다. 이 조건은 native 컴포넌트 검증의 선행조건도, 단순 컴포넌트 변경의 최종 의무도 아니다.

같은 host process·창·전역 overlay·캡처 자원은 session ID가 달라도 소유자가 순서대로 조작한다. 각 장면의 증거를 수집한 뒤 그 검사에서 연 menu·overlay를 닫고 상태를 정리한 후 다음 장면을 시작한다. 브라우저 미리보기만으로 실제 Lynx 결과를 주장하지 않는다.

### 5. 시각적 동등성 통과 조건

같은 사용자 결과를 주장하는 React·Lynx 예제에는 [검증 런북의 시각적 동등성 판정](references/verification.md#시각적-동등성-판정)을 적용한다. viewport·frame·상호작용·asset 증거와 통과 조건은 해당 항목을 따른다.

## 판정과 보고

각 시나리오와 환경에 다음 상태 중 하나만 부여한다.

| 상태 | 의미 |
| --- | --- |
| 통과 | 해당 환경에서 기대 결과를 직접 확인함 |
| 실패 | 기대 결과와 실제 결과의 차이를 재현함 |
| 환경 차단 | 도구, 버전, 주소, 네트워크 때문에 확인을 시작할 수 없음 |
| 미확인 | 확인할 수 있었지만 아직 실행하지 않음 |

공개 소비 경로 연결과 실행 환경은 별도 표로 구분한다. 검증 시작 전에 정한 필수 환경만 전체 완료 여부에 반영한다.

- 필수 항목이 모두 `통과`면 전체 `완료`다.
- 필수 항목에 `실패`가 있으면 전체 `실패`다.
- 필수 항목에 `환경 차단` 또는 `미확인`이 있으면 전체 `미완료`다.
- 선택 환경의 `환경 차단` 또는 `미확인`은 전체를 막지 않지만 보고서에 남긴다.

최종 보고에는 대상 컴포넌트·시나리오, React↔Lynx 대응과 공개 소비 경로, 환경별 기대·실제 결과, 실제 bundle URL과 query, client·session·screenshot·console·layout 증거(사용한 경우), 발견 사항의 재현 단계·수정 범위, 미검증 환경·정확한 차단 사유를 포함한다.

다른 담당에게 넘길 때는 `변경본 식별자 → 실행 명령/시나리오 → 판정과 기대·실제 결과 → 증거 → 실패 원천·영향 범위` 순서로 짧게 인계한다. 직접 시작한 서버·브라우저·DevTool session만 그 수명 소유자가 정리하며, 인계에서 참조하는 증거는 수신자가 읽을 수 있는 경로에 보존한다.
