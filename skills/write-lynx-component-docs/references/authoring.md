# 문서와 예제 작성 규칙

## 목차

- [React 문서를 기준으로 삼기](#react-문서를-기준으로-삼기)
- [문서 페이지](#문서-페이지)
- [Lynx 호환성 frontmatter](#lynx-호환성-frontmatter)
- [실행 예제 연결](#실행-예제-연결)
- [엔트리 구성](#엔트리-구성)
- [예제 설계](#예제-설계)
- [이벤트 핸들러 선택](#이벤트-핸들러-선택)
- [네이티브 전용 안내](#네이티브-전용-안내)
- [이미지 자산](#이미지-자산)

## React 문서를 기준으로 삼기

Lynx 문서와 예제를 처음부터 새로 설계하지 않는다. 같은 컴포넌트의 React 문서와 예제를 먼저 읽고, 사용자가 배워야 할 기능과 시나리오를 기준점으로 삼는다.

```text
docs/content/react/components/<component>.mdx
docs/examples/react/<component>/*.tsx
```

다음 순서로 비교한다.

1. React 문서의 섹션 순서, 예제 제목, 시나리오 파일 목록을 수집한다.
2. 각 시나리오가 Lynx 공개 API와 런타임에서 지원되는지 확인한다.
3. 지원되는 시나리오는 목적과 화면 결과를 유지한 채 ReactLynx 코드로 옮긴다.
4. API나 렌더링 방식이 다르면 Lynx 사용법으로 바꾸고 차이를 설명한다.
5. 지원되지 않는 시나리오는 작동하는 것처럼 흉내 내지 않고 `Lynx 미지원 기능`에 이유와 대안을 적는다.

시나리오를 다음 셋으로 분류하면 누락과 무리한 이식을 줄일 수 있다.

| 분류 | 처리 |
| --- | --- |
| 동일 지원 | React 예제의 목적, 문구, 상태를 유지하고 Lynx 엔트리 형식으로 변환한다. |
| Lynx식 변환 필요 | 컴파운드 구조, 이벤트 prop, 이미지·CSS 차이를 Lynx 공개 API에 맞게 바꾼다. |
| 미지원 | 실행 예제를 만들지 않고 문서의 차이·미지원 섹션에 기록한다. |

코드를 기계적으로 복사하지 않는다. React의 `onClick`, DOM 요소, 브라우저 API, SVG, CSS가 Lynx에서도 같은 의미라고 가정하지 않는다. 다음 항목은 반드시 다시 결정한다.

- import 출처와 컴포넌트의 공개 export
- 단일 컴포넌트와 compound component 구조 차이
- `onClick` 같은 React 이벤트와 `bindtap` 같은 Lynx 이벤트의 대응
- background thread와 main thread 경계
- HTML·SVG 요소와 Lynx element의 대응
- CSS 속성, 단위, 이미지 형식의 Lynx·WebLynx 지원 여부
- `<page>`, 테마 className, `root.render()`를 포함한 독립 엔트리 구성

예를 들어 React `ActionButton`의 Loading 예제는 “탭하면 잠시 loading 상태가 된다”는 목적과 문구를 유지한다. Lynx에서는 `onClick`을 `bindtap`으로 바꾸고, 사용자 정의 컴포넌트 경계를 통과하는 상태 변경 핸들러에 `"background only"`를 둔다.

React `Switch`의 Listening to Value Changes 예제는 같은 count와 last value를 보여주되 Lynx compound API를 사용한다. `false`가 텍스트 자식으로 사라지지 않도록 출력 값은 `JSON.stringify(lastValue)`로 표시한다.

React에 대응 문서가 없으면 가까운 Lynx 컴포넌트의 문서 구조를 참고한다. 이 경우에도 대상 컴포넌트의 공개 API와 실제 런타임 동작을 기준으로 시나리오를 결정한다.

## 문서 페이지

`docs/content/lynx/components/<component>.mdx`에 컴포넌트 문서를 둔다. 새 문서는 `docs/AGENTS.md`의 frontmatter 규칙을 따른다. 본문은 한국어로 작성하고 API 이름과 코드 식별자는 원문 표기를 유지한다.

기존 문서와 컴포넌트 특성에 맞춰 다음 내용을 구성한다.

1. 설치 방법
2. Props와 공개 API
3. 기본 사용법과 주요 변형
4. 상태·상호작용 예제
5. 웹 버전과 다른 점
6. 지원하지 않는 기능

차이가 없는 섹션을 억지로 만들지 않는다. 웹 버전과 다르거나 Lynx에서 지원하지 않는 동작은 명시적으로 적는다.

지원 범위가 같으면 React 문서의 예제 제목, 순서, 시나리오 파일명을 유지한다. 다르게 구성할 때는 Lynx API 차이 또는 미지원 사유가 문서에 드러나야 한다. Lynx에만 필요한 설치, 실행, 플랫폼 차이 안내는 별도 섹션으로 추가한다.

## Lynx 호환성 frontmatter

Lynx 컴포넌트 문서를 새로 쓰거나 기존 문서의 컴포넌트 사용법을 바꾸면 `lynx` frontmatter도 확인한다. 내부 서비스나 특정 앱의 지원 현황을 출처로 사용하지 않는다. 공개 저장소에 남아도 재현할 수 있도록 다음 공식 자료만 버전 근거로 사용한다.

- [Lynx API 인덱스](https://lynxjs.org/api/index.html)
- [Lynx Compatibility Data](https://github.com/lynx-family/lynx-website/tree/main/packages/lynx-compat-data)

API 페이지의 Compatibility 표는 Lynx Compatibility Data를 렌더링한다. 표가 텍스트 추출 결과에 나오지 않으면 브라우저에서 표를 확인하거나 표의 `View Source` 링크로 연결된 JSON을 읽는다. 데이터는 용도에 따라 다음 경로에서 찾는다.

| 사용 기능 | 호환성 데이터 경로 |
| --- | --- |
| Lynx 엘레먼트와 attribute·method·event | `elements/*.json` |
| `lynx.*`, MainThread, SelectorQuery 등 | `lynx-api/**/*.json`, `react/**/*.json` |
| CSS 속성·값·selector | `css/**/*.json` 또는 공식 API 페이지의 Compatibility 표 |
| 그 밖의 렌더링 기능 | `features/*.json` |

다음 순서로 frontmatter를 작성한다.

1. `packages/lynx-react`의 대상 컴포넌트와 내부에서 호출하는 훅·하위 컴포넌트를 따라가며 Lynx API, main-thread API, 구문, CSS 기능, 엘레먼트를 목록으로 만든다.
2. 기본 경로뿐 아니라 prop에 따라 실행되는 조건부 경로와 전이 의존성도 포함한다. 예제 파일만 보고 판단하지 않는다.
3. 목록의 각 항목을 공식 API 상세 페이지와 대응하는 호환성 JSON에서 찾는다. 대상 컴포넌트가 실제로 쓰는 attribute·method·event의 항목까지 확인한다.
4. Android와 iOS의 `version_added`를 비교한다. 두 플랫폼에서 필요한 버전 중 높은 값을 그 기능의 최소 버전으로 삼는다.
5. 모든 사용 기능의 최소 버전 중 가장 높은 값을 `lynx.engine`에 적는다. SEED의 최소 지원 버전보다 낮아도 조사한 값을 그대로 적는다. 문서 렌더러가 표시값을 보정한다.
6. 공식 엘레먼트 페이지 제목에 `XElement` 배지가 있으면 `x-elements`에 추가한다. `name`에는 태그 이름을 쓰고, `version`에는 그 엘레먼트에서 실제로 사용하는 항목의 Android·iOS `version_added` 중 가장 높은 값을 적는다.

```yaml
lynx:
  engine: "3.9"
  x-elements:
    - name: viewpager
      version: "3.9"
```

`version_added: true`는 버전 번호 없이 지원됨을 뜻하므로 최소 버전을 올리지 않는다. `false`는 미지원이다. Android나 iOS 중 하나가 `false`이면 지원되는 것으로 문서화하지 말고 플랫폼 제한 또는 대체 구현을 확인한다. 값이 없거나 공식 자료끼리 충돌하면 버전을 추정하지 않는다. 핵심 경로의 최소 버전을 확정하지 못한 경우 `lynx`를 작성하지 않고 확인하지 못한 항목과 출처를 작업 결과에 남긴다.

일반 `<view>`, `<text>`처럼 내장 엘레먼트는 Engine 계산에는 포함하지만 `x-elements`에는 넣지 않는다. 직접 사용, 전이 사용, 조건부 사용으로 확인한 XElement는 모두 나열하며 이름이 같은 항목은 한 번만 적는다.

## 실행 예제 연결

예제는 `docs/examples/lynx/<component>/<scenario>.tsx`에 둔다. 컴포넌트와 시나리오 디렉터리·파일 이름은 kebab-case를 사용한다. 각 TSX 파일은 하나의 실행 엔트리만 제공한다.

MDX에서는 예제 이름과 코드 원본 경로를 같은 값으로 맞춘다.

```mdx
<LynxComponentExample name="lynx/switch/value-changes">
  ```json doc-gen:file
  {"file":"examples/lynx/switch/value-changes.tsx","codeblock":true}
  ```
</LynxComponentExample>
```

## 엔트리 구성

공유 스타일을 사용하는 엔트리는 스타일을 가장 먼저 불러온다.

```tsx
import "./styles";

import { root } from "@lynx-js/react";
import { Switch } from "@seed-design/lynx-react";

function Root() {
  return (
    <page>
      <Switch />
    </page>
  );
}

root.render(<Root />);
```

`styles.ts`는 base CSS와 예제용 CSS만 등록한다.

```ts
import "@seed-design/lynx-css/base.css";
import "./preview.css";
```

컴포넌트 패키지가 소유한 recipe CSS는 예제에서 직접 import하지 않는다. 엔트리에서 `styles.ts`를 컴포넌트보다 나중에 불러오면 base CSS가 recipe CSS를 덮을 수 있으므로 import 순서를 유지한다.

## 예제 설계

- 한 예제에는 한 가지 사용법이나 상태만 담는다.
- `@seed-design/lynx-react`의 공개 API를 실제 앱과 같은 방식으로 사용한다.
- 같은 컴포넌트의 기존 예제에서 이벤트 prop과 스레드 지시어 사용법을 먼저 찾는다.
- 컴포넌트 상태를 별도 텍스트로 보여줄 때 boolean, `null`, 숫자 값은 `JSON.stringify(value)`로 표시한다. 특히 `false`는 JSX 자식으로 직접 넣으면 화면에 보이지 않을 수 있다.
- 웹 미리보기를 맞추기 위해 실제 앱에서 쓰지 않는 래퍼, 간격 보정, 스타일 예외를 추가하지 않는다.
- 지원하지 않는 기능은 동작하는 것처럼 꾸미지 말고 문서에서 제한으로 설명한다.

## 이벤트 핸들러 선택

일반 `bind*`·`catch*` 이벤트는 배경 스레드에서 실행된다. React 상태 변경, 비즈니스 로직, 분석 이벤트, 네트워크 요청에는 일반 이벤트나 컴포넌트의 공개 콜백을 사용한다. 꼭 필요한 경우가 아니라면 `main-thread:*` 핸들러를 등록하지 않는다.

사용자 정의 컴포넌트의 prop을 거쳐 네이티브 이벤트에 연결되는 콜백은 컴파일러가 배경 스레드 경계를 추론하지 못할 수 있다. `ActionButton`의 `bindtap`처럼 컴포넌트 경계를 통과하는 핸들러에서 상태를 바꾸거나 background-only API를 호출하면 함수 첫 줄에 `"background only"`를 둔다.

```tsx
function handleTap() {
  "background only";
  setLoading(true);
}

<ActionButton loading={loading} bindtap={handleTap}>
  시간이 걸리는 액션
</ActionButton>
```

컴포넌트가 제공하는 값 변경 콜백은 기존 예제와 공개 API의 실행 문맥을 따른다. 단순한 React 상태 갱신을 위해 main-thread 핸들러를 추가하지 않는다.

```tsx
<Switch.Root
  onCheckedChange={(checked) => {
    setCount((previous) => previous + 1);
    setLastValue(checked);
  }}
>
  {/* ... */}
</Switch.Root>
```

`main-thread:*`는 스크롤·드래그와 동시에 요소 스타일이나 애니메이션을 갱신해야 하는 경우처럼 동기적인 화면 반응이 요구될 때만 사용한다. 이 경우 핸들러 첫 줄에 `"main thread"`를 두고, React 상태나 background-only API가 필요하면 `runOnBackground()`로 경계를 넘는다.

```tsx
function handleScroll(event: MainThread.IScrollEvent) {
  "main thread";
  event.currentTarget.setStyleProperty("opacity", String(event.detail.scrollTop / 100));
}

<scroll-view main-thread:bindscroll={handleScroll}>{/* ... */}</scroll-view>
```

다음과 같이 단순한 상태 변경을 main thread에서 처리하지 않는다.

```tsx
// 피해야 할 예: React 상태 변경에는 일반 bindtap을 사용한다.
function handleTap() {
  "main thread";
  setLoading(true);
}

<ActionButton main-thread:bindtap={handleTap}>실행</ActionButton>
```

## 네이티브 전용 안내

웹 문서 미리보기에서 확인할 수 없는 동작은 관련 예제 바로 아래에 짧은 콜아웃을 둔다. 원인 설명보다 사용자가 확인할 방법을 먼저 쓴다.

아이콘의 `tint-color`처럼 네이티브에서만 최종 결과를 확인할 수 있는 경우 다음 수준으로 안내한다.

> 문서 미리보기에서는 아이콘 색상이 적용되지 않아요. 아이콘의 실제 색상은 QR 코드 탭에서 Lynx Explorer를 실행해 확인할 수 있어요.

콜아웃은 실제 네이티브 동작을 확인한 뒤 작성한다. 미확인 상태를 정상 동작으로 단정하지 않는다.

## 이미지 자산

WebLynx가 표시할 수 있는 형식이 네이티브 자산과 다르면 문서 예제용 자산을 `docs/` 범위에서 준비한다. 자산 호환성을 이유로 실제 배포 컴포넌트의 아이콘 API나 내부 렌더링을 바꾸지 않는다.
