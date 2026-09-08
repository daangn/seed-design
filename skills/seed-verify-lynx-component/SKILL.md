---
name: seed-verify-lynx-component
description: Lynx 컴포넌트의 문서·예제·런타임 결과를 환경별로 검증할 때 사용한다.
---

# Lynx 컴포넌트 검증

현재 worktree의 한 Lynx 컴포넌트와 관련 문서·실행 예제를 검증한다. 결과는 구현 성공 여부가 아니라 어떤 환경에서 무엇을 직접 확인했는지와 아직 확인하지 못한 범위를 분리한 검증 기록이다. [`seed-orchestrate-component`](../seed-orchestrate-component/SKILL.md)를 통한 협업에서는 구현자와 독립된 최종 검증 담당이 이 스킬을 소유한다. 검증자는 소스를 수정하지 않고, 담당자의 작업 종료나 생성 명령 성공을 전체 완료로 판정하지 않는다.

## 범위와 경계

- 한 번에 한 컴포넌트와 요청된 시나리오·변경 표면을 대상으로 한다. 새 컴포넌트나 전체 동등성 주장은 모든 관련 시나리오를 포함한다.
- 대상 경로에 존재하는 소스, Recipe, 문서, Registry, 생성물, 예제, bundle 연결만 읽기 전용으로 확인한다.
- React와 Lynx가 같은 사용자 결과를 주장하는 시나리오는 내용 단위로 비교한다.
- 브라우저, native bundle, 로컬 Lynx 런타임, 실제 기기의 결과를 서로 합치지 않는다.
- 컴포넌트나 문서의 소스는 수정하지 않는다. 문제가 발견되면 원인과 수정 범위를 보고한다.
- 협업에서는 통합 담당이 넘긴 변경본 식별 정보·manifest·bundle을 먼저 확인하고, 후속 수정이 있으면 영향을 받은 검증 항목을 `미확인`으로 되돌린다. 검증 서버와 기기 session은 이 담당이 단독으로 소유한다.
- 빌드가 만드는 ignored 산출물, 직접 시작한 `npx serve` 프로세스, 검증 중인 런타임 상태 변경은 허용한다. 실행 전후 `git status --short`를 비교하고 새 tracked 변경이 생기면 검증 결과에 남긴다. 사용자가 만든 변경을 되돌리지 않는다.

문서와 예제를 작성하거나 수정하는 요청이면 [`seed-write-lynx-component-docs`](../seed-write-lynx-component-docs/SKILL.md)를 사용한다. 이 스킬은 작성이 끝난 결과의 검증에 사용한다.

## 함께 사용하는 스킬

검증 목적에 따라 필요한 스킬만 사용한다.

- [`seed-component-map`](../seed-component-map/SKILL.md): 실제 package, Recipe, 구현, Registry, 문서, 예제 경로 확인
- [`seed-api-parity`](../seed-api-parity/SKILL.md): React와 Lynx의 공개 API, 상태, 이벤트, 접근성 차이 확인
- `lynx-api-docs`: Lynx element, layout, API 동작 확인
- `lynx-check-css-support`: CSS 속성·값의 backend와 Engine 버전 확인
- `lynx-devtool`: Lynx 런타임의 DOM, layout, console, screenshot 확인
- `analyze-video-frames`: transition과 첫 렌더링의 시간축 분석

공통 실행 절차와 런타임 증거 수집은 [검증 런북](references/verification.md)을 읽고 따른다. 해당 스킬이 현재 환경에 제공되지 않으면 적용할 수 있는 범위만 확인하고 결과에 제한을 남긴다.

## 검증 흐름

### 1. 검증 대상과 필수 환경 고정

대상 컴포넌트·시나리오·기대 결과와 이번 변경에 필요한 환경만 기록한다. 대상 경로·소비 경로가 불명확할 때만 `seed-component-map`을 사용하고, 공개 API 차이가 검증 대상일 때만 `seed-api-parity`를 사용한다.

- 문서 URL과 React·Lynx 예제 ID
- 변경한 사용자 결과와 기대 결과
- 필수 환경과 선택 환경, 사용할 수 없는 경우의 처리

문구·코드 노출만 바뀐 작업은 문서 브라우저를 필수 환경으로 삼는다. native 동작을 새로 주장하거나 실행 결과가 바뀐 작업은 로컬 Lynx 런타임 또는 실제 host app을 필수 환경으로 추가한다. 실제 기기 확인을 요청받지 않았다면 선택 환경으로 남긴다.

새 컴포넌트·공개 package·Registry·생성물이 포함되면 `seed-change-plan`을 사용한다. 이 경우와 기존 컴포넌트의 native 동작·bundle 실행 결과가 바뀌는 경우에는 [검증 런북의 사전 점검](references/verification.md#1-사전-점검)에 따라 docs examples·host app의 런타임 버전과 변경 전 기준 빌드 결과를 기록한다. 기준 빌드가 없으면 현재 결과와 분리해 `미확인`으로 남긴다.

### 2. React↔Lynx 시나리오 대응 확인

새 시나리오, 사용자 결과 변경, 전체 동등성 요청에는 React와 Lynx 문서·예제를 대조한다. 이미 알려진 단일 시나리오의 국소 변경은 그 대응 파일만 대조한다. 제목이 같은지만으로 동등하다고 판정하지 않는다.

| 항목 | React | Lynx | 판정 | 근거 |
| --- | --- | --- | --- | --- |
| 문서 섹션·예제 ID | 제목·순서·논리 ID | 대응 값 | 동일·변환·미지원 | MDX·entry 경로 |
| 사용자 결과 | asset·frame·초기 상태·보조 요소 | 대응 값 | 동일·변환·미지원 | import·JSX·runtime |
| 입력·전이 | click·callback·중간·최종 상태 | bindtap·공개 callback·대응 상태 | 동일·Lynx식 변환·미지원 | handler·runtime |
| 화면 셸 | AppScreen·AppBar·하단 CTA | AppBar·native layout·하단 CTA | 동일·변환·미지원 | JSX·runtime |

판정은 `동일 지원`, `Lynx식 변환`, `미지원` 중 하나로 남긴다. `미지원`은 실행하는 척하지 않고 문서에 제한과 대안을 적는다.

### 3. 생성물 연결 확인

Registry, doc-gen, 예제 entry, manifest, bundle이 이번 변경의 소비 경로에 포함될 때만 같은 컴포넌트·시나리오가 연결되는지 확인한다. 원천 파일의 존재만으로 통과시키지 않는다.

```text
Registry source → Registry JSON
MDX + doc-gen entry → 문서 index
예제 entry → manifest → Web bundle / native bundle
```

해당 경로에서 공개 이름·논리 ID·entry·manifest·bundle·Recipe 생성물의 일치와 untracked 문서·생성물 누락을 확인한다. 실제 bundle 출력·manifest·`.html` 경로는 추측하지 말고 파일에서 확인한다. bundle을 실행하거나 브라우저를 열 때는 [검증 런북](references/verification.md)의 URL 조립 규칙을 사용한다.

### 4. 실행과 증거 수집

변경한 표면과 필수 환경에 맞는 [검증 런북](references/verification.md) 항목만 선택한다. 정적 문서·bundle 브라우저 확인, `lynx://open?url=`, DevTool DOM·layout·computed style·console·screenshot, 시간축 검증은 각각 해당 결과를 주장하거나 변경했을 때 실행한다.

브라우저 미리보기만으로 실제 Lynx 결과를 주장하지 않는다. native bundle, 로컬 Lynx 런타임, 실제 기기는 각각 별도 증거 행으로 기록한다.

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

생성물 연결과 실행 환경은 별도 표로 구분한다. 검증 시작 전에 정한 필수 환경만 전체 완료 여부에 반영한다.

- 필수 항목이 모두 `통과`면 전체 `완료`다.
- 필수 항목에 `실패`가 있으면 전체 `실패`다.
- 필수 항목에 `환경 차단` 또는 `미확인`이 있으면 전체 `미완료`다.
- 선택 환경의 `환경 차단` 또는 `미확인`은 전체를 막지 않지만 보고서에 남긴다.

최종 보고에는 다음을 포함한다.

1. 대상 컴포넌트와 시나리오
2. 대상 React↔Lynx 대응 및 해당 생성물 연결 결과
3. 환경별 상태와 직접 확인한 기대·실제 결과
4. bundle URL, 문서 URL, client·session, screenshot·console·layout 증거 경로(사용한 경우)
5. 발견 사항의 재현 단계와 수정 범위
6. 미검증 환경과 정확한 차단 사유
7. 실행한 검증과 결과

검증이 끝나면 직접 시작한 서버, 브라우저 세션, DevTool 세션, 임시 증거 파일을 정리한다. 기존에 실행 중이던 서버나 사용자 세션은 임의로 종료하지 않는다.
