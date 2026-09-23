# 요구사항 탐색

새 컴포넌트의 목적이나 공개 계약에 중요한 빈칸이 있을 때 쓴다. 사용자가 이미 구체적으로 정한 내용은 다시 묻지 않고, 구현 방향을 바꿀 수 있는 항목만 확인한다.

## 진행 방식

1. 이미 확정된 요구사항과 가까운 구현을 읽어 결정할 수 있는 항목을 채운다.
2. 남은 결정이 사용자 결과를 바꾸는지, 새 패키지·토큰·외부 의존성·CI 범위를 바꾸는지 구분한다.
3. 되돌리기 어려운 선택만 짧은 후보와 영향으로 질문한다. 이미 요청된 공개 API의 세부 naming·구현 순서는 기존 패턴을 따른다.
4. 답을 받은 항목만 기록하고 구현으로 이어 간다. 읽기 전용 분석과 되돌릴 수 있는 구현 세부에는 승인 단계를 만들지 않는다.

사용자 확인이 필요한 경우는 새 패키지, 새 토큰, 외부 의존성, CI 변경처럼 저장소 경계나 외부 변경을 추가할 때뿐이다. 근거와 영향을 보여 주고 확인받는다. 요청한 공개 API의 구현 세부, 기존 패턴으로 정할 수 있는 선택, 되돌릴 수 있는 문서·코드 구성은 확인 없이 진행한다.

질문 방식:

- 구현을 바꾸지 않는 질문을 형식적으로 반복하지 않는다 → 기존 컴포넌트와 요청으로 정할 수 있으면 그 근거로 진행한다.
- 여러 영역을 한 번에 묻지 않는다 → 한 번에 한 영역만 묻는다.
- 모호한 답에 추측을 덧붙이지 않는다 → 결정이 필요한 부분만 다시 좁혀 묻는다.

### 판단 신호

- "그냥 알아서 해줘" → 가까운 기존 패턴과 명시 요구로 기본값을 정하고, 저장소 경계가 바뀌는 선택만 묻는다.
- "Base UI처럼 만들어줘" → 복사하지 않고 SEED 패턴과 충돌하는 공개 계약만 확인한다.
- "엣지케이스는 나중에" → 요청과 가까운 기존 시나리오에서 필요한 경계만 구현·검증한다.
- "기존 X 컴포넌트랑 비슷한데..." → 해당 컴포넌트를 먼저 읽고 확장·대체 여부를 판단한다.
- "토큰은 적당히..." → 기존 토큰을 우선하고, 새 토큰이 필요할 때만 사용자에게 확인한다.

## 시각 자료 (선택)

Figma 시안, 외부 라이브러리 데모, 유사 SEED 컴포넌트의 Storybook URL, 사용자의 mockup·스크린샷은 자료 유무가 구현 결과를 바꿀 때만 한 번 묻는다. 없거나 결과에 영향이 없으면 텍스트와 기존 패턴으로 진행한다.

## 1. Purpose — 왜 / 누가 / 어떤 사용 사례인가

컴포넌트가 왜 있어야 하는지 합의한다. 한 번에 하나씩 묻는다.

1. 어떤 사용자(개발자·디자이너·PM)가 어떤 화면·플로우에서 쓰는가?
2. 비슷한 것이 SEED나 당근 프로덕트에 이미 있는가? 있다면 왜 그것을 쓰지 않는가?
3. 이 컴포넌트가 푸는 1차 문제는 무엇인가? (한 문장)
4. 1차 문제가 풀리지 않으면 사용자는 지금 어떻게 우회하는가?

합의 문장: "이 컴포넌트는 _[사용자]_가 _[화면·플로우]_에서 _[문제]_를 풀기 위해 쓴다."

"유용할 것 같아서", "있으면 좋을 것 같아서"만으로 진행하지 않는다 → 구체적 사용 사례를 하나 이상 확보한 뒤 §2로 넘어간다.

## 2. 기존과의 관계 — 신규 / 확장 / 대체

새 컴포넌트가 SEED 안에서 차지하는 위치를 고른다.

- 신규 → SEED에 없는 새 컴포넌트. 가장 유사한 SEED 컴포넌트와 외부 레퍼런스를 함께 합의한다.
- 기존 확장 → 기존 컴포넌트에 새 variant·slot 추가. 기존 API 호환성과 breaking change 여부를 합의한다.
- 대체 → 기존 컴포넌트를 deprecation 대상으로 만듦. 마이그레이션 경로와 deprecation 일정을 합의한다.

### 유사 컴포넌트 매트릭스

target platform에 맞는 패턴 참조 경로를 합의한다.

- Headless ref: React `packages/react-headless/<name>`, Lynx `packages/lynx-react-headless/<name>`. 기존 외부 primitive가 상태를 소유하면 `packages/lynx-react/src/hooks`나 컴포넌트 내부 hook·context
- Styled ref: React `packages/react/src/components/<Name>`, Lynx `packages/lynx-react/src/components/<Name>`
- Snippet ref: React `docs/registry/react/ui/<name>.tsx`, Lynx `docs/registry/lynx/ui/<name>.tsx`, 또는 N/A
- Rootage ref: `packages/rootage/components/<name>.yaml`

합의 문장: "_[유형]_으로 가고, Platform=_[react/lynx/cross-platform]_, 패턴 참조는 Headless=_[X]_, Styled=_[Y]_, Snippet=_[Z]_, Rootage=_[W]_다."

## 3. 엣지케이스 시나리오

상태·입력·접근성 계약을 새로 만들거나 바꿀 때만 적용한다. 기존 동작을 건드리지 않는 작은 변경에 모든 항목의 합의를 요구하지 않는다. 관련 항목은 가까운 기존 컴포넌트와 플랫폼 계약을 근거로 경계를 정하고, 새 토큰·패키지·외부 의존성 같은 저장소 경계만 사용자에게 확인한다.

확인이 필요한 경우:

- 상태 → loading, error, empty, disabled, read-only 결과를 새로 지원하거나 바꿀 때
- 제어 → controlled·uncontrolled 또는 기본값 계약을 추가·변경할 때
- 입력·접근성 → React 키보드·focus 또는 Lynx 터치·제스처·`accessibility-*` 계약을 바꿀 때
- 폼 통합 → Field·native input 또는 Lynx 런타임 지원 여부가 사용자 결과에 영향을 줄 때
- 터치·폰트 스케일링 → 해당 화면의 target size, overflow, layout 결과를 바꿀 때

남은 결정이 사용자 결과나 저장소 경계를 바꿀 때만 해당 영역을 골라 짧게 묻는다. 질문 수를 정하지 않는다. 예:

> "상태 — 로딩 / 에러 / 빈 상태 / 비활성 / 읽기 전용 중 새로 다뤄야 하는 결과가 있어?"

> "제어 — controlled와 uncontrolled 중 어떤 계약이 필요한가? 기존 컴포넌트가 양쪽을 지원하면 그 패턴을 따른다."

필요한 상태·입력·접근성 경계는 구현 전에 확정한다.

## 4. 토큰 의존성 — 신규 / 기존

기존 Rootage 토큰(`packages/rootage/`)으로 표현할 수 있으면 그대로 쓴다. 기존 토큰 선택이나 되돌릴 수 있는 이름 정리는 별도 승인 없이 기존 패턴을 따른다.

새 토큰 추가는 이 Skill의 사전 확인 대상이다. 다음을 정리해 사용자에게 확인받는다.

1. 어느 토큰 파일인가? (`packages/rootage/`의 `color.yaml`, `dimension.yaml`, `radius.yaml`, `font-size.yaml`, `shadow.yaml`, `duration.yaml` 등)
2. Figma 동기화가 필요한가, 컴포넌트별 vars로 충분한가? `color.yaml`·`gradient.yaml`·`shadow.yaml`은 `bun figma:sync`가 다시 쓴다(`ARCHITECTURE.md`「생성 파이프라인」).
3. 기존 토큰과 일관된 이름인가? (예: `$color.bg.brand-weak`, `$dimension.spacing-x.global-gutter`)

## 5. 외부 레퍼런스 우선순위 — 어느 라이브러리부터?

외부 라이브러리는 영감이지 복사 대상이 아니다. 기존 SEED 패턴으로 정할 수 있으면 외부 비교를 생략한다. 인터페이스 선택이 사용자 결과나 공개 계약을 바꾸고 기존 선례가 충분하지 않을 때만 비교한다. 라이브러리별 참고 영역, 결정 영역별 1순위, 차용·거부 기준은 [external-references.md](external-references.md)에 있다.

### 접근법 비교 (인터페이스가 갈릴 때)

같은 결정 영역에서 기존 SEED 패턴과 외부 라이브러리의 답이 갈리고 결과가 달라질 때만 후보와 장단점을 정리한다. 사용자 결과와 유지보수 비용이 달라지는 선택만 남기고, 결과를 바꾸지 않는 참고나 구현 세부는 가장 가까운 기존 패턴을 따른다.

예: Accordion의 `value` 인터페이스

- (A) Radix 방식: `<Accordion type="single|multiple" value=...>`
- (B) Base UI 방식: `<Accordion multiple value=...>`(boolean capability)

SEED는 (B)를 골랐다(`packages/react-headless/accordion/src/useAccordion.ts`의 `multiple?: boolean`, 근거는 [api-design.md](api-design.md)「API 설계 9원칙」의 7). 이처럼 각 선택의 장단점과 SEED에서 가장 가까운 선례를 기록하고, 되돌리기 어려운 공개 계약이나 저장소 경계만 근거와 함께 사용자에게 확인한다.

## 합의 요약 템플릿

여러 레이어나 공개 API를 새로 정했다면 해당하는 항목만 채운다. 단순 변경에 빈 항목을 억지로 만들지 않는다. 채운 요약은 [architecture-decisions.md](architecture-decisions.md) §0의 입력이 된다.

```markdown
## 컴포넌트: <Name>

### Platform
- Target: react / lynx / cross-platform
- 이유: <요청/경로/import/docs 근거>
- Lynx support delta: <웹 대비 차이 또는 N/A>
- Headless ownership: React headless / Lynx headless package / Lynx hook·context / 기존 외부 Lynx primitive / 없음
- Docs/registry target: <docs/content/... + docs/registry/... 경로>

### Purpose
- 1차 사용자/사용 사례: <한 문장>
- 1차 문제: <한 문장>
- 현재 우회 방법: <한 문장>

### 관계
- 유형: 신규 / 확장 / 대체
- 가장 유사한 SEED 컴포넌트: <name>
- Headless ref: <path>
- Styled ref: <path>
- Snippet ref: <path or N/A>
- Rootage ref: <path>

### 엣지케이스 합의
- 상태: 로딩 [O/X] / 에러 [O/X] / 빈 [O/X] / 비활성 [O/X] / 읽기전용 [O/X]
- 제어: controlled [O/X] / uncontrolled [O/X] / useControllableState [O/X]
- React 입력·접근성: <키보드·focus 동작>, role=<...>, aria-<...>, native input [O/X]
- Lynx 입력·접근성: <터치·제스처 동작>, accessibility-<...>, 플랫폼 제약 <...>
- 터치 타겟 ≥ <Npx>, engaged 상태 [O/X]
- 폼: React Field 통합 [O/X] / Lynx 런타임 지원 [O/X]
- RTL [O/X] / 폰트스케일 t1~t10 [O/X]

### 토큰
- 기존 토큰으로 충분: [Yes/No]
- 신규 토큰: <목록 또는 N/A>
- 추가 방식: Figma 기다림 / 임시 추가 / 컴포넌트별 vars

### 외부 레퍼런스 우선순위
- 1순위: <라이브러리, 참고 영역>
- 2순위: <라이브러리, 참고 영역>
- SEED 패턴과 충돌 시: <어떻게 결정할지>
```
