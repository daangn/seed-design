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

문서 목록과 지원 범위를 스킬에 복사하지 않습니다. 요청할 때마다 아래 인덱스를 먼저 읽고, 인덱스가 제공한 링크를 그대로 따라갑니다.

- 전체 문서 인덱스: `https://seed-design.io/llms.txt`
- React 문서 인덱스: `https://seed-design.io/react/llms.txt`
- Lynx 문서 인덱스: `https://seed-design.io/lynx/llms.txt`

한 요청 실행 안에서는 URL을 정규화한 문서 풀을 유지합니다. 전체 인덱스, 선택된 플랫폼 인덱스, 각 leaf 문서는 URL마다 한 번만 읽고 이후 단계와 룰에서 같은 내용을 재사용합니다. 리포트 `references`에 같은 URL을 반복하는 것은 출처를 보존하는 것이며 다시 읽으라는 뜻이 아닙니다. HTTP 캐시를 가정하지 않습니다.

다음 순서를 지킵니다.

1. 전체 문서 인덱스에서 공통 Components·Foundations·Patterns 또는 선택된 플랫폼의 현재 진입점을 찾습니다.
2. 플랫폼 구현 요청이면 선택된 플랫폼 인덱스를 읽고, 제목·category·설명으로 필요한 문서를 찾습니다.
3. 인덱스가 제공한 leaf URL을 열어 실제 계약을 읽습니다. 기억한 경로나 URL 조합으로 leaf 문서를 만들지 않습니다.
4. 인덱스를 정상적으로 읽었는데 관련 항목이 없으면 현재 공식 문서가 없다고 판단합니다. 인덱스 자체를 읽지 못했으면 부재로 확정하지 않습니다.

CLI의 `docs` 명령을 사용할 때도 먼저 인덱스에서 문서와 id를 확인합니다. URL 경로와 CLI id가 같다고 가정하지 말고, id를 확정할 수 없으면 인덱스의 URL을 직접 읽습니다.

### 컴포넌트 답변 순서

1. 스펙 질문이면 공통 컴포넌트 문서만 읽습니다.
2. 구현 질문이면 플랫폼을 판별하고 해당 플랫폼 문서를 읽습니다.
3. 스펙과 구현을 함께 묻는다면 공통 문서를 먼저 읽고, 판별된 플랫폼 문서를 이어서 읽습니다.
4. 공통 문서 id와 구현 문서 id가 다르면 공통 문서의 Platform 표와 선택된 플랫폼 인덱스로 실제 id를 찾습니다.
5. 선택한 플랫폼 문서나 registry 항목이 없으면 그 플랫폼의 구현·문서가 없다고 알립니다. 다른 플랫폼 문서로 대체하지 않습니다.

스니펫이 필요하면 선택한 플랫폼 registry만 사용합니다.

```text
https://seed-design.io/__registry__/{react|lynx}/{registryId}/index.json
https://seed-design.io/__registry__/{react|lynx}/{registryId}/{itemId}.json
```

개별 스니펫 경로는 `{itemId}/index.json`이 아니라 `{itemId}.json`입니다.

### CLI 문서

전체·플랫폼 인덱스에서 `CLI`, `Commands`, `Configuration`에 해당하는 현재 링크를 찾고 내용을 읽습니다. 문서가 어느 플랫폼 트리 아래에 있는지만으로 지원 플랫폼이나 옵션을 추론하지 않습니다. 명령·플래그·설정 필드는 연결된 문서 또는 설치한 CLI 소스가 명시한 값만 사용합니다.

## 4. 판단이 필요한 절차

| 요청 | 읽을 참조 |
|---|---|
| 스니펫 버전 맞추기, 파일 충돌, 패키지 호환 | [migration.md](references/migration.md) |
| changelog 해석과 업그레이드 경로 | [upgrade.md](references/upgrade.md) |
| 코드 사용 상태 진단 | [doctor.md](references/doctor.md) |

마이그레이션과 업그레이드도 플랫폼을 먼저 판별합니다. 참조 파일의 React 전용 옵션이나 호환표를 Lynx에 적용하지 말고, 선택된 플랫폼의 패키지와 changelog만 대조합니다.

Doctor 요청은 [doctor.md](references/doctor.md)의 적응형 탐색 절차를 먼저 따릅니다.

1. 사용자 지정 경로
2. `node_modules`, `.git`, `.claude/worktrees`를 제외한 `seed-design.json`
3. 설정 발견 여부와 관계없이 직접 `@seed-design/*` 의존성이 있는 workspace
4. 두 후보를 package 경계로 중복 제거
5. 사용자 명시 → `framework` → 직접 의존성 순의 플랫폼 확정
6. 공개 진입점과 앱·라이브러리 빌드 증거에 따른 비배타적 역할 판정

- React Doctor: [doctor-react.md](references/doctor-react.md)를 함께 읽습니다.
- Lynx Doctor: [doctor-lynx.md](references/doctor-lynx.md)를 함께 읽습니다.

플랫폼 프로필은 문서 지원 현황을 복제하지 않고 인덱스·패키지·registry 탐색의 시작점만 제공합니다. 일반 진단은 공통 룰 전체를 scope에 넣고, 현재 인덱스에서 발견한 공식 계약과 각 룰의 적용 조건으로 검사 여부를 정합니다. 사용자가 config·setup·foundations·components·compatibility·library 중 범주를 지정했다면 그 범주만 실행합니다. 여러 workspace의 전체 진단은 리포트를 workspace별로 따로 만듭니다.

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
- Doctor 결과는 schema v2 YAML을 단일 원천으로 임시 디렉토리에 기록하고, 사용자가 "YAML만"을 명시하지 않으면 같은 디렉토리에 HTML 리포트도 함께 생성합니다. 대상 프로젝트에는 쓰지 않습니다.
- 각 finding의 `remediation`에는 대상·문제·요구사항·제약·근거·검증을 포함한 복사 가능한 수정 프롬프트를 기록합니다. 프롬프트를 만드는 것은 진단이며, 사용자가 별도로 수정을 요청하기 전에는 실행하지 않습니다.
- 없는 경로나 API를 추측하지 않습니다.
- 작업이 끝나면 현재 맥락에 맞는 다음 단계만 짧게 제안합니다.
