---
name: seed-design
description: SEED Design으로 코드를 작성·설치·진단하거나 SEED 문서 내용을 물을 때 사용한다.
user-invocable: true
argument-hint: "[질문 또는 주제]"
---

# SEED Design

SEED Design의 공식 문서와 CLI를 단일 원천으로 사용합니다. 질문은 **공통 디자인 지식 → 플랫폼 구현 → 플랫폼별 Doctor** 순서로 탐색하고 판정합니다.

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

단서가 없거나 한 단계에서 여러 플랫폼이 동시에 잡혀도 사용자에게 묻습니다. **불확실한 상황에서 React를 기본값으로 사용하지 않습니다.**

플랫폼 판별 뒤에는 다음 프로젝트 정보도 필요할 때만 수집합니다.

- `seed-design.json`의 `path`와 해당 디렉토리의 `@file` 헤더 파일 → 스니펫 설치 여부
- 설치된 `@seed-design/*` 버전
- 번들러 설정 (`vite.config`, `rsbuild.config`, `webpack.config` 등)
- lock 파일로 판별한 패키지 매니저 (`bun` → `pnpm` → `yarn` → `npm`)

## 3. 공식 문서 라우팅

요청할 때마다 아래 인덱스를 먼저 읽고, 인덱스가 제공한 링크를 그대로 따라갑니다.

- 문서 인덱스: `https://seed-design.io/__docs__/index.json`

공통 문서는 `components`·`foundations`·`patterns`·`docs`(Design Guidelines) category에, 플랫폼 문서는 `react`·`lynx` category에 있습니다. 한 요청 안에서 읽은 인덱스와 문서는 문서 풀에 모아 두고, 같은 URL을 다시 읽지 않고 이후 단계와 룰에서 재사용합니다.

다음 순서를 지킵니다.

1. 문서 인덱스에서 공통 category를 찾습니다.
2. 플랫폼 구현 요청이면 `react` 또는 `lynx` category에서 제목·설명으로 필요한 문서를 찾습니다.
3. 항목의 `llmsUrl`을 `https://seed-design.io` 기준으로 열어 실제 계약을 읽습니다. 기억한 경로나 URL 조합으로 leaf 문서를 만들지 않습니다.
4. 인덱스를 정상적으로 읽었는데 관련 항목이 없으면 현재 공식 문서가 없다고 판단합니다. 인덱스 자체를 읽지 못했으면 부재로 확정하지 않습니다.

### CLI로 문서 읽기

CLI를 쓸 수 있으면 인덱스 대신 `docs search`나 `docs list`로 주소를 찾고 `docs read`로 읽어도 됩니다. 이때도 기억한 주소를 조합하지 말고 두 명령이 출력한 주소를 넘깁니다. 같은 컴포넌트라도 `/components/…`는 **디자인 스펙**이고, 플랫폼 구현은 `/react/…`·`/lynx/…` 아래에 있습니다.

```bash
npx @seed-design/cli@latest docs search action-button
npx @seed-design/cli@latest docs list react
npx @seed-design/cli@latest docs read /components/action-button
npx @seed-design/cli@latest docs read /react/components/action-button
```

### 컴포넌트 답변 순서

1. 스펙 질문이면 공통 컴포넌트 문서만 읽습니다.
2. 구현 질문이면 플랫폼을 판별하고 해당 플랫폼 문서를 읽습니다.
3. 스펙과 구현을 함께 묻는다면 공통 문서를 먼저 읽고, 판별된 플랫폼 문서를 이어서 읽습니다.
4. 공통 문서 id와 구현 문서 id가 다르면 공통 문서의 Platform 표와 선택된 플랫폼 인덱스로 실제 id를 찾습니다.
5. 선택한 플랫폼 문서나 registry 항목이 없으면 그 플랫폼의 구현·문서가 없다고 알립니다. 다른 플랫폼 문서로 대체하지 않습니다.

스니펫이 필요하면 선택한 플랫폼 registry만 사용합니다.

```text
https://seed-design.io/__registry__/{react|lynx}/index.json
https://seed-design.io/__registry__/{react|lynx}/{registryId}/index.json
https://seed-design.io/__registry__/{react|lynx}/{registryId}/{itemId}.json
```

첫 주소는 플랫폼의 registry 전체 인덱스로, 사용할 수 있는 `registryId` 목록입니다.

### CLI 문서

전체·플랫폼 인덱스에서 `CLI`, `Commands`, `Configuration`에 해당하는 현재 링크를 찾고 내용을 읽습니다. 문서가 어느 플랫폼 트리 아래에 있는지만으로 지원 플랫폼이나 옵션을 추론하지 않습니다. 명령·플래그·설정 필드는 연결된 문서나 `npx @seed-design/cli@latest <명령> --help`가 명시한 값만 사용합니다.

### 스니펫 추가와 설정 생성

에이전트가 실행하는 환경에서는 `init`, `add`, `add-all`이 질문을 띄우지 않으므로, 물었을 질문에 답할 인자를 처음부터 함께 넘깁니다. 어떤 항목이 있는지는 위의 레지스트리 인덱스에서 먼저 확인합니다.

```bash
npx @seed-design/cli@latest init -y
npx @seed-design/cli@latest add ui:action-button
npx @seed-design/cli@latest add-all ui
```

`add`가 내용이 다른 기존 파일을 남기고 끝나면 `--on-diff overwrite`를 임의로 붙이지 않습니다. 사용자가 손댄 내용을 지우는 선택이기 때문입니다. 남은 파일을 사용자에게 알리고 덮어쓸지, `--on-diff backup`으로 백업할지, `--on-diff skip`으로 그대로 둘지 확인합니다.

## 4. 판단이 필요한 절차

| 요청 | 읽을 참조 |
|---|---|
| 스니펫 버전 맞추기, 파일 충돌, 패키지 호환 | [migration.md](references/migration.md) |
| changelog 해석과 업그레이드 경로 | [upgrade.md](references/upgrade.md) |
| 코드 사용 상태 진단 | [doctor.md](references/doctor.md) |

마이그레이션과 업그레이드도 플랫폼을 먼저 판별합니다. React 문서의 전용 옵션(`--seed-react-version` 등)이나 호환표를 Lynx에 적용하지 말고, 선택된 플랫폼의 패키지와 changelog만 대조합니다.

Doctor 요청은 [doctor.md](references/doctor.md)의 적응형 탐색 절차를 먼저 따릅니다.

- React Doctor: [doctor-react.md](references/doctor-react.md)를 함께 읽습니다.
- Lynx Doctor: [doctor-lynx.md](references/doctor-lynx.md)를 함께 읽습니다.

Doctor는 문제를 찾는 진단이고, `upgrade.md`는 실제로 버전을 올리는 절차입니다. 진단이 버전 격차를 알려도 사용자가 수정을 요청하기 전에는 업그레이드를 실행하지 않습니다.

## 5. 코드 작성과 기존 코드 진단

`rules/`의 룰은 SEED 코드를 작성할 때 지키는 계약이자 Doctor의 판정 기준입니다. Doctor에서는 선택된 플랫폼 프로필과 각 룰의 적용 조건을 함께 사용합니다.

- [project-config](rules/project-config.md): 현재 CLI 설정 계약, framework 충돌, snippet path·alias 연결
- [package-compatibility](rules/package-compatibility.md): 플랫폼 패키지 설치본 조합
- [project-setup](rules/project-setup.md): 선택된 플랫폼 문서가 요구하는 앱 설치·스타일 연결
- [snippet-compatibility](rules/snippet-compatibility.md): 현재 패키지와 설치 스니펫의 CLI `compat` 결과
- [foundation-contract](rules/foundation-contract.md): 토큰 존재·공개성·내부 스타일 API 의존
- [library-authors](rules/library-authors.md): 공식 저자 문서가 있는 플랫폼의 peer·external·CSS·배포 계약
- [outdated-version](rules/outdated-version.md): 직접 설치한 패키지의 최신 세대 격차만
- [snippet-generation](rules/snippet-generation.md): 설치 스니펫과 registry의 최신 세대 차이만
- [no-deprecated-component](rules/no-deprecated-component.md): 플랫폼에 유효한 출처가 있는 deprecated 항목만
- [component-guidelines](rules/component-guidelines.md): 공통 디자인 문서와 매핑 가능한 플랫폼 구현의 대조

토큰은 문서·CSS·플랫폼 API에서 표기가 달라질 수 있습니다. 공통 Foundations 문서에서 의미와 토큰을 확인한 뒤, 코드 표기는 선택된 플랫폼 구현 문서에서 확인합니다. 한 플랫폼의 코드 표기를 다른 플랫폼에 복사하지 않습니다.

## 6. 응답과 실행 원칙

- 공식 문서를 실제로 읽고 근거 링크와 함께 답합니다.
- 설치·실행 명령은 대상 프로젝트의 패키지 매니저에 맞춥니다.
- read-only 진단과 실제 수정 요청을 구분합니다.
- 없는 경로나 API를 추측하지 않습니다.
- 작업이 끝나면 현재 맥락에 맞는 다음 단계만 짧게 제안합니다.
