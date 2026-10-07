# docs/examples/lynx

Lynx 컴포넌트 문서가 실행하는 ReactLynx 예제다. `docs/scripts/lynx-examples`가 컴포넌트 디렉터리마다 브라우저 미리보기 bundle과 native Lynx bundle을 하나씩 빌드한다. 같은 bundle 안에서 Web은 `globalProps.example`, native는 bundle URL의 `example` query(예: `?example=lynx%2Fbadge%2Fpreview`)로 렌더할 예제 ID를 고른다.

## 검증

- 타입 → `bun --filter @seed-design/docs typecheck:lynx-examples`(`bun docs:test`에 포함)
- 빌드·discovery 규칙 → `bun --filter @seed-design/docs build:lynx-examples`
- native 기기 결과 → `seed-verify-lynx-component` Skill

## 규칙

### 파일

- 경로는 `<component>/<scenario>.tsx` 두 단계이고 두 이름 모두 kebab-case다. 어기면 discovery가 빌드를 실패시킨다.
- 컴포넌트 디렉터리의 `.tsx`는 모두 그 컴포넌트 bundle의 예제가 된다 → 같은 컴포넌트가 공유하는 스타일·코드는 `styles.ts`, `preview.css`처럼 `.tsx`가 아닌 파일에 둔다. 같은 bundle의 예제는 CSS를 함께 쓰므로 예제마다 다른 규칙을 같은 class 이름에 두지 않는다.
- symlink와 컴포넌트 디렉터리 밖의 파일을 쓰지 않는다 → 필요한 코드는 해당 컴포넌트 디렉터리에 둔다.

### 레이아웃

- 예제는 시나리오 콘텐츠만 렌더한다. Seed scope·배경·바깥 여백·가운데 정렬·높이는 호스트(`standalone.tsx`, `examples/lynx-spa`의 `DocsExamplePage.tsx`)가 맡는다 → 예제에서 `useSeedClassName`, `docs-lynx-*-root` 래퍼, 배경색, `height: 100%`·`min-height: 100%`, 가운데 정렬용 래퍼를 쓰지 않는다.
- 호스트 배치는 `docs/playground/lynx/layout.ts`의 `getExampleLayout(id)`가 정한다. 기본 `center`는 예제를 가운데에 둔다 → 가로를 채울 예제는 루트에 `width: 100%`(필요하면 `max-width`)를 둔다.
- `flex-direction`·`align-items`·`justify-content`·`gap`·`flex-wrap`을 쓰는 view에는 `display: flex`를 함께 둔다. native 기본 display는 linear여서 없으면 정렬 속성이 무시된다. `VStack`·`HStack`을 써도 된다. SEED 컴포넌트(예: `TabsContent`)에 준 class에는 `display`를 두지 않는다 → Recipe가 상태별 `display: none`을 정하므로 덮으면 숨김이 깨진다.
- `Box`·`VStack`·`HStack`의 `style`에 `flex: 1` 축약형을 쓰지 않는다 → native에서 적용되지 않았다. Box는 `flexGrow`·`flexShrink`, Stack은 `grow`·`shrink` prop을 쓰고 필요하면 `style={{ flexBasis: 0 }}`을 더한다.
- 높이가 정해진 영역을 채워야 하는 예제(자체 스크롤 컨테이너, 하단에 고정한 Footer·CTA 등)는 `layout.ts`에 `fill`로 등록하고 루트를 `flex: 1; min-height: 0`(Box는 `flexGrow`, Stack은 `grow`와 `minHeight="0"`)으로 둔다. 문서 MDX에는 `height`를 준다. 빠지면 `LynxComponentExample`이 오류를 낸다.
- 문서 MDX `height`는 `fill` 예제와 overlay·popover가 펼쳐질 공간이 필요한 예제에만 준다. 나머지는 미리보기가 내용 높이(최소 320px)를 따른다.
- 좁은 화면을 넘는 고정 너비 대신 `width: 100%`와 `max-width`를 쓴다. 고정 높이는 그 값이 시나리오의 대상일 때만 쓴다(예: 스크롤 영역 높이).

### 스타일

- 공유 스타일을 쓰면 `import "./styles";`를 첫 import로 둔다. 스타일이 컴포넌트보다 먼저 등록돼야 한다.
- `styles.ts`는 `@seed-design/lynx-css/base.css`와 예제용 `./preview.css`만 import한다. 컴포넌트가 소유한 Recipe CSS는 예제에서 import하지 않는다.
- 예제용 규칙이 남지 않은 컴포넌트는 `preview.css`·`styles.ts`와 `import "./styles";`를 지운다.

### 코드

- entry는 예제 컴포넌트 하나를 default export한다. 예제 안에서 `root.render()`를 호출하지 않는다 → 독립 실행 bootstrap은 `standalone.tsx`가 맡는다.
- 새 예제나 대상 컴포넌트 import를 고치는 예제 → Lynx registry 항목이 있으면 `@/components/ui/<name>`(`docs/registry/lynx/ui/`)을 import한다. registry가 없는 package-only 컴포넌트만 `@seed-design/lynx-react` 공개 export를 직접 쓴다. 기존 예제의 일괄 변경은 별도 작업으로 한다.
- 사용자 이벤트는 Lynx 이벤트 prop(`bindtap` 등)으로 받는다. background thread에서 실행할 handler에는 `"background only"` 지시문을 둔다.
