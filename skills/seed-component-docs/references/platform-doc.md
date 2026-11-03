# React·Lynx 문서 작성

`docs/content/react/components/<name>.mdx`와 `docs/content/lynx/components/<name>.mdx`는 설치·import·prop 계약·동작 세부를 코드와 실행 예제로 설명한다. 가이드 문서가 "해야 한다"를 쓰면 플랫폼 문서는 "한다"를 쓴다. 기준 문서는 React `search-input.mdx`(단순)·`select.mdx`(compound), Lynx `search-input.mdx`·`select.mdx`다.

이 문서는 문장과 구조만 정한다. 예제 파일 위치·import 출처·엔트리 형식은 `seed-component`의 [implementation-steps.md](../../seed-component/references/implementation-steps.md)「Step 6: Examples」「문서 업데이트」, Lynx의 배포 경로·React 대응 기록·호환성 frontmatter·네이티브 검증은 [lynx-docs.md](../../seed-component/references/lynx-docs.md)와 [lynx-docs-authoring.md](../../seed-component/references/lynx-docs-authoring.md), frontmatter·`AvailableSince`·Props 표 노출 규칙은 `docs/AGENTS.md`를 따른다.

## 절 순서

- React: `AvailableSince` → preview → (도입 문단) → `## Installation` → `## Usage` → `## Props` → `## Examples` → `## Accessibility` → (심화: `## Scale Feedback`, `## Localization`).
- Lynx: 같은 순서 뒤에 `## 웹 버전과의 차이` → `## Lynx 미지원 기능`. 두 절은 실제 항목이 있을 때만 둔다. 기존 문서의 `## Web Version Differences`·`## Unsupported Lynx Features` 표기는 그 파일 안에서만 유지한다.
- 절 제목은 영어다. `## 설치`·`## 속성`처럼 한국어 제목을 새로 쓰지 않는다.
- Lynx 문서의 `###` 예제 제목·순서·시나리오 파일명은 React 문서와 같게 유지하고, 다른 점은 그 자리에서 설명한다.

## 절별 형식

도입: preview 바로 아래에 "언제 쓰지 말아야 하는지"나 대안 컴포넌트를 한 문단 또는 `<Card title="Alert Dialog" href="/react/components/alert-dialog" variant="example">`로 둔다. 링크는 같은 플랫폼 안에서만 건다(가이드 `/components/`로의 링크는 두지 않는다).

```mdx
<AvailableSince packages="@seed-design/react@3.1.0, @seed-design/css@3.1.0" />

<ComponentExample name="react/search-input/preview">
  ```json doc-gen:file
  { "file": "examples/react/search-input/preview.tsx", "codeblock": true }
  ```
</ComponentExample>
```

Lynx는 `<LynxComponentExample name="lynx/select/preview" height={400}>`이고 overlay·fill 예제에만 `height`를 준다.

Installation:

```mdx
## Installation

```package-install
npx @seed-design/cli@latest add ui:search-input
```

<ManualInstallation name="search-input" />          {/* Lynx: <LynxManualInstallation name="..." /> */}
```

- `@latest`를 뺀 CLI 명령을 쓰지 않는다.
- 의존 snippet이 함께 설치되면 한 문장으로 알린다: `CLI로 설치하면 Search Bar가 사용하는 ui:app-bar와 ui:search-input도 함께 설치됩니다.`
- package-only 컴포넌트는 Installation 대신 `## Usage`에서 `import { ImageFrame } from "@seed-design/react";`로 시작한다. Lynx package-only는 `package-install` 블록에 패키지명을 쓰고 `Callout`으로 snippet이 없음을 알린다.
- Engine 설정이 필요한 Lynx 컴포넌트는 `### 요구 사항`에 이유 한 문장과 `lynx.config.ts` 코드 블록을 둔다(pull-to-refresh.mdx).

Usage: import 한 블록 + 최소 JSX 한 블록. compound면 파트별 역할 목록을 붙인다: `` - `SelectGroup`: 관련 Item을 묶습니다. 모든 `SelectItem`은 `SelectGroup` 안에 있어야 합니다. ``

Props: `<react-type-table path="./registry/react/ui/search-input.tsx" name="SearchInputProps" />`. compound면 파트별 `### \`SelectRoot\``. 표에 안 담기는 계약(기본 접근성 레이블, `inputProps` 전달 대상, `ref`가 가리키는 요소)은 표 아래 문단으로 쓴다. Lynx에서 고유 prop이 없는 파트는 `고유 prop이 없습니다. \`className\`, \`style\`, \`children\`, \`bindtap\`을 받습니다.`

Examples: `### 제목` → 동작 계약 1~2문단 → 예제. 제목 아래 예제만 두지 않는다. 제목은 영어 Title Case(`Listening to Value Changes`, `Field Integration`), prop 이름은 백틱(`` ### `onOpenChange` Details ``). 예제가 필요 없는 시나리오(동작 설명만, Lynx 미지원)는 문단만 둔다.

```mdx
### Submit

Enter를 누르면 `onSubmit`이 현재 값과 함께 호출됩니다. 한글처럼 IME로 조합 중인 글자를 확정하는 Enter는 제출로 처리하지 않습니다.

제출한 뒤에는 입력의 focus를 해제해 모바일 키보드를 내립니다. 제출 뒤에도 계속 입력하게 하려면 `blurOnSubmit={false}`를 사용하세요.

<ComponentExample name="react/search-input/submit">
  ```json doc-gen:file
  { "file": "examples/react/search-input/submit.tsx", "codeblock": true }
  ```
</ComponentExample>
```

Accessibility: 루트 role과 렌더 요소, 레이블이 없을 때 필요한 `aria-label`과 개발 모드 경고 조건, 컴포넌트가 책임지지 않는 동작과 그것을 맡는 곳을 불릿으로 쓴다.

Lynx 차이·미지원: 불릿 목록이다. 미지원 항목은 대안을 함께 쓴다.

```mdx
## 웹 버전과의 차이

- 제출은 Enter 키의 `keydown` 대신 Lynx `<input>`의 `bindconfirm`(키보드의 검색 키)으로 처리합니다.

## Lynx 미지원 기능

- HTML form 제출과 브라우저 validation은 지원하지 않습니다. `onValueChange`로 앱 상태를 갱신하고 제출 action에서 검증하세요.
```

네이티브에서만 결과가 보이는 예제 아래 콜아웃: `이 예제는 네이티브 키보드 동작을 사용합니다. QR 코드 패널에서 Lynx Explorer로 실행한 뒤 입력 영역을 탭해 확인해 주세요.` 콜아웃을 쓰기 전 확인 절차는 [lynx-docs-authoring.md 네이티브 전용 안내](../../seed-component/references/lynx-docs-authoring.md#네이티브-전용-안내)다.

## 문체

- "~합니다" 서술형. 권장은 "~하세요", 필수는 "~해야 합니다", 금지는 "~하지 마세요". "~해요"는 쓰지 않는다.
- 문장 패턴: `` `prop`을 사용하면 ~할 수 있습니다. `` + `기본값은 x입니다.` + `~하려면 prop={false}를 사용하세요.` + 책임 경계(`~는 Pagination이 아니라 목록 영역에서 처리하세요`).
- 컴포넌트 이름은 띄어 쓴 영어(Search Input), 코드 식별자는 백틱(`SearchInput`), 산문에서는 `SEED` 또는 `SEED Design System`.
- 외부 라이브러리 비교와 향후 계획은 쓰지 않는다. 미지원 사유는 `CSS variable 동적 주입 제한`처럼 끝내지 말고 사용자가 할 행동을 붙인다.

## 끝내기 전 확인

1. 절 순서가 위와 같고 `###` 예제마다 설명 문단이 있다.
2. `ComponentExample`·`LynxComponentExample`의 `name`과 `doc-gen:file`의 `file`이 같은 `<platform>/<component>/<scenario>`를 가리키고 파일이 존재한다.
3. Props 표 경로가 실제 파일이고, Lynx는 React 대응 문서와 예제 제목·순서가 같다.
4. CLI 명령에 `@latest`가 있고, 본문에 "~해요"와 가이드 문서로의 링크가 없다.
5. `AvailableSince`·`compatibility.lynx`는 `docs/AGENTS.md` 규칙대로 확정값만 있다.
