# Lynx 문서·예제 작업

컴포넌트 동작은 그대로 두고 Lynx 문서(`docs/content/lynx/components/`)와 실행 예제(`docs/examples/lynx/`)를 쓰거나 고치는 절차다. 기준은 같은 컴포넌트의 React 문서이고, Lynx 런타임 때문에 달라지는 부분만 바꾸고 이유를 적는다. MDX·frontmatter·예제 엔트리·이벤트 핸들러 형식은 [Lynx 문서 작성 규칙](lynx-docs-authoring.md)에 있다.

## 작업 절차

1. 수정 경로의 AGENTS를 읽는다.
   - MDX → `docs/AGENTS.md`
   - 예제 → `docs/examples/lynx/AGENTS.md`
   - 예제 빌드·manifest → `docs/scripts/lynx-examples/AGENTS.md`
2. 대상 MDX·예제와 대응 React 시나리오(`docs/content/react/components/<component>.mdx`, `docs/examples/react/<component>/*.tsx`)만 읽는다.
3. 새·변경 시나리오를 `동일 지원`·`Lynx식 변환`·`미지원`으로 분류해 [React 문서와 맞추기](#react-문서와-맞추기)의 대응 기록을 채운다. 근거 없는 `unknown`은 작성 전에 해소한다.
4. [배포 경로 확인](#배포-경로-확인)에서 정한 import로 [작성 규칙](lynx-docs-authoring.md)에 따라 frontmatter·MDX·예제 엔트리를 쓴다.
5. [검증](#검증)에서 해당하는 항목만 확인한다.
6. 대상 예제를 다시 읽어 대응 기록과 작성 결과가 일치하는지 확인하고, 검증한 환경과 남은 제한을 보고한다.

조건별 추가 행동:

- 경로를 모르거나 새 시나리오를 추가함 → [컴포넌트 경로 조회](component-map.md)로 필요한 경로만 찾아 그 파일을 읽는다.
- React·Lynx 공개 API 차이가 문서 구성이나 사용자 결과를 바꿈 → [React·Lynx API 비교](api-parity.md)로 의도한 플랫폼 차이와 보완할 누락을 나눈다.
- 컴포넌트 사용법, Engine 의존 기능, XElement, CSS·element 사용을 추가·변경함 → [호환성 frontmatter](lynx-docs-authoring.md#lynx-호환성-frontmatter) 절차를 따른다.
- 새 컴포넌트·생성물·공개 소비 경로를 추가함 → [`seed-change`](../../seed-change/SKILL.md) 계획으로 target branch와 release lane을 확인한다. 알려진 문서의 국소 수정에는 쓰지 않는다.
- 여러 담당이 구현·Registry·예제·런타임을 나눠 맡음 → [`seed-orchestrate-component`](../../seed-orchestrate-component/SKILL.md)가 역할과 인계 순서를 정하고, 문서 담당은 [협업 인계](#협업-인계)를 따른다.

## 검증

- 예제의 렌더링·상호작용 결과를 바꿨거나 native 결과를 새로 주장함, 또는 사용자가 결과 검증을 요청함 → 작성 뒤 [`seed-verify-lynx-component`](../../seed-verify-lynx-component/SKILL.md)로 [검증 런북](../../seed-verify-lynx-component/references/verification.md#2-문서-예제-선택과-query-직접-진입)의 `examples/lynx-spa` 문서 예제 경로에서 직접 확인한다.
- MDX 페이지·`LynxComponentExample` host·코드 탭·QR·Web preview·docs build pipeline을 바꿈 → [런북 6절](../../seed-verify-lynx-component/references/verification.md#6-문서-인프라를-실제로-바꾼-경우만)에 따라 실제 문서에서 그 변경 부분만 확인한다. 그 밖의 변경에는 전체 docs 빌드나 정적 bundle 서빙을 선행 조건으로 두지 않는다.
- 문구·코드 노출만 고치고 예제 결과가 그대로임 → 해당 MDX 섹션과 코드 원본만 확인한다.
- 브라우저 미리보기와 native 결과가 다름 → [시각적 동등성 판정](../../seed-verify-lynx-component/references/verification.md#시각적-동등성-판정) 기준으로 preview와 native를 별도 증거로 나누고, 원인을 문서·미리보기·컴포넌트·런타임 중 하나로 분류해 [작업 경계](#작업-경계)대로 고칠 곳을 정한다.
- 기기나 실행 환경이 없음 → 확인하지 못한 범위를 보고한다. 결과를 흉내 내는 우회 구현을 추가하지 않는다.

## 작업 경계

- 설명·코드 노출 오류 → `docs/` 안에서 고친다.
- 예제 엔트리, 스타일 등록 순서, bundle URL, manifest 문제 → 문서 실행 환경(`docs/examples/lynx/`, `docs/scripts/lynx-examples/`)에서 고친다.
- 실제 호스트 앱에서도 재현되는 API·동작 문제 → 문서용 우회를 만들지 않고 [기존 구현 변경](implementation-workflow.md#기존-구현-변경)으로 분리한다.
- 브라우저 미리보기에만 있는 한계 → 배포 컴포넌트를 바꾸지 않고 예제 가까이에 [네이티브 전용 안내](lynx-docs-authoring.md#네이티브-전용-안내)를 둔다.
- 지원하지 않는 기능 → 작동하는 것처럼 흉내 내지 않는다. 실행 예제 없이 근거와 앱 수준 대안을 문서에 남긴다.
- 확인할 화면이 필요함 → 독립 HTML, 별도 Vite 앱, 임시 React 페이지를 만들지 않고 `docs/examples/lynx/` 예제와 `examples/lynx-spa`로 확인한다.

## 배포 경로 확인

알려진 소비 경로는 그대로 쓴다. Registry와 package export 중 무엇을 쓸지 불명확하거나 새 예제를 만들 때만 `docs/registry/lynx/registry-ui.ts` 등록, 현재 Installation·Usage, 예제 import를 함께 확인하고, 문서와 실행 예제에 같은 경로를 쓴다.

- Registry 배포 → Installation은 Registry 설치 방법을 쓰고, Usage·Props·`docs/examples/lynx/` 예제·vendored 앱 예제는 설치된 `@/components/ui/<name>` wrapper를 쓴다. 하위 package API를 설명하는 별도 저수준 예시가 아니면 `@seed-design/lynx-react`로 우회하지 않는다.
- package-only → `@seed-design/lynx-react`의 실제 공개 export를 직접 쓴다. Registry 설치 단계나 없는 wrapper를 만들지 않는다.
- package + Registry → 기본 사용법과 실행 예제는 Registry 경로를 쓴다. 저수준 package API는 사용자가 직접 조합해야 하는 내용을 설명할 때만 별도 예시로 둔다.
- vendored 앱 예제(`examples/lynx-spa/src/seed-design/ui/`)가 영향을 받음 → Registry 원본과 공개 이름을 동기화한다([플랫폼 선택](platform-gate.md#3-platform-specific-source-of-truth)).

## React 문서와 맞추기

대조 범위:

- 새 컴포넌트 → React의 관련 섹션·시나리오 파일·사용자 결과 전부
- 기존 시나리오의 사용자 결과 변경 → 그 시나리오만
- 문구·코드 노출만 수정 → 기록 없이 해당 MDX 섹션과 코드 원본만
- React 대응 문서가 없음 → 가장 가까운 Lynx 문서 구조를 참고하되, 시나리오는 대상 컴포넌트의 실제 공개 API와 런타임 동작으로 정한다.

시나리오마다 네 항목을 React 값, Lynx 값, 판정(`동일 지원`·`Lynx식 변환`·`미지원`), 근거 경로로 기록한다.

- 문서 섹션·예제 ID: 양쪽 제목, 순서, 논리 ID. 근거는 MDX·entry 경로.
- 사용자 결과: 항목, 문구, asset, frame, 초기 상태, 보조 요소. 근거는 JSX·MDX host.
- 입력·전이: React click·callback과 중간·최종 상태 → Lynx `bindtap`·공개 callback과 대응 상태. 근거는 handler·runtime.
- 화면 셸: React AppScreen·AppBar·하단 CTA → Lynx AppBar·native layout·하단 CTA. 근거는 JSX.

판정 규칙:

- 시나리오 이름이 같음 → 그것만으로 동등하다고 판정하지 않는다. 위 네 항목을 나란히 읽는다.
- `scaffold-plan`이나 생성할 파일 목록이 있음 → 파일 경계만 보여주므로 이 기록을 대신하지 않는다.
- `동일 지원` → React 섹션·예제의 제목, 순서, 목적, 문구, 상태를 유지하고 Lynx 엔트리 형식으로만 옮긴다. 예제를 축약하지 않는다.
- `Lynx식 변환` → 사용자 결과는 유지하고 compound 구조, 이벤트 prop, 접근성 속성, 이미지·CSS만 Lynx 공개 API에 맞춘다. 차이를 문서에 설명한다.
- `미지원` → 실행 예제를 만들지 않고 문서의 미지원 섹션에 구현체 부재 근거, 이유, 앱 수준 대안을 적는다.

포팅 중인 컴포넌트를 소비할 때:

1. [참조 동작 추적과 기본 장면](implementation-steps.md#참조-동작-추적과-기본-장면)의 검증 결과를 확인한다. 대응 기록은 병렬로 채워도 된다.
2. 필요한 package·생성물과 실제 공개 소비 경로를 `examples/lynx-spa` 문서 예제로 연결해 Lynx 기본 장면을 먼저 확인한다.
3. 기본 장면이 통과한 뒤 그 동작에 의존하는 변형 예제를 늘린다. 기본 장면이 실패하면 예제 wrapper나 frame 조정으로 숨기지 않고 원천 담당에게 돌려보낸다.

## 협업 인계

문서 담당은 읽기·작성과 시나리오·기대 결과·문서 소비 경로를 맡는다. 변경된 렌더링·상호작용을 직접 통과시켰다고 보고하지 않고, [`seed-verify-lynx-component`](../../seed-verify-lynx-component/SKILL.md)의 지정 검증 담당이 `examples/lynx-spa` 문서 예제 경로로 수집한 native 결과를 받아 문서와 제한을 확정한다. 분담과 자원은 [검증 분담과 자원](../../seed-orchestrate-component/references/collaboration.md#검증-분담과-자원)을 따른다.

인계는 다음 순서로 짧게 남긴다.

1. 변경본 식별자
2. SPA 예제 ID와 query를 포함한 bundle URL
3. 실행 환경 근거
4. 판정과 기대·실제 결과
5. 증거
6. 실패 원천·영향 범위
