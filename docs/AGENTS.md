# docs

## 디렉토리 개요

SEED Design **문서 사이트**. Next.js + Fumadocs 기반. 컴포넌트 문서, 디자인 가이드라인, Storybook을 제공한다. `content/` 구조 변경 시 `packages/docs-mcp/src/config.ts` 동기화 필수.

## 파일 작성 컨벤션

- 문서는 역할 중심 도메인으로 분리하고, 새로운 문서 영역 추가 시 관련 매핑/동기화 규칙을 함께 갱신한다.
- MDX 파일명은 `kebab-case`를 사용한다.

## 코드 작성 컨벤션

- Frontmatter에 `title`, `description`을 필수로 포함한다.
- 문서 UI와 스토리는 문서 본문과 분리된 참조 계층으로 관리한다.
- **`docs/registry/{react,lynx}/ui/`의 snippet 레이어 변경은 최소한으로 한다.** snippet은 사용자가 직접 커스터마이징하는 레이어이므로, 불필요한 변경은 사용자 코드에 영향을 줄 수 있다.
- `docs/registry/{react,lynx}/ui/` snippet은 단순 예제가 아니라 stable user API로 취급한다. snippet을 만들 때는 low-level re-export보다 convenience wrapper를 우선 검토한다.
- snippet을 추가하거나 바꿀 때는 먼저 사용자가 작성할 **minimal user code** 예시를 떠올리고, 그 예시에 맞춰 API를 정한다.
- snippet 변경 후에는 source 파일만 보지 말고 generated registry(`docs/public/__registry__/`)가 함께 갱신됐는지 확인한다.
- vendored snippet consumer가 있으면 그 경로도 함께 확인한다. 현재는 `examples/stackflow-spa/src/seed-design/ui/`가 대표적이다.
- **`content/` 하위에 AGENTS.md를 두지 않는다.** fumadocs가 `content/` 전체를 스캔하여 `.md` 파일을 문서 콘텐츠로 인식하므로 frontmatter 에러가 발생한다.

### 스타일링 컨벤션

특정 컴포넌트/위젯을 겨냥한 시각 스타일은 `app/global.css`가 아니라 **그 컴포넌트 안에서 inline Tailwind(className)** 로 처리한다. 대상 컴포넌트가 없으면 만들어서 거기서 스타일링한다. `global.css`는 아래 "문서 전체 예외"만 담는다.

- **`global.css`에 남기는 것(예외)만:**
  - 빌드 설정(`@import`/`@source`), 디자인 토큰(`:root`/`.dark`/섹션 색상 변수), 루트 `html` 폰트
  - `<html>`/`<body>` 레벨·외부 라이브러리(Lenis)·fumadocs가 소유해 붙일 컴포넌트가 없는 DOM(`#nd-toc`)
  - 문서 전체 base reset·타이포(`strong`, 코드 `user-select`, `.prose` 제목 굵기, `article .prose` 여백)
- **컴포넌트-지정 스타일에 `global.css`의 `!important`로 recipe를 이기지 않는다.** SEED recipe는 unlayered이므로 아래 방법으로 specificity를 확보한다:
  - 상태/토큰 override → inline `style` prop (예: `components/tabs/chip-tab-trigger.tsx` — hover/active는 Tailwind로 표현 안 되면 controlled state로 계산)
  - 마크다운이 생성한 native 자식(`th/td/tr` 등) → arbitrary child selector `[&_...]` (예: `components/table.tsx`의 `TableRoot`)
  - SEED preset에 없는 유틸(`scale-*`/transform) → arbitrary property `[transform:scale(1.05)]` (예: `components/catalog/card.tsx`)
- 마크다운 원소 타입 전체(모든 표/제목/코드 등)를 겨냥해야 하면 `components/mdx-components.tsx`에서 그 원소를 오버라이드하고 거기서 Tailwind로 스타일링한다. 단, 문서 전체 base 성격이면 위 예외로 `global.css`에 둔다.
- **함정 (cascade layer):** Fumadocs/base가 **unlayered**로 건 규칙(예: `.shiki`의 `--padding-*`, `article .prose` 여백)은 `@layer utilities`로 컴파일되는 Tailwind 유틸(arbitrary 포함)로 못 이긴다(unlayered가 모든 `@layer`를 이김). 이때는 inline `style`(specificity 1000, unlayered)로 얹거나, 그 규칙이 문서 전체 레이아웃이면 짝이 되는 override도 `global.css`에 unlayered로 둔다(예: `article .prose` 여백을 상쇄하는 `.changelog-page .prose`). 옮기기 전에 실제로 이겨서 렌더가 바뀌는지 확인할 것.
- **회색은 SEED 토큰·hue-free 우선:** SEED Docs의 회색 표면은 푸른기가 없어야 한다. fumadocs `fd-*`는 기본이 Tailwind **slate(쿨)** 라 `app/global.css`의 `:root`/`.dark`에서 SEED 중립 토큰으로 매핑해 둠(surface→`bg-neutral-weak`, border/input→`stroke-neutral-muted`, ring→`stroke-neutral-weak`, text→`fg-neutral(-muted)`). 새 회색을 넣을 때:
  - **인터랙션 상태(hover/active/selected/pressed)·보더**는 완전 hue-0인 SEED **static-alpha**(`bg-transparent-selected`/`-pressed`, `stroke-neutral-muted`)를 쓴다(예: prev/next·SideNavigation active, 검색/헤더 버튼).
  - SEED `palette-gray` **불투명 fill은 다크에서 쿨**(B>G>R)이다 → `bg-neutral-weak`·`bg-layer-floating`을 다크 표면 배경으로 쓰지 말 것. 다크에 hue-0 불투명 표면이 필요하면 중립인 `bg-fd-popover`/`bg-fd-card`.
  - 공유 SEED recipe가 칠하는 표면(예: NavigationMenu flyout = `--seed-color-bg-layer-floating`)은 recipe를 고치지 말고, docs 래퍼에서 그 변수만 중립으로 재정의한다(예: `components/header/docs-nav-menu-content.tsx`의 `[--seed-color-bg-layer-floating:var(--color-fd-popover)]`).

### Lynx 문서 작성 가이드 (`content/lynx/`)

Lynx 컴포넌트 문서를 작성할 때는 **웹 버전과의 차이점을 반드시 문서화**한다. 사용자가 웹에서 Lynx로 전환할 때 혼란을 줄이기 위해 다음 관점을 확인한다:

- **렌더링 방식 차이**: Lynx에서 지원하지 않는 웹 기능(SVG, 특정 CSS 속성 등)으로 인한 대체 구현
- **API 차이**: props 차이, 컴파운드 컴포넌트 구조 차이, 이벤트 핸들링(`bindtap` 등)
- **누락 기능**: 웹에는 있지만 Lynx에서 미지원인 기능

Lynx Engine 최소 버전과 사용 XElement가 확정된 컴포넌트는 frontmatter의 `compatibility.lynx`에 작성한다. 화면과 llms.txt는 이 값을 자동으로 렌더링한다.

```yaml
compatibility:
  lynx:
    engine: "2.5"
    x-elements:
      - viewpager
```

- `engine`에는 해당 컴포넌트를 사용할 수 있는 실제 최소 버전을 적는다.
- `engine`이 SEED의 최소 지원 버전인 3.6보다 낮으면 화면과 llms.txt에는 3.6으로 표시한다. frontmatter에는 조사한 실제 요구 버전을 유지한다.
- `x-elements`에는 컴포넌트가 사용하는 XElement 태그 이름만 적는다. XElement별 버전은 관리하지 않는다.
- XElement와 관련이 없으면 `x-elements`를 생략한다.
- 직접 사용과 전이·조건부 사용을 구분하지 않고, 컴포넌트와 관련된 XElement를 모두 같은 형식으로 나열한다.
- 확정된 버전이 없으면 `compatibility.lynx`를 생략한다. `unknown`이나 추정값은 입력하지 않는다.
- `<AvailableSince />`는 SEED 패키지 출시 버전을 뜻하므로 그대로 유지한다.

## 콘텐츠 작성 룰 (`content/`)

- 컴포넌트/훅 문서를 신설하면 frontmatter 직후에 `<AvailableSince />`를 넣는다.
  - 형식: `<AvailableSince packages="@seed-design/react@2.1.0, @seed-design/css@2.3.0" />` (콤마로 구분)
  - 패키지 매핑: react components → react + css / react stackflow → stackflow + css / lynx components → lynx-react + lynx-css / lynx hooks → lynx-react
  - 버전은 **그 항목이 처음 사용 가능해진 버전**이다. 새로 만드는 컴포넌트/훅이면 그게 곧 문서와 함께 나갈 다음 릴리스(현재 버전 + changeset bump)이고, 이미 릴리스된 항목의 문서를 뒤늦게 추가하는 경우에는 문서가 나갈 버전이 아니라 그 항목이 실제로 나갔던 버전을 적는다.
- 문서에 새 MDX 컴포넌트를 도입하면 llms 변환 룰과 fixture를 함께 추가한다 ([app/\_llms/AGENTS.md](app/_llms/AGENTS.md) 참조). 룰이 없으면 llms.txt에 raw JSX가 그대로 새어나간다.
- "SEED"는 "SEED Design System"의 줄임말이다. 풀어 쓰거나 "SEED"로 줄여 쓰고, 중간 표기인 "SEED Design"은 산문에서 쓰지 않는다 (패키지명·저장소명은 예외).
- `featured: true`(사이드바 강조 dot)는 동시에 3개 안팎으로 유지하고 오래된 것부터 뗀다. 개수가 늘면 강조가 의미를 잃는다.
