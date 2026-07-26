# 버전 전파 매트릭스 (SEED 2.0)

SEED는 **2.0을 분기점으로 strict semver**를 따른다. breaking change는 **major에서만** 낸다 (1.x처럼 minor에서 내지 않는다).

bump 결정은 두 단계다. 순서대로 밟는다.

1. **분류** — 내가 바꾼 게 major/minor/patch 중 무엇인가
2. **전파** — 그래서 나를 의존하는 패키지가 각각 어떤 bump를 받는가

---

## 1단계. 분류

### 세 줄 규칙

무엇을 바꿨든 먼저 이걸로 판단한다. 대부분 여기서 끝난다.

| 내가 한 일 | bump |
|---|---|
| 소비자가 코드를 안 고쳤는데 **깨지거나 결과가 달라진다** | **`major`** |
| 기존 동작은 그대로 두고 **새로 추가**했다 | **`minor`** |
| 원래 **틀렸던 것을 고쳤다** | **`patch`** |

**"깨진다"는 컴파일 에러만이 아니라 화면이 달라지는 것도 포함한다.** 소비자는 `^2.0.0`으로 minor·patch를 자동으로 받는다. 그래서 minor는 보호 수단이 아니라 공지일 뿐이고, 의도적인 시각 변경을 minor 이하로 내면 아무 예고 없이 남의 화면이 바뀐다. 이걸 막는 건 major뿐이다.

이 규칙의 관절은 **"원래 틀렸었나(patch), 맞았는데 바꾸는 건가(major)"** 하나다. 애매하면 "옛 값이 버그였다고 changelog에 쓸 수 있나"로 자문한다.

### 케이스 표

| 케이스 | bump | 왜 |
|---|---|---|
| **색상 토큰 값을 의도적으로 변경** (디자인 판단) | **`major`** | 이름이 그대로여도 소비자 화면이 달라진다. 팔레트·시맨틱 모두 동일 |
| **틀렸던 색상 값 수정** (대비 기준 미달, Figma 반올림) | `patch` | 의도와 달랐던 값을 되돌리는 bug fix. SemVer가 patch로 규정한 것 |
| 기존 컴포넌트를 **의도적으로 재디자인** | **`major`** | 위와 같은 이유. 소비자가 안 바꿨는데 렌더 결과가 달라진다 |
| 디자인 스펙과 어긋난 **구현을 스펙에 맞춤** | `patch` | 스펙이 정답이고 구현이 틀렸던 것 |
| **새 시각 기능 추가** (모션, 새 상태 스타일, 새 토큰) | `minor` | 기존 렌더 결과는 그대로 |
| 라이트/다크에서 같은 토큰이 다른 값 | – | 값 변경이 아니라 테마 설계 자체 |
| variant에 **값** 추가 (`size="xsmall"` 신설) | `minor` | additive. prop 타입이 넓어질 뿐 |
| variant **값** 제거 | `major` | 그 값을 쓰던 코드가 깨진다 (값 제거는 이름 제거다) |
| `defaultVariants` 변경 | `major` | 소비자가 아무것도 안 바꿨는데 렌더 결과가 달라진다 |
| **타입만** breaking (`interface`→`type`, 유니온 좁힘) | `major` | 런타임이 같아도 컴파일이 깨진다 |
| **deprecate** (경고만 붙이고 아직 동작) | `minor` | 제거가 아니다. 실제 제거는 다음 major |
| styling 전용 `data-*` 이동·삭제 | `patch`/`minor` | 내부 배선이라 지원 표면이 아니다 (→ "`data-*`는 내부 배선") |
| **공개 contract** `data-*` 이름변경·삭제 | `major` | 소비자가 자기 CSS로 타겟해도 된다고 안내한 것 |
| `vars/component/*` 이름·구조 변경 (`typography` 제외) | `patch`/`minor` | rootage spec 생성물. 내부 배선이라 지원 표면이 아니다 (→ "컴포넌트 vars도 내부 배선") |
| DOM 구조·시맨틱 요소 교체 (접근성 개선 등) | `patch` | 지원 표면은 컴포넌트·props·recipe 클래스지 DOM 트리가 아니다. 단 렌더 결과가 눈에 띄게 바뀌면 위의 재디자인 행을 따른다 |
| headless breaking을 react가 **흡수** (내부에서 막음) | react `patch` | react 공개 표면이 그대로면 새어나가지 않는다 |
| headless breaking을 react가 **extend** (그대로 노출) | react `major` | 공개 표면으로 그대로 나온다 |
| 의존성만 올림, 내 출력은 동일 | `patch` | → "기준은 내 공개 표면" |
| 외부 peer 요구사항 상향 (React·Lynx 버전 floor) | `major` | 되던 환경이 안 되는 것도 breaking이다 |
| 패키지 export 경로·구조 변경 | `major` | import 경로가 깨진다 |

snippet(`cli`로 복사해가는 코드)은 npm 공개 표면이 아니라 별도 기준을 쓴다 → `patterns.md`의 "snippet 변경 분류".

**흡수인지 extend인지 헷갈릴 때**: `@seed-design/react/primitive`이 `export *`로 재-export하는 headless 17개(`packages/react/src/primitive.ts`)는 **항상 extend**다. react가 내부에서 안 쓰더라도 그 표면이 사용자에게 그대로 나가므로 흡수 판단 대상이 아니다.

> **사용자 대상 선언을 파운데이션 문서에 두지 않는다.** `docs/content/foundations/`는 플랫폼에 국한되지 않는 디자인 가치관만 담는 자리이고, 버저닝은 npm 패키지 관심사다. 색상 계약을 사용자에게 알리는 문구가 필요하면 `docs/content/react/updates/upgrade/`에 쓴다.

---

## 2단계. 전파

### 누가 나를 소비하나

방향은 단방향이다 (`@seed-design/` 접두사 생략).

```text
css  ── 토큰·recipe 산출물. deps 없는 leaf
 ↑ peerDependency ^N.M.0
 ├── react, stackflow                    recipe 클래스·vars 소비
 ├── tailwind3-plugin, tailwind4-theme   토큰 이름을 유틸리티/@theme에 하드코딩 매핑
 └── vite/rsbuild/webpack-plugin         css/theming 스크립트 API만 소비 (토큰과 무관)

react ── styled 컴포넌트 umbrella
 ↓ dependency ^N.M.0
react-headless/* (react-tabs, react-dialog, …)
 ↓ dependency ^N.M.0
공통 headless (react-primitive, dom-utils, react-supports, react-presence)
   → 이들이 major면 그것을 쓰는 headless 전부가 major로 딸려 온다

figma ── react를 의존하진 않지만 codegen 출력이 특정 react 세대 전용이라 major만 정렬
```

css가 깨지면 소비자가 깨지지만 그 역은 없다.

### 전파 규칙

| 내 bump | 소비자가 받는 것 | 누가 하나 |
|---|---|---|
| `major` | 소비자도 `major` + peer/dep `^N+1` | changesets **자동** |
| `minor` | **그 기능을 실제로 쓰는** 소비자만 floor `^N.M.0` ↑ | **손수** ⚠️ (→ "peer floor 수동 bump 함정") |
| `patch` | 없음 (`^` 범위가 커버) | – |

### "실제로 쓰는"의 판정 (css minor일 때)

| css에 생긴 변화 | react·stackflow | tailwind3·4 | vite·rsbuild·webpack-plugin |
|---|---|---|---|
| 새 토큰 | 그 토큰을 쓰는 recipe가 함께 생겼으면 floor ↑ | **항상 floor ↑** (토큰 이름을 직접 매핑하므로) | – |
| 새 recipe / variant 값 | 그걸 prop·클래스로 노출하면 floor ↑ | – | – |
| `css/theming` API 추가 | – | – | 그 옵션을 쓰면 floor ↑ |

`–`는 "올릴 필요 없음"이다. 소비자 자신의 bump는 자기 공개 표면 기준으로 따로 정한다.

---

## 핵심 원칙

### 기준은 "내 공개 표면"

버전은 의존성 버전이 아니라 내 공개 표면(컴포넌트·props·recipe 클래스·렌더 결과)으로 정해진다. 의존성을 bump했다는 사실만으로 내 버전이 오르지 않는다 — 그 변경이 **공개 표면으로 새어나갈 때만** 전파된다. 예) 내부 추적 코드를 제거해도 출력(DOM)이 그대로면 breaking이 아니다.

### react major가 가장 높다

모든 css major에는 react major가 따라온다 (react가 동작하려면 css가 필요하므로). 그래서 react의 major는 항상 가장 높거나 같다. `figma`도 major를 react에 맞춘다. 문서 버저닝에도 react 버전을 기준으로 쓴다.

### floor는 올리고 ceiling은 그대로

`^N.M.0`이 맞고 `~`는 틀리다 — **strict semver를 보장하는 2.0 이상 구간에 한해서**다.

- **floor**(하한) = 내가 import하는 걸 다 담은 가장 낮은 버전. 새 기능을 채택할 때마다 올리기만 하고 내리지 않는다.
- **ceiling**(상한) = 다음 major `<N+1`. minor는 기능 추가만 하므로 높은 버전이 낮은 소비자를 깨지 않는다. ceiling은 안 내려간다.
- `~`(예: `~2.0.0`)는 "react 2.0.0은 css 2.1.0과 못 쓴다"는 거짓 선언이 되어, css 2.1.0이 나오는 순간 전원 강제 lockstep 업그레이드를 유발한다.
- **1.x는 반대다.** 그 구간은 minor에도 breaking이 있었으므로 `^1.2.0`으로 minor를 가로지르면 안 되고 `~1.2.0`이 맞다. SEED를 소비하는 외부 라이브러리에게 안내하는 범위도 이 구분을 따른다.
- **floor를 올리는 것 자체는 `minor`로 낸다.** peer를 정확한 버전으로 핀한 소비자에겐 엄밀히 breaking이지만, SEED는 `^` 사용을 전제로 minor로 취급한다. 선례: css `2.2.0`에서 `tailwind3-plugin`·`tailwind4-theme`이 peer floor를 올리며 minor로 나갔다.

### `data-*`는 내부 배선

SEED의 `data-*`는 css와 styled react를 잇는 비공개 연결이고, 지원 표면은 **컴포넌트 + props + recipe 클래스**다. 그래서 styling 전용 data attr는 옮기거나 지워도 안 깨진다 (major 아님). 단 소비자가 자기 CSS로 타겟해도 되는 **공개 contract** data attr라면 제거·이름변경은 major다.

### 컴포넌트 vars도 내부 배선

`@seed-design/css/vars/component/*`(및 `lynx-css`)는 rootage component spec에서 생성되는 recipe 구현용 값이라 지원 표면이 아니다. spec이 바뀌어 이름·구조가 달라져도 `patch`/`minor`다.

단 **`typography`는 예외**다. 값 객체를 CSS-in-JS에 그대로 펼쳐 쓰는 용도가 있고 마이그레이션 가이드가 직접 import를 안내해왔으므로 SemVer를 지킨다. (사용자 대상 안내는 `packages/css/README.md`의 Stability 절과 Upgrade Guides에 있다.)

---

## peer floor 수동 bump 함정 ⚠️

`.changeset/config.json`에 `onlyUpdatePeerDependentsWhenOutOfRange: true`가 켜져 있다.

- **css/headless를 `minor`로 올릴 때**: 소비자의 기존 floor가 새 버전 범위 **안**이면(예: css `2.0→2.1`, react peer `^2.0.0`) changesets가 소비자를 **자동으로 안 올린다**.
  - 그러면 `react@2.1.0 + css@2.0.0` 조합이 허용되어, 새 컴포넌트가 require하는 `css@2.1.0` recipe가 없어 **런타임 silent 실패**가 난다.
  - → **그 기능 PR에서 소비자의 peer/dep floor를 `^N.M.0`로 손수 올려 같은 커밋에 포함**한다. 이는 패키지 설치(`bun add`)가 아니라 **버전 정책 edit**이므로 `package.json` 직접 수정이 정당하다 (AGENTS.md의 "`bun add`로 설치" 룰의 예외).
  - 소비자가 `react` 하나라고 가정하지 않는다. 위 "실제로 쓰는"의 판정 표로 **css 소비자 7개를 모두** 훑는다.

- **css/headless를 `major`로 올릴 때**: floor가 범위 **밖**이 되므로 changesets가 소비자를 자동으로 major bump한다. → **수동 불필요**.

- **`patch`는 어느 쪽도 트리거하지 않는다** (`shouldBumpMajor`가 `nextRelease.type !== "patch"`로 거른다). 이 체크는 **minor에만** 필요하다.

요약: **minor 전파 = 손수, major 전파 = 자동.**

### 이 옵션을 끄면 안 되는 이유

"자동으로 안 올려줄 거면 옵션을 끄면 되지 않나"는 자연스러운 발상이고, 실제로 끄면 floor는 자동으로 올라간다 (`apply-release-plan`의 `shouldUpdateDependencyBasedOnConfig`가 peer일 때 `shouldUpdate = !onlyUpdatePeerDependentsWhenOutOfRange`). 하지만 동시에 `assemble-release-plan`의 `shouldBumpMajor`가 걸려서 **css minor 한 번에 peer 소비자 7개가 전부 major로 올라간다.**

껐다면 2.0.0 이후 css minor 2회(`2.1.0`, `2.2.0`)만으로 `react`는 `4.0.0`이 됐고 `figma`도 따라갔을 것이다. react major를 문서 버저닝 기준으로 쓰는 구조가 무너지므로 **켜둔 채 수동으로 올린다.**

---

## 이 매트릭스 밖

- **lynx 트랙** (`lynx-css@0.x`, `lynx-react@0.x`) — 0.x에선 **minor가 major 자리**다. breaking → `minor`, 그 외 → `patch`. `lynx-react`의 lynx-css peer는 `0.0.0 || >=0.1.0 <1.0.0`이라 위의 `^N.M.0` 규칙이 그대로 적용되지 않는다.
- **`linked` 쌍** — `.changeset/config.json`이 `[figma, mcp]`, `[codemod, migration-index]`를 같은 버전으로 자동 정렬한다. 실제로 변경된 쪽만 changeset에 넣으면 된다. (단 `mcp`는 figma를 `^`가 아니라 정확한 핀 `2.0.0`으로 잡고 있어 figma가 오르면 손수 맞춰야 한다.)
- **`updateInternalDependencies: "patch"`** — headless가 `patch`만 올라도 react에 "Updated dependencies" patch가 자동으로 붙는다. 이걸 위해 changeset을 직접 쓸 필요는 없다.
- **여기 없는 npm 패키지** (`cli`, `docs-mcp`, `design-token`, `stylesheet`, `rootage` 등) — 이 결합 밖이라 자기 변경만 보고 1단계로 정한다.
- **private / 자체 버저닝 패키지** (`qvism-preset`, `lynx-qvism-preset` 등) — `bun changeset`이 자동으로 걸러낸다.
