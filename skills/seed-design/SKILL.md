---
name: seed-design
description: SEED Design 통합 가이드. 공통 컴포넌트 스펙과 파운데이션을 공식 문서에서 찾고, React·Lynx 프로젝트의 구현·설치·CLI·마이그레이션을 대상 플랫폼에 맞게 안내하며, 지원되는 플랫폼의 사용 상태를 Doctor로 진단한다. SEED Design 관련 질문, 컴포넌트 사용법, 색상·타이포·스페이싱, 셋업, 스니펫, 업그레이드, "잘 쓰고 있나?", "뭘 고쳐야 하나?" 같은 요청이면 이 스킬을 사용한다.
user-invocable: true
argument-hint: "[질문 또는 주제]"
---

# SEED Design

SEED Design의 공식 문서와 CLI를 단일 원천으로 사용합니다. 이 스킬에는 문서 내용을 복사하지 않고, **공통 디자인 지식 → 플랫폼 구현 → 플랫폼별 Doctor**로 이어지는 탐색·판정 절차만 둡니다.

## 1. 요청을 먼저 분류

프로젝트를 조사하기 전에 요청을 다음 중 하나로 분류합니다.

| 분류 | 예 | 플랫폼 판별 |
|---|---|---|
| 공통 컴포넌트 스펙·Foundations | Anatomy, Properties, Guidelines, 색상, 타이포그래피, 스페이싱 | 불필요 |
| 플랫폼 구현 | 사용법, Props, 설치, 셋업, 스니펫, 코드 작성, CLI 실행 | 필요 |
| Doctor·마이그레이션 | 사용 상태 진단, deprecated, 호환성, 업그레이드 | 필요 |

공통 스펙이나 Foundations만 묻는다면 프로젝트가 없어도 바로 공통 문서를 읽습니다. 구현 코드까지 함께 묻는다면 공통 문서를 먼저 읽은 다음, 플랫폼을 판별하고 해당 플랫폼 문서를 결합합니다.

## 2. 플랫폼 판별

플랫폼에 따라 결과가 달라지는 요청에만 아래 순서를 적용합니다.

1. **사용자가 명시한 플랫폼**: React 또는 Lynx
2. **대상 워크스페이스의 설정**: `seed-design.json.framework`
3. **대상 워크스페이스의 직접 의존성**
   - React: `@seed-design/react`, `@seed-design/css`
   - Lynx: `@seed-design/lynx-react`, `@seed-design/lynx-css` 또는 `@lynx-js/react`

높은 순위의 명확한 단서를 낮은 순위의 단서로 덮어쓰지 않습니다. 단, 같은 대상 안에서 설정과 의존성이 충돌한다면 설정이 낡았을 수 있으므로 사용자에게 확인합니다.

모노레포에서는 루트 `package.json`만 보지 말고 요청 대상 워크스페이스를 먼저 찾습니다. 루트 요청에서 React와 Lynx 워크스페이스가 함께 발견되거나 대상 경로가 불명확하면, 구현·설치·Doctor를 시작하기 전에 어느 워크스페이스 또는 플랫폼인지 묻습니다.

단서가 없거나 한 단계에서 여러 플랫폼이 동시에 잡혀도 사용자에게 묻습니다. **불확실한 상황에서 React를 기본값으로 사용하지 않습니다.** 이는 에이전트의 문서 라우팅 규칙이며, 기존 CLI의 공개 동작이나 `seed-design.json` 기본값을 바꾸는 규칙이 아닙니다.

플랫폼 판별 뒤에는 다음 프로젝트 정보도 필요할 때만 수집합니다.

- `seed-design.json`의 `path`와 해당 디렉토리의 `@file` 헤더 파일 → 스니펫 설치 여부
- 설치된 `@seed-design/*` 버전
- 번들러 설정 (`vite.config`, `rsbuild.config`, `webpack.config` 등)
- lock 파일로 판별한 패키지 매니저 (`bun` → `pnpm` → `yarn` → `npm`)

## 3. 공식 문서 라우팅

문서 경로를 추측하지 말고 완전히 한정된 `docs` CLI 경로를 사용합니다.

| 필요한 정보 | 먼저 실행할 명령 |
|---|---|
| 공통 컴포넌트 스펙 | `npx @seed-design/cli@latest docs docs/components/{id} --raw` |
| Foundations | `npx @seed-design/cli@latest docs docs/foundations/{topic} --raw` |
| React 구현 | `npx @seed-design/cli@latest docs react/components/{id} --raw` |
| Lynx 구현 | `npx @seed-design/cli@latest docs lynx/components/{id} --raw` |

`{topic}`은 `color`, `color-role`, `typography`, `spacing`, `radius`, `elevation`, `motion`처럼 공식 인덱스에 있는 실제 id를 사용합니다. 문서 URL이 `/foundations/color/color-role`처럼 중첩돼 있어도 CLI id는 `color-role`일 수 있으므로 URL 경로를 그대로 넣지 않습니다.

- 공통 컴포넌트 인덱스: `https://seed-design.io/components/llms.txt`
- Foundations 인덱스: `https://seed-design.io/foundations/llms.txt`
- React 구현 인덱스: `https://seed-design.io/react/llms.txt`
- Lynx 구현 인덱스: `https://seed-design.io/lynx/llms.txt`

### 컴포넌트 답변 순서

1. 스펙 질문이면 공통 컴포넌트 문서만 읽습니다.
2. 구현 질문이면 플랫폼을 판별하고 해당 플랫폼 문서를 읽습니다.
3. 스펙과 구현을 함께 묻는다면 공통 문서를 먼저 읽고, 판별된 플랫폼 문서를 이어서 읽습니다.
4. 공통 문서 id와 구현 문서 id가 다르면 공통 문서의 Platform 표와 플랫폼 구현 인덱스로 실제 id를 찾습니다.
5. 선택한 플랫폼 문서나 registry 항목이 없으면 그 플랫폼의 구현·문서가 없다고 알립니다. 다른 플랫폼 문서로 대체하지 않습니다.

스니펫이 필요하면 선택한 플랫폼 registry만 사용합니다.

```text
https://seed-design.io/__registry__/{react|lynx}/{registryId}/index.json
https://seed-design.io/__registry__/{react|lynx}/{registryId}/{itemId}.json
```

개별 스니펫 경로는 `{itemId}/index.json`이 아니라 `{itemId}.json`입니다.

### CLI 문서

CLI 명령어와 설정의 canonical 문서는 현재 React 문서 트리 아래에 있습니다.

- `/llms/react/getting-started/cli/commands.txt`
- `/llms/react/getting-started/cli/configuration.txt`

이 위치는 문서 정보 구조일 뿐 CLI 지원 범위를 뜻하지 않습니다. `init`, `add`, `add-all`, `compat`, `docs`와 `seed-design.json.framework`, `--framework react|lynx`는 두 플랫폼을 지원합니다. 실제 실행 대상은 위 플랫폼 판별 결과에 맞추고, 필요한 경우 `--framework`를 명시합니다. `--seed-react-version`은 이름 그대로 React 전용입니다.

## 4. 판단이 필요한 절차

| 요청 | 읽을 참조 |
|---|---|
| 스니펫 버전 맞추기, 파일 충돌, 패키지 호환 | [migration.md](references/migration.md) |
| changelog 해석과 업그레이드 경로 | [upgrade.md](references/upgrade.md) |
| 코드 사용 상태 진단 | [doctor.md](references/doctor.md) |

마이그레이션과 업그레이드도 플랫폼을 먼저 판별합니다. 참조 파일의 React 전용 옵션이나 호환표를 Lynx에 적용하지 말고, 선택된 플랫폼의 패키지와 changelog만 대조합니다.

Doctor 요청은 [doctor.md](references/doctor.md)의 지원표를 먼저 확인합니다.

- React Doctor: [doctor-react.md](references/doctor-react.md)를 함께 읽고 프로필에 적힌 룰만 실행합니다.
- Lynx Doctor: 현재 미지원입니다. React 프로필이나 React 룰을 대신 실행하지 말고 지원 범위를 알립니다.

Doctor는 문제를 찾는 진단이고, `upgrade.md`는 실제로 버전을 올리는 절차입니다. 진단이 버전 격차를 알려도 사용자가 수정을 요청하기 전에는 업그레이드를 실행하지 않습니다.

## 5. 코드 작성과 기존 코드 진단

`rules/`의 룰은 SEED 코드를 작성할 때 지킵니다. Doctor에서는 선택된 플랫폼 프로필이 활성화한 룰만 소급 적용합니다.

- [outdated-version](rules/outdated-version.md): 직접 설치한 패키지 버전 격차
- [snippet-generation](rules/snippet-generation.md): 설치 스니펫과 선택된 플랫폼 registry의 세대 차이
- [no-deprecated-component](rules/no-deprecated-component.md): deprecated 컴포넌트·스니펫·토큰·옵션
- [component-guidelines](rules/component-guidelines.md): 공통 디자인 문서에서 도출한 기준과 선택된 플랫폼 구현의 대조

토큰은 문서·CSS·플랫폼 API에서 표기가 달라질 수 있습니다. 공통 Foundations 문서에서 의미와 토큰을 확인한 뒤, 코드 표기는 선택된 플랫폼 구현 문서에서 확인합니다. 한 플랫폼의 코드 표기를 다른 플랫폼에 복사하지 않습니다.

## 6. 응답과 실행 원칙

- 공식 문서를 실제로 읽고 근거 링크와 함께 답합니다.
- 설치·실행 명령은 대상 프로젝트의 패키지 매니저에 맞춥니다.
- read-only 진단과 실제 수정 요청을 구분합니다.
- 없는 경로나 API를 추측하지 않습니다.
- 작업이 끝나면 현재 맥락에 맞는 다음 단계만 짧게 제안합니다.
