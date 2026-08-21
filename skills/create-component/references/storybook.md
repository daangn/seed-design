# Storybook CSF Next 작성 가이드

React 컴포넌트의 `docs/stories/*.stories.tsx`를 새로 작성하거나 리팩터링할 때 사용한다. 시각 검증 절차는 `visual-testing.md`, 완료 조건은 `verification-checklist.md`를 따른다.

## 시작 전 확인

다음 파일을 먼저 읽는다.

1. `docs/.storybook/preview.ts`
2. `docs/stories/utils/parameters.ts`
3. 구조가 가장 가까운 기존 `*.stories.tsx`

Storybook 버전과 addon/builder 호환성은 저장소 설정을 먼저 확인한다. 현재 패턴은 `@storybook/nextjs-vite`의 CSF Next factory API다. 설정을 수정하면 `.storybook/main.*`은 `defineMain`, `.storybook/preview.*`는 `definePreview`를 유지한다.

## 기본 형식

`Meta`, `StoryObj`, `export default meta`를 조합하는 CSF 3 형식을 새로 작성하지 않는다. `preview.meta`, `meta.story`, `<Story>.extend`를 사용하고 한 파일에서 CSF 3와 CSF Next를 섞지 않는다.

```tsx
import preview from "../.storybook/preview";
import { Example } from "seed-design/ui/example";

import { exampleVariantMap } from "@seed-design/css/recipes/example";
import { withChromaticParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const meta = preview.meta({
  component: Example,
  decorators: [SeedThemeDecorator],
});

const CommonStoryTemplate = meta.story({
  args: {},
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={exampleVariantMap} {...args} />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Extra Extra Large" }),
});
```

기본 render로 충분하면 `render`를 생략한다. 같은 story annotations를 재사용할 때는 객체를 직접 복사하거나 `Story.args`, `Story.parameters`를 읽지 말고 `<Story>.extend(...)`를 사용한다. 직접 읽어야 하면 CSF Next의 `Story.composed` 또는 `Story.input`을 확인한다.

## render의 component 선택

custom render가 `meta.component`를 렌더한다는 의미라면 두 번째 인자인 story context에서 `component`를 꺼낸다.

```tsx
render: (args, { component }) => (
  <VariantTable Component={component!} {...args} />
),
```

- `StoryContext.component`는 타입상 optional이므로 `meta`에 component를 지정한 이 경로에서만 `component!`를 사용한다.
- args를 사용하지 않으면 `(_, { component })`로 작성한다.
- imported component나 제거된 `meta.component`를 closure로 참조하지 않는다.
- wrapper, story 전용 대체 컴포넌트, 동적으로 선택한 컴포넌트를 렌더하는 경우에는 그 명시적 참조를 유지한다. 모든 `Component={...}`를 context component로 일괄 치환하지 않는다.

## 공통 case mapping

variant/condition 매핑은 story 밖의 상수로 유지하고 `VariantTable`에 전달한다. mapping 함수가 render 대상 컴포넌트를 받으면 `meta.component` 대신 context의 `component`를 전달한다. wrapper가 상태나 레이아웃을 소유하면 wrapper를 `meta.component`로 지정하거나 기존 명시적 wrapper 전달을 유지한다.

## custom parameters와 Chromatic

`theme`과 `fontScale` 타입은 `docs/.storybook/preview.ts`의 다음 확장으로 관리한다.

```ts
definePreview({
  // project annotations
}).type<{ parameters: StoryParameters }>();
```

- story 파일에서 custom parameters 타입을 위한 `Parameters` cast나 별도 factory를 만들지 않는다.
- Chromatic 기본값이 필요한 story에만 `withChromaticParameters(...)`를 사용한다. 이 함수는 입력 타입을 그대로 보존하는 `R -> R` identity surface이며 런타임에 Chromatic 값을 추가한다.
- `withChromaticParameters`는 top-level shallow merge다. 호출 인자의 `chromatic`은 기본 Chromatic 객체를 교체하므로 의도 없이 함께 전달하지 않는다.
- Chromatic 기본값을 preview 전역으로 옮기면 기존 Light/custom story에도 적용된다. 시각 회귀 감도와 캡처 시점을 바꾸는 정책 결정 없이 전역화하지 않는다.
- project → meta → story 순으로 더 구체적인 parameters가 우선하며 plain object는 재귀 병합된다는 Storybook 규칙을 고려한다.

## 필수 story

React 컴포넌트는 기본적으로 다음 4개를 제공한다.

- `LightTheme`
- `DarkTheme`
- `FontScalingExtraSmall`
- `FontScalingExtraExtraExtraLarge`

상호작용, 레이아웃, 최대값처럼 별도 의미가 있는 story는 `meta.story(...)` 또는 공통 template의 `extend(...)`로 추가한다.

## 검증

저장소 루트에서 다음을 실행한다.

```bash
bun generate:all
bun --filter @seed-design/docs typecheck
bun storybook:build
bun docs:test
bun test:all
```

`bun storybook:build`에서 story indexing 오류와 Vite 빌드 오류를 함께 확인한다. 실제 테마·폰트 스케일 결과는 `visual-testing.md`의 네 경로를 캡처해 비교한다.
