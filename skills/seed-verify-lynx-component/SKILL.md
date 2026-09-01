---
name: seed-verify-lynx-component
description: SEED Lynx 컴포넌트의 React↔Lynx 예제 대응, 생성물 연결, 정적 문서 미리보기, 시간축 동작, Lynx 런타임 결과를 검증하고 환경별 증거를 분리해 보고한다. 문서나 컴포넌트 소스는 수정하지 않는다.
---

# Lynx 컴포넌트 검증

현재 worktree의 한 Lynx 컴포넌트와 관련 문서·실행 예제를 검증한다. 결과는 구현 성공 여부가 아니라 어떤 환경에서 무엇을 직접 확인했는지와 아직 확인하지 못한 범위를 분리한 검증 기록이다.

## 범위와 경계

- 한 번에 한 컴포넌트를 대상으로 한다.
- 소스, Recipe, 문서, Registry, 생성물, 예제, bundle의 연결을 읽기 전용으로 확인한다.
- React와 Lynx가 같은 시나리오를 제공하는지 내용 단위로 비교한다.
- 브라우저, native bundle, 로컬 Lynx 런타임, 실제 기기의 결과를 서로 합치지 않는다.
- 컴포넌트나 문서의 소스는 수정하지 않는다. 문제가 발견되면 원인과 수정 범위를 보고한다.
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

다음 정보를 먼저 기록한다.

- 대상 컴포넌트, 문서 URL, React·Lynx 예제 ID
- 검증할 시나리오와 각 시나리오의 기대 결과
- 필수 환경: 문서 브라우저, 로컬 Lynx 런타임, 실제 기기 중 해당 작업에서 요구하는 범위
- 선택 환경과 환경을 사용할 수 없는 경우의 처리

문구·코드 노출만 바뀐 작업은 문서 브라우저를 필수 환경으로 삼는다. native 동작을 새로 주장하거나 실행 결과가 바뀐 작업은 로컬 Lynx 런타임 또는 실제 host app을 필수 환경으로 추가한다. 실제 기기 확인을 요청받지 않았다면 선택 환경으로 남긴다.

새 컴포넌트, 공개 package, Registry, 생성물이 포함되면 `seed-change-plan`으로 target branch와 release lane을 확인한다. docs examples와 host app의 `@lynx-js/react`, React plugin, Rspeedy 버전도 비교한다. 변경 전 기준 빌드를 확보하지 못하면 그 사실을 `미확인`으로 기록하고 현재 결과와 섞지 않는다.

### 2. React↔Lynx 시나리오 대응 확인

`seed-component-map`과 `seed-api-parity`의 결과를 실제 문서와 예제 파일에 대조한다. 제목이 같은지만으로 동등하다고 판정하지 않는다.

| React 시나리오 | Lynx 시나리오 | 판정 | 확인할 내용 | 근거 |
| --- | --- | --- | --- | --- |
| 섹션·예제 제목 | 섹션·예제 제목 | 동일 지원·변환·미지원 | 제목과 순서 | 문서 경로 |
| 예제 파일 | 예제 파일 | 동일 지원·변환·미지원 | 논리 ID와 import 경로 | entry·manifest |
| 항목 데이터 | 항목 데이터 | 동일·차이 | 개수, 순서, label, description, footer | 예제 소스 |
| 상태 | 상태 | 동일·차이 | 초기값, 선택 항목, 상태 출력, disabled | 예제 소스·API |
| 시각 표현 | 시각 표현 | 동일·변환·미지원 | suffix, icon, tone, layout, columns, 줄바꿈 | Recipe·실행 결과 |

판정은 다음 세 가지 중 하나로 남긴다.

- `동일 지원`: 목적과 사용자가 보는 결과를 유지한다.
- `Lynx식 변환`: 사용자 결과는 유지하고 element, event, accessibility, CSS 또는 import만 바꾼다.
- `미지원`: 실행하는 척하지 않고 문서에 제한과 대안을 적는다.

### 3. 생성물 연결 확인

원천 파일의 존재만 확인하지 말고 같은 컴포넌트와 시나리오가 다음 경로로 연결되는지 확인한다.

```text
Registry source
  → Registry JSON
MDX + doc-gen entry
  → 문서 index
예제 entry
  → manifest
  → Web bundle / native bundle
```

최소 확인 항목은 다음과 같다.

- Registry 공개 이름과 생성 JSON 이름이 같다.
- 문서 URL, `LynxComponentExample` 이름, doc-gen 파일 경로가 같은 논리 ID를 쓴다.
- entry, manifest, Web bundle, native bundle이 같은 시나리오를 가리킨다.
- Registry wrapper와 vendored wrapper의 공개 export 이름이 같다.
- 생성 CSS와 Recipe 원천의 변경이 일치한다.
- 새 문서나 생성물이 untracked 상태로 검토에서 빠지지 않았다.

실제 bundle 출력 경로, manifest 경로, 대상 `.html` 경로는 추측하지 말고 파일에서 확인한다. bundle을 실행하거나 브라우저를 열 때는 [검증 런북](references/verification.md)의 URL 조립 규칙을 사용한다.

### 4. 실행과 증거 수집

변경된 경로에 따라 [검증 런북](references/verification.md)의 다음 항목을 선택한다.

- 정적 문서 빌드와 `npx serve docs/out` 브라우저 확인
- Lynx bundle 생성과 `npx serve docs/public` bundle 확인
- `lynx://open?url=` 실행
- Lynx DevTool MCP의 client·session 선택, DOM·layout·computed style·console·screenshot 수집
- animation, transition, 측정 갱신, 지연 마운트의 시간축 확인

브라우저 미리보기만으로 실제 Lynx 결과를 주장하지 않는다. native bundle, 로컬 Lynx 런타임, 실제 기기는 각각 별도 증거 행으로 기록한다.

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
2. React↔Lynx 대응 및 생성물 연결 결과
3. 환경별 상태와 직접 확인한 기대·실제 결과
4. bundle URL, 문서 URL, client·session, screenshot·console·layout 증거 경로
5. 발견 사항의 재현 단계와 수정 범위
6. 미검증 환경과 정확한 차단 사유
7. 실행한 테스트와 정적 빌드 결과

검증이 끝나면 직접 시작한 서버, 브라우저 세션, DevTool 세션, 임시 증거 파일을 정리한다. 기존에 실행 중이던 서버나 사용자 세션은 임의로 종료하지 않는다.
