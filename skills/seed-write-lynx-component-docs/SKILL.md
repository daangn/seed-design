---
name: seed-write-lynx-component-docs
description: Lynx 컴포넌트 문서와 실행 예제를 React 대응과 맞춰 작성·수정할 때 사용한다.
---

# Lynx 컴포넌트 문서 작성

Lynx 문서와 예제는 같은 컴포넌트의 React 문서를 기준으로 작성한다. 지원되는 기능은 섹션 순서, 예제 제목, 시나리오, 사용자가 보는 결과를 가능한 한 같게 유지한다. Lynx 런타임 때문에 달라지는 부분만 바꾸고 이유를 적는다.

## 시작하기

1. 저장소 루트부터 수정 경로까지 적용되는 `AGENTS.md`와 실제 수정할 문서·예제 경로의 지침만 읽는다. 문서만 고치면 `docs/AGENTS.md`, 예제를 고치면 `docs/examples/lynx/AGENTS.md`, 빌드·매니페스트를 다루면 `docs/scripts/lynx-examples/AGENTS.md`를 추가로 읽는다.
2. 대상 MDX·예제·소비 경로가 알려졌다면 그 파일과 대응 React 시나리오만 읽는다.
3. package export·Registry·문서·예제 경로가 불명확하거나 새 시나리오를 추가한다면 [`seed-component-map`](../seed-component-map/SKILL.md)으로 필요한 경로만 찾고 결과 파일을 읽는다.
4. React와 Lynx 공개 API 차이가 문서 구성이나 사용자 결과에 영향을 줄 때만 [`seed-api-parity`](../seed-api-parity/SKILL.md)를 사용한다. 플랫폼 제약으로 의도한 차이와 보완할 누락을 구분한다.

## 검증 범위 정하기

- 새 컴포넌트·생성물·공개 소비 경로를 추가할 때만 `seed-change-plan`으로 target branch와 release lane을 확인한다. 알려진 문서의 국소 수정에는 적용하지 않는다.
- 문서 또는 예제의 렌더링·상호작용 결과가 바뀌거나 사용자가 결과 검증을 요청하면 작성 뒤 [`seed-verify-lynx-component`](../seed-verify-lynx-component/SKILL.md)를 사용한다.
- 여러 레이어의 구현·Registry·예제·런타임을 나눠 맡는 작업에서는 [`seed-orchestrate-component`](../seed-orchestrate-component/SKILL.md)가 역할과 인계 순서를 정한다. 이 경우 문서 담당은 시나리오·기대 결과·문서 소비 경로를 소유하고, 검증 담당은 [`검증 런북`](../seed-verify-lynx-component/references/verification.md)의 `examples/lynx-spa` 문서 예제 기본 경로로 native 결과를 확인한다. MDX 페이지·`LynxComponentExample` host·코드 탭·QR·Web preview 또는 docs build pipeline 자체를 바꾼 경우에만 해당 문서 변경 부분을 확인한다. 분담·자원 기준은 [검증 분담과 자원](../seed-orchestrate-component/references/collaboration.md#검증-분담과-자원)을 따른다.

## 배포 경로 확인

문서와 실행 예제의 소비 경로가 알려져 있으면 그 경로를 유지한다. Registry와 package export 중 어느 것을 써야 하는지 불명확하거나 새 예제를 만들 때만 등록 정보, 현재 Installation·Usage, 예제 소비 경로를 함께 확인한다.

| 배포 방식 | Installation·Usage·실행 예제 |
| --- | --- |
| Registry 배포 | Registry 설치 방법과 설치된 경로를 사용한다. `docs/examples/lynx`와 vendored 앱 예제도 같은 Registry wrapper를 사용한다. |
| package-only | `@seed-design/lynx-react`의 실제 공개 export를 직접 사용한다. 존재하지 않는 Registry 설치 단계를 만들지 않는다. |
| package + Registry | 기본 사용법과 실행 예제는 Registry 경로를 사용한다. 저수준 package API는 사용자가 직접 조합해야 하는 내용을 설명할 때만 별도 예시로 둔다. |

## React 문서와 맞추기

새 Lynx 문서·실행 예제를 만들거나 기존 시나리오의 사용자 결과를 바꿀 때 아래 대응표를 대상 시나리오별로 채운다. 새 컴포넌트는 React의 모든 관련 시나리오를, 알려진 한 시나리오의 국소 수정은 그 대응 시나리오만 대조한다. 문구나 코드 노출만 고치고 예제 결과가 그대로면 해당 MDX 섹션과 코드 원본만 확인한다.

| 항목 | React | Lynx | 판정 | 근거 |
| --- | --- | --- | --- | --- |
| 문서 섹션·예제 ID | 제목·순서·논리 ID | 대응 값 | 동일·변환·미지원 | MDX·entry 경로 |
| 사용자 결과 | asset·frame·초기 상태·보조 요소 | 대응 값 | 동일·변환·미지원 | JSX·MDX host |
| 입력·전이 | click·callback·중간·최종 상태 | bindtap·공개 callback·대응 상태 | 동일·Lynx식 변환·미지원 | handler·runtime |
| 화면 셸 | AppScreen·AppBar·하단 CTA | AppBar·native layout·하단 CTA | 동일·변환·미지원 | JSX |

시나리오 이름만으로 동등하다고 판단하지 않는다. 대상 예제는 항목·문구·초기 상태·asset·frame·입력·전이·화면 셸을 나란히 읽는다. Lynx 공개 API가 같은 결과를 지원하면 축약하지 않으며, 실제 미지원만 실행 예제 없이 근거와 앱 수준 대안으로 남긴다. React 대응 문서가 없으면 가장 가까운 Lynx 문서 구조와 대상 컴포넌트의 실제 공개 API를 기준으로 삼는다.

포팅 중인 컴포넌트를 소비한다면 [참조 동작 추적과 기본 장면](../seed-create-component/references/implementation-steps.md#참조-동작-추적과-기본-장면)의 검증 결과를 확인한 뒤 그 동작에 의존하는 변형 예제를 확장한다. Lynx 기본 장면은 필요한 package·생성물과 실제 공개 소비 경로를 `examples/lynx-spa`의 문서 예제로 연결해 먼저 확인한다. MDX host·QR·Web preview 같은 문서 자체를 바꾸지 않았다면 전체 docs 빌드나 정적 bundle 서빙을 선행 조건으로 두지 않는다. 시나리오 대응표 작성은 병렬로 진행할 수 있다. 기본 장면 실패를 예제 wrapper나 frame 조정으로 숨기지 말고 원천 담당에게 돌려보낸다.

## 작업 흐름

단독 작업에서는 아래 순서를 따른다.

1. 수정 범위에 맞춰 대상 MDX·예제와 필요한 React 대응 파일만 읽는다.
2. 새·변경 시나리오는 동일 지원, Lynx식 변환, 미지원으로 분류하고 근거 없는 `unknown`을 구현 전에 해소한다.
3. 컴포넌트 사용법, Engine·XElement, CSS·element 사용을 새로 추가하거나 바꿀 때만 [작성 규칙](references/authoring.md)의 호환성 절차와 `find-refer`·`lynx-api-docs`·`lynx-check-css-support`를 사용한다.
4. [작성 규칙](references/authoring.md)에 따라 필요한 frontmatter, MDX, 예제 엔트리를 작성한다.
5. MDX 페이지·`LynxComponentExample` host·코드 탭·QR·Web preview를 바꿨을 때만 실제 문서에서 그 변경 부분을 확인한다.
6. 네이티브 결과를 새로 주장하거나 예제 동작을 바꿨다면 [`검증 런북`](../seed-verify-lynx-component/references/verification.md)의 `examples/lynx-spa` 문서 예제 기본 경로로 직접 확인한다. 환경이 없으면 확인하지 못한 범위를 보고하고 우회 구현을 추가하지 않는다.
7. 브라우저와 실제 Lynx 결과가 다르면 [검증 런북](../seed-verify-lynx-component/references/verification.md)의 환경 분리 기준에 따라 문서, 미리보기, 컴포넌트·런타임 문제로 나눈다.
8. 대상 예제를 다시 읽어 대응표와 실제 작성 결과가 일치하는지 확인하고, 검증한 환경과 남은 제한을 보고한다.

협업 작업에서는 문서 담당이 위 순서의 읽기·작성·시나리오 인계를 수행한다. 변경된 렌더링·상호작용을 직접 통과시켰다고 보고하지 않고, [`seed-verify-lynx-component`](../seed-verify-lynx-component/SKILL.md)의 지정 검증 담당이 수집한 결과를 받아 문서와 제한을 확정한다. 인계는 `변경본 식별자 → SPA 예제 ID와 query를 포함한 bundle URL → 실행 환경 근거 → 판정과 기대·실제 결과 → 증거 → 실패 원천·영향 범위` 순서로 짧게 남긴다.

## 작업 경계

- 설명이나 코드 노출만 잘못된 경우 `docs/` 안에서 고친다.
- 예제 엔트리, 스타일 등록 순서, bundle URL, 매니페스트 문제는 문서 실행 환경에서 고친다.
- 실제 호스트 앱에서도 재현되는 API나 동작 문제는 컴포넌트 작업으로 분리한다.
- 브라우저 미리보기의 한계만으로 배포 컴포넌트를 바꾸지 않는다.
- 지원하지 않는 기능을 문서 예제에서 작동하는 것처럼 흉내 내지 않는다.

## 작성 원칙

- 실행 예제는 실제 호스트 앱에서 권장하는 소비 경로와 사용 패턴을 보여준다.
- Registry 배포 컴포넌트는 Registry를 사용한다. package-only 컴포넌트만 `@seed-design/lynx-react`에서 직접 import한다.
- 같은 기능을 지원하면 React 문서의 섹션 순서, 예제 제목, 시나리오, 문구와 사용자 결과를 가능한 한 유지한다.
- Engine·XElement 호환성은 새·변경된 사용법에만 `find-refer`와 `lynx-api-docs`로 공식 자료를 확인한다. CSS 속성·값은 필요할 때 `lynx-check-css-support`를 함께 사용하며 버전을 추정하지 않는다.
- 일반적인 문서 작업에서 독립 HTML, 별도 Vite 앱, 임시 React 페이지를 만들지 않는다.
- 브라우저 미리보기에서 표현할 수 없는 네이티브 동작은 관련 예제 가까이에 짧게 안내한다.
- `false`, `null`, `0`처럼 JSX가 그대로 표시하지 않을 수 있는 값은 `JSON.stringify`로 직렬화한다.
- 공유 스타일은 컴포넌트보다 먼저 등록한다. 컴포넌트가 소유한 Recipe CSS를 예제에서 다시 가져오지 않는다.
