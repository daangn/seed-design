# 문서와 예제 작성 규칙

Lynx 문서 MDX와 `docs/examples/lynx/` 실행 예제의 형식 규칙이다. 작업 순서, 배포 경로, React 대응 기록은 [Lynx 문서·예제 작업](lynx-docs.md)이 맡는다. 예제 파일 경로·이름, entry 형식, import 출처, `"background only"` 기본 규칙은 `docs/examples/lynx/AGENTS.md`, 새 문서의 frontmatter와 `<AvailableSince />`는 `docs/AGENTS.md`를 따른다.

읽을 절:

- MDX 페이지를 새로 쓰거나 섹션을 바꿈 → [문서 페이지](#문서-페이지)
- 새 문서이거나 사용법·Engine 의존 기능·XElement·CSS 사용을 바꿈 → [Lynx 호환성 frontmatter](#lynx-호환성-frontmatter)
- 예제를 추가하거나 MDX에 연결함 → [실행 예제 연결](#실행-예제-연결), [엔트리 구성](#엔트리-구성), [예제 설계](#예제-설계)
- React 예제를 Lynx로 옮김 → [React 예제 옮기기](#react-예제-옮기기), [이벤트 핸들러 선택](#이벤트-핸들러-선택)
- 미리보기에서 확인할 수 없는 native 동작·자산이 있음 → [네이티브 전용 안내](#네이티브-전용-안내), [이미지 자산](#이미지-자산)

## React 예제 옮기기

코드를 기계적으로 복사하지 않는다. 새·변경 예제에서 React와 Lynx 사용법이 갈리는 지점만 다시 정한다.

- import 출처와 공개 export → [배포 경로 확인](lynx-docs.md#배포-경로-확인)
- 단일 컴포넌트와 compound component 구조 차이
- `onClick` 같은 React 이벤트와 `bindtap` 같은 Lynx 이벤트, background·main thread 경계 → [이벤트 핸들러 선택](#이벤트-핸들러-선택)
- HTML·SVG 요소와 Lynx element의 대응
- CSS 속성, 단위, 이미지 형식의 Lynx 런타임·브라우저 미리보기 지원 여부

기준 예제:

- React `ActionButton` Loading → `docs/examples/lynx/action-button/loading.tsx`. "탭하면 잠시 loading 상태가 된다"는 목적과 문구를 유지하고, `onClick`을 `bindtap`으로 바꾸고, 상태를 바꾸는 핸들러 첫 줄에 `"background only"`를 둔다.
- React `Switch` Listening to Value Changes → `docs/examples/lynx/switch/value-changes.tsx`. Registry `Switch`에 `label`·`onCheckedChange`를 넘겨 같은 count와 last value를 보여주고, last value는 `JSON.stringify`로 표시한다.

## 문서 페이지

위치는 `docs/content/lynx/components/<component>.mdx`다. 본문은 한국어로 쓰고 API 이름과 코드 식별자는 원문 표기를 유지한다.

- React 대응 문서가 있음 → 그 공통 섹션 순서, 예제 제목, 시나리오 파일명, 사용자 결과를 유지한다. 다르게 구성하면 Lynx API 차이나 미지원 사유가 문서에 드러나야 한다.
- 섹션은 필요한 것만 React 대응 위치에 둔다: 설치 방법, Props와 공개 API, 기본 사용법과 주요 변형, 상태·상호작용 예제, 웹 버전과의 차이, Lynx 미지원 기능.
- 웹과 차이가 없거나 미지원 기능이 없음 → 해당 섹션을 만들지 않는다. 차이나 미지원 동작이 있으면 반드시 적는다.
- 차이·미지원 섹션 제목 → 새 문서는 `## 웹 버전과의 차이`, `## Lynx 미지원 기능`으로 쓴다. 기존 문서에는 `## Web Version Differences`, `## Unsupported Lynx Features`도 섞여 있으니 그 파일의 표기를 유지한다.
- Lynx에만 필요한 설치·실행·플랫폼 안내 → 공통 흐름을 깨지 않는 위치에 둔다.

## Lynx 호환성 frontmatter

새 Lynx 문서이거나 문서화한 사용법·Engine 의존 기능·XElement·CSS 사용을 바꿨을 때만 `compatibility.lynx`를 갱신한다. 문구나 코드 노출만 고치고 실행 경로가 그대로면 기존 값을 다시 조사하지 않는다. 형식 예(`docs/content/lynx/components/alert-dialog.mdx`):

```yaml
compatibility:
  lynx:
    engine: "3.5"
    x-elements:
      - overlay
```

1. 바뀐 사용법이 실제로 호출하는 Lynx API, main-thread API, 구문, CSS 기능, element, 조건부 경로만 목록으로 만든다.
2. 항목마다 `find-refer`로 로컬 공식 문서·호환성 데이터 스냅샷을 찾고, API·Engine은 `lynx-api-docs`, CSS는 `lynx-check-css-support`로 Android·iOS `version_added`를 확인한다. 두 플랫폼 중 높은 값이 그 항목의 최소 버전이다.
3. 항목 최소 버전 중 가장 높은 값을 `engine`에 적는다.
4. XElement를 쓰면 `x-elements`에 태그 이름을 한 번씩 적는다.
5. 한 플랫폼이 `false`이거나 핵심 경로의 최소 버전을 확정하지 못함 → 지원으로 문서화하지 않고 제한·대안 또는 미확인 출처를 결과에 남긴다.

함정:

- `version_added: true`는 최소 버전을 올리지 않는다.
- `<view>`, `<text>` 같은 내장 element는 `engine` 계산에는 넣고 `x-elements`에는 넣지 않는다.
- 값이 없거나 공식 자료끼리 충돌함 → 버전을 추정하지 않고 미확인으로 남긴다. 내부 서비스나 특정 앱의 지원 현황을 출처로 쓰지 않는다.

## 실행 예제 연결

MDX의 `LynxComponentExample name`과 doc-gen `file`은 같은 `<component>/<scenario>`를 가리킨다.

```mdx
<LynxComponentExample name="lynx/switch/value-changes">
  ```json doc-gen:file
  {"file":"examples/lynx/switch/value-changes.tsx","codeblock":true}
  ```
</LynxComponentExample>
```

## 엔트리 구성

entry 파일 규칙(default export, `standalone.tsx` bootstrap, `./styles` 첫 import, Recipe CSS import 금지, registry import)은 [`docs/examples/lynx/AGENTS.md`](../../../docs/examples/lynx/AGENTS.md)를 따른다. 기준 예: `docs/examples/lynx/switch/value-changes.tsx`.

- 테마 → 예제 root `<view>`의 className에 `useSeedClassName({ colorMode: "system" })` 결과를 넣는다.

## 예제 설계

내용:

- 한 예제에는 한 사용법이나 상태만 담는다.
- 이벤트 prop과 스레드 지시어는 같은 컴포넌트의 기존 예제를 먼저 찾아 따른다.
- 상호작용 예제 → 초기 상태, 입력 직후 중간 상태, 최종 상태, 전이 시간을 구현한다. handler가 있다는 것만으로 완료 처리하지 않는다.
- 상태를 텍스트로 표시함 → boolean과 `null`은 `JSON.stringify(value)`로 쓴다. `false`를 JSX child로 넣으면 화면에 보이지 않는다. 숫자는 그대로 표시된다.

화면:

- asset → React와 같은 것을 쓴다. 컴포넌트 종류, 크기, 색상, multicolor 여부를 맞추고 의미가 비슷한 다른 자산으로 바꾸지 않는다.
- 문서 host의 중앙 정렬과 padding도 사용자 결과다 → 필요하면 `LynxComponentExample`의 `height`와 내부 frame 크기를 명시하고 좌우·상하 여백을 계산한다.
- React가 Stackflow 같은 플랫폼 전용 화면 셸을 씀 → AppBar, 본문, 하단 CTA의 역할을 같은 Lynx 화면 구조로 옮긴다.
- 웹 미리보기를 맞추려는 wrapper, 간격 보정, 스타일 예외 → 넣지 않는다. 실제 앱에서 쓰는 구조만 두고, 미리보기 한계는 [네이티브 전용 안내](#네이티브-전용-안내)로 알린다.

## 이벤트 핸들러 선택

- React 상태 변경, 비즈니스 로직, 분석 이벤트, 네트워크 요청 → 일반 `bind*`·`catch*` 이벤트나 컴포넌트 공개 콜백을 쓴다. 이들은 background thread에서 실행된다.
- 사용자 정의 컴포넌트의 prop을 거쳐 native 이벤트에 연결되는 핸들러(예: `ActionButton`의 `bindtap`)에서 상태를 바꾸거나 background-only API를 호출함 → 컴파일러가 스레드 경계를 추론하지 못할 수 있으므로 함수 첫 줄에 `"background only"`를 둔다. 예: `docs/examples/lynx/action-button/loading.tsx`.
- 컴포넌트의 값 변경 콜백(`onCheckedChange` 등) → 기존 예제와 공개 API의 실행 문맥을 따른다.
- 스크롤·드래그와 동시에 요소 스타일이나 애니메이션을 동기적으로 갱신해야 함 → `main-thread:*` 핸들러를 쓰고 첫 줄에 `"main thread"`를 둔다. React 상태나 background-only API가 필요하면 `runOnBackground()`로 경계를 넘는다.
- 단순 상태 변경 → main-thread 핸들러(`main-thread:bindtap` 등)로 처리하지 않고 일반 `bindtap`과 `"background only"`를 쓴다.

## 네이티브 전용 안내

1. 콜아웃을 쓰기 전에 [검증 런북](../../seed-verify-lynx-component/references/verification.md#2-문서-예제-선택과-query-직접-진입)의 `examples/lynx-spa` 문서 예제 경로에서 정확한 예제를 직접 확인한다.
2. SPA 예제 ID, query를 포함한 bundle URL, 환경, 결과를 기록한다.
3. 관련 예제 바로 아래에 짧은 콜아웃을 둔다. 원인보다 사용자가 확인할 방법을 먼저 쓴다.

실행 환경이 없음 → 미확인 동작을 정상으로 단정하지 않고 확인하지 못한 범위를 결과에 남긴다.

아이콘 `tint-color`처럼 native에서만 최종 결과가 보이는 경우의 수준:

> 문서 미리보기에서는 아이콘 색상이 적용되지 않아요. 아이콘의 실제 색상은 QR 코드 탭에서 Lynx Explorer를 실행해 확인할 수 있어요.

## 이미지 자산

- 브라우저 미리보기가 표시할 수 있는 형식이 native 자산과 다름 → 문서 예제용 자산을 `docs/` 범위에서 준비한다.
- 자산 호환성 문제 → 배포 컴포넌트의 아이콘 API나 내부 렌더링을 바꾸지 않고 문서 예제 자산으로 해결한다.
