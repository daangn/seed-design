# Storybook CSF Next 작성 가이드

React 컴포넌트의 `docs/stories/*.stories.tsx`를 새로 쓰거나 리팩터링할 때 읽는다.

## 검증

story·`docs/.storybook/`만 바꿨으면 저장소 루트에서 두 명령을 실행한다.

1. `bun --filter @seed-design/docs typecheck`
2. `bun storybook:build`: story indexing 오류와 Vite 빌드 오류를 함께 본다.

- Recipe·Rootage도 바꿨다 → story의 `*VariantMap`이 생성물이므로 먼저 루트 `AGENTS.md`「생성」의 해당 명령을 실행한다.
- story 밖의 `docs/` 코드도 바꿨다 → 루트 `AGENTS.md`「검증」의 `docs/` 명령(`bun docs:test`)을 더한다. `bun docs:test`는 docs web 타입 검사를 포함하지 않으므로 1번을 대신하지 않는다.
- 렌더링이 바뀌었다 → [visual-testing.md](visual-testing.md)대로 변경한 story와 [필수 story](#필수-story)를 연다.
- 컴포넌트·Recipe까지 바꾼 작업의 완료 조건 → [verification-checklist.md](verification-checklist.md)

## 시작 전 확인

1. `docs/.storybook/preview.ts`를 읽는다.
2. `docs/stories/utils/parameters.ts`를 읽는다.
3. 구조가 가장 가까운 기존 `*.stories.tsx`를 연다. 네 필수 story를 가진 기본 형태는 `docs/stories/Badge.stories.tsx`다.

현재 패턴은 `@storybook/nextjs-vite`의 CSF Next factory API다. 버전과 addon·builder 호환성은 `docs/package.json`에서 확인한다. 설정을 고치면 `docs/.storybook/main.ts`는 `defineMain`, `docs/.storybook/preview.ts`는 `definePreview`를 유지한다.

## 기본 형식

- `Meta`, `StoryObj`, `export default meta`로 CSF 3 story를 새로 쓰지 않는다 → `preview.meta`, `meta.story`, `<Story>.extend`를 쓴다. 한 파일에서 둘을 섞지 않는다.
- 공통 template을 `meta.story({ args, render })`로 만들고 필수 story를 `CommonStoryTemplate.extend({ parameters: withChromaticParameters({ theme: "dark" }) })`처럼 파생한다.
- story annotations를 재사용하려고 객체를 복사하거나 `Story.args`, `Story.parameters`를 읽지 않는다 → `<Story>.extend(...)`를 쓴다. 값을 직접 읽어야 하면 CSF Next의 `Story.composed`나 `Story.input`을 확인한다.
- 기본 render로 충분하다 → `render`를 생략한다.

## render의 component 선택

- custom render가 `meta.component`를 렌더한다 → 두 번째 인자(story context)에서 `component`를 꺼낸다: `render: (args, { component }) => <VariantTable Component={component!} {...args} />`. args를 안 쓰면 `(_, { component })`.
- `component!`는 `meta`에 component를 지정한 경로에서만 쓴다. `StoryContext.component`는 타입상 optional이다.
- imported component나 제거된 `meta.component`를 closure로 참조하지 않는다 → context의 `component`를 쓴다.
- wrapper, story 전용 대체 컴포넌트, 동적으로 고른 컴포넌트를 렌더한다 → 그 명시적 참조를 유지한다. 모든 `Component={...}`를 context component로 일괄 치환하지 않는다.

## 공통 case mapping

variant·condition 매핑은 story 밖 상수로 두고 `VariantTable`(`docs/stories/components/variant-table.tsx`)에 넘긴다. `VariantTable`은 두 map의 축을 모두 조합한다.

- Recipe variant(`size`, `tone` 등) → `variantMap`에 Recipe가 생성한 `*VariantMap`을 넘긴다.
- Recipe 밖 케이스(높이, 반응형 값, 여러 prop 묶음) → `conditionMap`에 `{ 축: { 케이스명: 전달할 props } }`로 정의한다. 케이스명은 표 라벨이고 컴포넌트에는 안쪽 props가 전달된다. 예: `docs/stories/Skeleton.stories.tsx`의 높이 케이스
- 같은 축이 두 map에 있다 → `conditionMap`이 그 축의 값 목록과 전달 props를 대체한다.
- prop 값만 다른 케이스를 추가한다 → 새 story 대신 공통 template의 `conditionMap`을 넓혀 네 필수 story에 함께 적용한다.
- mapping이 렌더 대상 컴포넌트를 받는다 → `meta.component` 대신 context의 `component`를 넘긴다. wrapper가 상태나 레이아웃을 소유하면 wrapper를 `meta.component`로 지정하거나 기존 wrapper 전달을 유지한다.

## custom parameters와 Chromatic

`theme`·`fontScale` 타입은 `docs/.storybook/preview.ts`의 `definePreview({ ... }).type<{ parameters: StoryParameters }>()`가 관리한다.

- story 파일에서 custom parameters 타입을 위해 `Parameters` cast나 별도 factory를 만들지 않는다 → preview의 `.type<...>()`에 맡긴다.
- Chromatic 기본값이 필요한 story에만 `withChromaticParameters(...)`를 쓴다. 입력 타입을 그대로 돌려주는 `R -> R` 함수이고 런타임에 `chromatic` 기본값(`diffThreshold`, `delay`, `pauseAnimationAtEnd`)을 더한다.
- `withChromaticParameters`는 top-level shallow merge다. 인자에 `chromatic`을 넣으면 기본 객체 전체가 바뀐다 → 의도한 경우에만 넣는다.
- Chromatic 기본값을 preview 전역으로 옮기지 않는다 → 기존 Light·custom story의 시각 회귀 감도와 캡처 시점이 바뀌므로 사용자 결정 없이는 story별 적용을 유지한다.
- parameters는 project → meta → story 순으로 구체적인 쪽이 이기고, plain object는 재귀 병합된다.

## 필수 story

React 컴포넌트는 기본으로 네 story를 둔다: `LightTheme`, `DarkTheme`, `FontScalingExtraSmall`, `FontScalingExtraExtraExtraLarge`.

상호작용, 레이아웃, 최대값처럼 별도 의미가 있는 story는 `meta.story(...)` 또는 공통 template의 `extend(...)`로 추가한다.
