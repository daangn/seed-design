# 버전 전파 매트릭스 (SEED 2.0)

SEED는 **2.0을 분기점으로 strict semver**를 따른다. breaking change는 **major에서만** 낸다 (1.x처럼 minor에서 내지 않는다).

이 문서는 "어떤 패키지를 어떻게 바꾸면, 그 패키지와 그것을 의존하는 패키지들이 각각 어떤 bump를 받아야 하는지"를 정한다. changeset의 bump 추천(SKILL.md Phase 2)과 peer floor 체크(Phase 4.5)는 이 매트릭스를 따른다.

## 패키지 트랙

### npm 트랙 (changeset 대상, strict semver)

`@seed-design/` 접두사 생략:

- **토큰/스타일**: `css`, `rootage-artifacts`, `tailwind3-plugin`, `tailwind4-theme`
- **번들러 플러그인**: `vite-plugin`, `webpack-plugin`, `rsbuild-plugin`
- **React**: `react`(umbrella), `stackflow`, react-headless 개별 패키지 약 37개(`react-*`, `dom-utils`)
- **도구**: `figma`, `mcp`(figma와 linked), `cli`, `codemod`+`migration-index`(linked)

### changeset 제외 (private / 자체 버저닝)

`qvism-preset`, `qvism-core`, `qvism-cli`, `rootage-core`, `rootage-cli`, `postcss-*`, `figma-codegen` 및 figma 위젯들, `lynx-*`, `docs`, 예제 패키지. → `bun changeset`이 자동으로 제외하므로 후보에 뜨지 않는다.

### 결합 방향 (단방향)

```text
css (leaf, deps 없음)
  ↑ peerDependency
react (umbrella)  ←  react-headless/* (react가 dependency로 소비: exact pin 또는 workspace:^)
  ↑ major 정렬
figma (css/react를 직접 의존하진 않지만 codegen 출력이 특정 react 세대 전용)
```

css가 깨지면 react가 깨지지만, 그 역은 없다 (react는 css를 소비할 뿐).

## 전파 매트릭스

세로축은 "내가 일으킨 변경", 가로축은 "그래서 각 패키지가 받는 bump"다.

| 변경 상황 | css | react | 해당 headless | react의 peer/deps 조치 |
|---|---|---|---|---|
| 스타일만 변경 (css 산출물 추가 X) | `patch` ¹ | – | – | – (`^`로 커버됨) |
| 새 (서브)컴포넌트 (recipe/vars 동반) | `minor` | `minor` | 신규=`1.0.0`/`0.x`, 서브컴포넌트 추가=`minor` | css peer floor ↑ + headless dep floor ↑/신규 추가 |
| headless non-breaking 추가기능 | – | `minor` ² | `minor` | headless dep floor ↑ |
| headless 추가기능 + 스타일링 | `minor` | `minor` | `minor` | css peer floor ↑ + headless dep floor ↑ |
| React 로직 추가 기반 스타일 업데이트 | `minor` | `minor` | – | css peer floor ↑ |
| data attr 기반 스타일링 추가 | `minor` | `minor` | 제공 시 `minor` | css peer floor ↑ (+headless dep floor ↑) |
| headless 인터페이스 **breaking** | – | 안 씀=– / 흡수=`patch` / extend=`major` | **`major`** | 흡수·extend 시 headless를 새 major로 재선언 (`^N+1`) |
| 토큰·css variable·**recipe/slot/variant 이름변경·삭제** | **`major`** | **`major`** ³ | – | css 소비 전 패키지 peer/deps `^N+1` |
| 스타일링용 **data attr 이름변경·삭제** | **`major`** ⁴ | **`major`** | 변경한 게 headless면 `major` | css 소비 전 패키지 `^N+1` (+headless 새 major 재선언) |

¹ 단순 버그/미세 조정은 `patch`. 단 **의도된 시각적 기능**(디자인 의도가 있는 변경)이면 `minor`.
² react가 그 추가기능을 **채택(사용)하거나 인터페이스로 제공**할 때만 react가 오른다. 안 쓰면 react는 변화 없음.
³ 토큰은 단독으로 보면 major가 아닐 것 같지만, 컴포넌트 스타일과 결합돼 있어 css/react가 함께 major.
⁴ selector가 바뀌므로 css major. headless major로 data attr 계약이 깨졌거나 react 자체가 제공하던 data attr 값이 바뀐 것이므로 react도 major.

## 핵심 원칙

1. **버전은 "의존성 버전"이 아니라 "내 observable contract"로 정해진다.** 의존성을 bump했다는 사실만으로 내 버전이 오르지 않는다 — 그 변경이 **내 공개 표면(컴포넌트·props·recipe 클래스)으로 새어나갈 때만** 전파된다. 예) 내부 추적 코드를 제거해도 출력(DOM)이 보존되면 breaking이 아니다.

2. **react major ≥ 다른 모든 패키지 major.** 모든 css major에는 react도 major가 따라온다(css는 react의 런타임 substrate). 그래서 react 패키지의 major가 항상 가장 높거나 같다. `figma`는 major를 react에 정렬한다(codegen이 특정 react 세대 전용이므로). 문서 버저닝에도 react 버전을 기준으로 쓸 수 있다.

3. **floor와 ceiling은 비대칭.** `^N.M.0`이 맞고 `~`는 틀리다.
   - **floor**(하한) = 내가 import하는 걸 다 담은 가장 낮은 버전. 새 기능을 채택할 때마다 **ratchet up**(올리기만).
   - **ceiling**(상한) = 다음 major `<N+1`. minor는 additive superset이라 높은 버전이 낮은 소비자를 깨지 않으므로 ceiling은 안 내려간다.
   - `~`(예: `~2.0.0`)는 "react 2.0.0은 css 2.1.0과 못 쓴다"는 거짓 선언이 되어, css 2.1.0이 나오는 순간 전원 강제 lockstep 업그레이드를 유발한다.

4. **SEED의 `data-*`는 내부 plumbing이다.** css ↔ styled react 사이의 비공개 배선이고, 지원 표면은 **컴포넌트 + props + recipe 클래스**다. 그래서 styling 전용 data attr는 옮기거나 지워도 비공개라 안 깨진다(major 아님). 단 소비자가 자기 CSS로 타겟해도 되는 **공개 contract** data-*라면 제거·이름변경 = major.

## peer floor 수동 bump 함정 ⚠️

`.changeset/config.json`에 `onlyUpdatePeerDependentsWhenOutOfRange: true`가 켜져 있다. 결과:

- **css/headless를 `minor`로 올릴 때**: dependent(주로 `react`)의 기존 floor가 새 버전 범위 **안**이면(예: css `2.0→2.1`, react peer `^2.0.0`) changesets가 dependent를 **자동으로 안 올린다**.
  - 그러면 `react@2.1.0 + css@2.0.0` 조합이 허용되어, 새 컴포넌트가 require하는 `css@2.1.0` recipe가 없어 **런타임 silent 실패**가 난다.
  - → **그 기능 PR에서 dependent의 peer/dep floor를 `^N.M.0`로 손수 올려 같은 커밋에 포함**한다. 이는 패키지 설치(`bun add`)가 아니라 **버전 정책 edit**이므로 `package.json` 직접 수정이 정당하다 (AGENTS.md의 "`bun add`로 설치" 룰의 예외).
  - 예: 새 컴포넌트 추가로 css가 `2.1.0`이 되면 → `react`의 `peerDependencies["@seed-design/css"]`를 `^2.0.0 → ^2.1.0`로 직접 수정. ceiling(`<3`)은 그대로 둔다.

- **css/headless를 `major`로 올릴 때**: floor가 범위 **밖**이 되므로 changesets가 dependent를 자동으로 major bump한다. → **수동 불필요**.

요약: **minor 전파 = 손수, major 전파 = 자동.**
