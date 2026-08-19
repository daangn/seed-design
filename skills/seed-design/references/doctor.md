# 사용 상태 진단 (Doctor)

프로젝트가 SEED를 쓰는 맥락을 먼저 찾고, 그 맥락에 적용되는 건강검진을 선택 실행하는 공통 절차입니다. 컴포넌트뿐 아니라 설정·패키지 호환·앱 셋업·Foundations 계약·라이브러리 배포 계약까지 봅니다.

Doctor는 Markdown 기반 Skill입니다. 별도 실행 스크립트나 Quick/Deep 모드는 두지 않습니다. 일반 요청은 적용 가능한 룰 전체를, 범주가 지정된 요청은 그 범주만 실행합니다.

## 문서 단일 원천

진단을 시작할 때 `https://seed-design.io/llms.txt`와 선택된 플랫폼 인덱스([React](https://seed-design.io/react/llms.txt) 또는 [Lynx](https://seed-design.io/lynx/llms.txt))를 읽습니다. 지원 범위·leaf 문서 목록·컴포넌트 id 매핑을 이 파일이나 플랫폼 프로필에 유지하지 않습니다.

플랫폼 프로필은 인덱스·패키지·registry namespace의 시작점만 제공합니다. 현재 capability는 인덱스가 연결한 문서와 설치본 package metadata로 실행 시점에 판단합니다. 문서가 새로 생기거나 사라지면 스킬을 수정하지 않고 다음 진단부터 그 인덱스 상태를 따릅니다.

### 실행 문서 풀

- Doctor 요청 하나에 문서 풀 하나를 만들고, 인덱스가 제공한 절대 URL에서 fragment를 제외한 값을 key로 사용합니다.
- 전체 인덱스와 선택된 플랫폼 인덱스는 실행당 URL마다 한 번만 읽습니다. 같은 실행의 여러 workspace와 rule이 공유합니다.
- leaf 문서도 처음 필요한 때 한 번만 읽고 이후 rule은 저장한 내용을 재사용합니다. rule 파일의 "문서 풀에서 사용할 근거"는 새 fetch 명령이 아닙니다.
- 리포트의 `references`는 근거의 provenance입니다. 같은 URL이 여러 check·finding에 있어도 다시 읽지 않습니다.
- HTTP·도구 캐시는 보장으로 간주하지 않습니다. 하위 에이전트가 문서 내용을 전달받지 못했다면 그 하위 실행 안에서만 동일한 중복 제거를 다시 적용합니다.

## 원칙

- **read-only**: 대상 프로젝트의 코드·설정·의존성·산출물을 만들거나 바꾸지 않습니다. `compat`처럼 읽기 전용 명령만 실행합니다.
- **근거 우선**: 전체·플랫폼 인덱스에서 이번 실행에 발견한 공식 문서, 설치본 package metadata, 실제 코드의 파일:줄을 근거로 씁니다.
- **검증 공백 보존**: 확인하지 못한 것을 pass나 fail로 바꾸지 않습니다.
- **플랫폼 격리**: 선택된 플랫폼 문서·패키지·registry만 사용합니다. 다른 플랫폼 문서로 빈칸을 채우지 않습니다.
- **계약과 디자인 판단 분리**: Foundations는 공개성·존재·제거·내부 API 의존만 판정하고 하드코딩이나 semantic token 선택의 적절성은 추론하지 않습니다.

## Step 1: 대상 워크스페이스 찾기

다음 순서를 고정합니다.

1. 사용자가 지정한 경로가 있으면 그 경로 안에서만 후보를 찾습니다.
2. 대상 아래에서 `seed-design.json`을 찾습니다. `node_modules`, `.git`, `.claude/worktrees`는 반드시 제외합니다.
3. 설정 파일 발견 여부와 관계없이 workspace manifest를 따라 `@seed-design/*` 직접 의존성이 있는 워크스페이스도 함께 찾습니다. 설정 부재만으로 SEED 미사용이라고 결론내리지 않습니다.
4. `seed-design.json`이 속한 package와 직접 의존성이 선언된 package를 같은 package 경계로 정규화해 중복 제거합니다. 같은 경계에 두 단서가 있으면 하나의 리포트 단위에 모두 유지합니다.

여러 워크스페이스가 발견되면 어느 대상을 진단할지 확인합니다. 사용자가 "전체"를 요청했다면 **워크스페이스별 YAML을 각각** 생성합니다. 서로 다른 `meta`를 가진 결과를 하나로 합치지 않습니다.

## Step 2: 플랫폼과 프로젝트 역할 확정

### 플랫폼

워크스페이스마다 아래 우선순위를 적용합니다.

1. 사용자 명시
2. `seed-design.json.framework`
3. 직접 의존성
   - React: `@seed-design/react`, `@seed-design/css`
   - Lynx: `@seed-design/lynx-react`, `@seed-design/lynx-css`, `@lynx-js/react`

높은 순위 단서를 낮은 순위 단서로 덮어쓰지 않습니다. 설정과 의존성이 충돌하면 선택된 플랫폼은 우선순위대로 유지하되 `project-config`가 실제 충돌을 finding으로 냅니다. 같은 순위에서 React·Lynx가 동시에 잡혀 플랫폼을 정할 수 없으면 사용자에게 확인합니다. React를 기본값으로 추측하지 않습니다.

### app·library 역할

역할은 비배타적입니다. 한 워크스페이스가 앱을 실행하면서 다른 워크스페이스에 공개 진입점을 제공할 수도 있으므로 `meta.projectKinds`에 둘 다 넣을 수 있습니다.

- `app` 증거: 실제 앱 entry, dev/start 실행, 앱 framework 설정, 배포 가능한 application target
- `library` 증거: `exports`·`main`·`module`·`types` 같은 소비 진입점 **그리고** library mode·tsup·rollup·publish artifact 같은 빌드/배포 증거

`private: true`나 사내 배포는 library를 배제하지 않습니다. 반대로 `build` 스크립트 하나만으로 library라 부르지 않습니다. 어느 역할도 증명되지 않으면 `projectKinds: []`로 두고 setup·library check에 적용 제외 이유를 남깁니다.

## Step 3: 인덱스·프로필 로드와 사실 수집

1. 실행 문서 풀을 만들고 전체 문서 인덱스를 한 번 읽어 넣습니다.
2. 선택된 [React 프로필](doctor-react.md) 또는 [Lynx 프로필](doctor-lynx.md)에서 플랫폼 인덱스·패키지 후보·registry namespace를 받고, 아직 문서 풀에 없는 플랫폼 인덱스만 읽습니다.
3. 문서 풀의 인덱스에서 이번 scope의 룰에 필요한 문서를 제목·category·설명으로 찾습니다. leaf URL이 문서 풀에 없을 때만 읽고, 경로를 기억하거나 조합하지 않습니다.
4. 공통 컴포넌트는 문서 풀의 전체 인덱스가 연결한 Components 문서와 각 문서의 Platform 표에서 현재 매핑을 찾습니다.

인덱스를 정상적으로 읽었는데 관련 문서가 없으면 공식 capability 부재입니다. 인덱스 또는 연결 문서를 읽지 못했으면 부재가 아니라 검증 실패입니다.

그다음 대상에서 필요한 사실만 읽습니다.

1. `seed-design.json`의 strict schema, framework, path
2. workspace `package.json`의 직접 의존성과 app/library 증거
3. hoist를 고려한 실제 설치본 package.json, peerDependencies, exports
4. snippet root의 `@file`, `@requires` 헤더
5. TypeScript paths, 번들러 alias·plugin·external, 앱 entry와 전역 CSS
6. SEED import·토큰·CSS 변수·컴포넌트 사용처와 기존 dist 증거

lockfile로 패키지 매니저를 정할 때는 대상에 가장 가까운 파일을 우선하고, 실행이 필요하면 그 매니저의 실행기를 사용합니다.

## Step 4: 검사 범위와 룰 실행

### 범위 선택

- "SEED 잘 쓰고 있나" 같은 일반 진단: `SKILL.md`의 공통 Doctor 룰 전체를 scope에 넣습니다.
- "셋업만", "라이브러리 배포 계약만" 같은 요청: 해당 category만 scope에 넣습니다.
- 탐색에 config를 읽더라도 범주 지정 요청에서 config category 룰까지 자동으로 확대하지 않습니다.

category는 `config | compatibility | setup | foundations | components | library`입니다.

### 룰 상태

scope에 들어온 룰마다 `checks[]`를 하나 이상 만듭니다.

| status | 사용 조건 |
|---|---|
| `pass` | 적용 조건이 성립하고, 정적 진단을 끝냈으며 finding이 없음 |
| `fail` | 적용 조건이 성립하고 finding이 하나 이상 있음 |
| `not-applicable` | 역할·사용 증거가 없거나, 정상적으로 읽은 현재 인덱스에 필요한 공식 계약이 없음 |
| `not-verified` | 인덱스·연결 문서·네트워크·도구·설치본·경로를 확인하지 못함 |

`pass`·`fail`은 `evidence`, 적용 제외·미검증은 `reason`을 씁니다. 모든 check에는 판정 또는 적용 제외를 뒷받침하는 공식 `references`가 필요합니다. 문서를 발견한 check는 플랫폼 인덱스와 실제로 읽은 leaf 문서를 함께 기록하고, 문서 부재 check는 확인한 플랫폼 인덱스를 기록합니다.

각 `check.rule`은 리포트 안에서 유일해야 합니다. finding은 동일한 `rule`의 `fail` check가 있을 때만 만들고, 각 `fail` check에는 적어도 하나의 finding이 있어야 합니다. `pass`·`not-applicable`·`not-verified` check의 rule은 findings에 나오면 안 됩니다.

[component-guidelines](../rules/component-guidelines.md)는 현재 공통 문서와 플랫폼 인덱스로 연결 가능한 컴포넌트마다 반복하고 `coverage`·`verdicts`를 채웁니다. 공식 계약을 찾지 못한 룰도 조용히 빼지 말고 해당 범주가 scope라면 `not-applicable`로 남깁니다.

### severity

- `error`: 실제 패키지·스니펫 비호환, CLI를 막는 config, 앱의 필수 setup 누락, 현재 설치본에서 해석되지 않는 공개 계약
- `warn`: deprecated 사용, 내부 component vars/API, 컴포넌트 가이드라인 이탈, peer·external·CSS 소유권 같은 라이브러리 배포 위험
- `info`: 최신 세대와의 격차, minor·patch 최신성, 알아두면 되는 교체 기회

같은 원인과 같은 수정으로 사라지는 finding은 하나로 묶고 전체 파일은 `files[]`에 둡니다. 룰 간 책임 경계는 각 룰의 "중복 경계"를 따릅니다.

## Step 5: YAML 출력

결과의 단일 원천은 schema v2 YAML입니다. 스키마는 `assets/doctor-report.schema.json`입니다.
예시의 `{...LeafUrlResolvedFromIndex}`는 실행 시 선택한 플랫폼 인덱스에서 찾은 실제 leaf URL로 바꿉니다.

```yaml
schemaVersion: 2
meta:
  target: /path/to/project
  workspace: packages/ui            # 모노레포일 때만
  framework: react
  projectKinds: [app, library]       # 비배타적. 증거가 없으면 []
  date: "2026-08-16"                # string 유지를 위해 따옴표 사용
  seed:
    installed: { "@seed-design/react": 2.3.0, "@seed-design/css": 2.5.0 }
    latest: { "@seed-design/react": 2.3.0, "@seed-design/css": 2.5.0 }
    snippetRoot: ./src/seed-design
summary: { error: 0, warn: 1, info: 0 }
checks:
  - rule: seed/project-config
    category: config
    status: pass
    evidence: seed-design.json의 framework·path와 alias가 일치함
    references:
      - https://seed-design.io/react/llms.txt
      - "{configurationLeafUrlResolvedFromIndex}"
  - rule: seed/library-authors
    category: library
    status: fail
    evidence: package.json은 소비 진입점을 내보내지만 SEED가 dependencies에 선언됨
    references:
      - https://seed-design.io/react/llms.txt
      - "{libraryAuthorsLeafUrlResolvedFromIndex}"
  - rule: seed/snippet-generation
    category: compatibility
    status: not-applicable
    reason: 설치 스니펫이 없음
    references:
      - https://seed-design.io/react/llms.txt
findings:
  - rule: seed/library-authors
    severity: warn
    message: 소비 가능한 패키지가 @seed-design/react를 dependencies에 선언합니다.
    file: packages/ui/package.json
    references:
      - https://seed-design.io/react/llms.txt
      - "{libraryAuthorsLeafUrlResolvedFromIndex}"
    remediation: |-
      다음 SEED Doctor finding을 수정해 주세요.

      대상 프로젝트: /path/to/project
      대상 파일: packages/ui/package.json
      문제: 소비 가능한 패키지가 @seed-design/react를 dependencies에 선언합니다.

      요구사항:
      - 공식 Library Authors 문서에서 현재 설치본과 호환되는 peer 범위를 확인해 @seed-design/react 선언을 옮겨 주세요.
      - 번들러 external 설정과 소비자의 CSS import 계약도 같은 문서 기준으로 맞춰 주세요.
      - 공개 API와 관련 없는 파일은 변경하지 마세요.

      근거:
      - https://seed-design.io/react/llms.txt
      - {libraryAuthorsLeafUrlResolvedFromIndex}

      먼저 저장소의 AGENTS.md와 package scripts를 확인하세요. 수정 후 package scripts에서 변경 범위에 맞는 검증을 선택해 실행하고 결과를 알려 주세요.
coverage: []
verdicts: []
rejected: []
```

### 필드 관계

- `checks`: 실제 검사 범위. 통과·실패·적용 제외·미검증을 모두 보여 줍니다.
- `findings`: 고칠 것만. `checks.status: fail`인 룰에서 나옵니다.
- `findings[].remediation`: finding 하나를 별도 수정 요청으로 전달할 수 있는 완결된 프롬프트입니다. Doctor가 프롬프트를 실행했다는 뜻은 아닙니다.
- `summary`: findings를 severity별로 다시 센 값입니다. 손으로 추정하지 않습니다.
- `verdicts`: component-guidelines의 기준별 판정 전체. `pass | fail | unknown | not-verified`를 유지합니다.
- `coverage`: component-guidelines의 기계 수집 기준 수(`expected`)와 실제 판정 수(`judged`), 판단 보충 수(`derived`). `expected != judged`면 실행 결함입니다.
- `rejected`: 실제 검토했지만 공식 기준이 허용하거나 증거가 부족해 finding으로 만들지 않은 후보입니다.

JSON Schema는 배열 간 동적 `rule` 일치를 표현하지 못하므로, YAML을 저장하기 전에 다음 의미 검증을 별도로 수행합니다.

1. `checks[].rule`이 중복되지 않음
2. 모든 `findings[].rule`에 동일한 rule의 `fail` check가 정확히 하나 있음
3. 모든 `fail` check에 동일한 rule의 finding이 적어도 하나 있음
4. `summary`가 findings의 severity별 개수와 일치하고, 모든 `coverage`의 `expected == judged`임

하나라도 실패하면 리포트를 완료한 것으로 보고하지 말고 판정·집계를 먼저 바로잡습니다.

`verdicts.unknown`은 문서 임계값 부재·런타임 의존·코드 밖 정보·문서 충돌처럼 기준별 판정이 불가능할 때 사용합니다. 룰 실행 자체의 적용 여부를 나타내는 `checks.status`와 혼동하지 않습니다.

`verdicts.unknownReason`은 다음 네 값으로 이유를 보존합니다.

| 값 | 뜻 | 조치 주체 |
|---|---|---|
| `no-threshold` | 문서가 위반 임계값을 정하지 않음 | SEED 문서 |
| `runtime-dependent` | 런타임 데이터에 따라 달라짐 | 프로젝트 |
| `not-in-code` | 코드만으로 확인할 수 없음 | 프로젝트 |
| `doc-conflict` | 공식 문서 문장끼리 충돌하거나 두 가지로 읽힘 | SEED 문서 |

component-guidelines finding은 1단계 기계 기준에서 나왔으면 `criterionIds`, 2단계 판단 기준에서 나왔으면 `criterion`으로 verdict와 연결합니다. 같은 기준의 위반이 여러 파일에 있으면 파일별로 내되, 공유 구현 하나가 원인이거나 수정 한 번으로 모두 사라지면 대표 `file` 한 건과 `files[]` 전체 목록으로 묶습니다.

`rejected`는 실제로 살펴본 후보만 적습니다. 공식 문서가 허용하거나, 증거가 부족하거나, 역할이 다른 구현이거나, 의도적인 도메인 선택으로 보이는 경우에 candidate·reason·file을 남깁니다. 칸을 채우기 위해 후보를 만들지 않습니다.

### 수정 프롬프트 계약

각 finding의 `remediation`은 설명문이 아니라 그대로 복사해 코딩 에이전트에 전달할 수 있는 명령형 프롬프트로 씁니다. 하나의 프롬프트만 읽어도 수정 범위를 이해할 수 있도록 다음을 포함합니다.

1. `meta.target`과 finding의 `file`, 값이 있으면 `line`
2. finding의 `message`로 확인한 문제
3. 공식 문서에서 도출한 구체적인 수정 요구사항
4. 관련 없는 파일·공개 API·사용자 변경을 보존하는 제약
5. finding의 `references` 전체
6. 저장소 지침과 package scripts를 먼저 확인하고 변경 범위에 맞게 검증하라는 요청

존재하지 않는 명령·파일·대체 API를 프롬프트에 추측해서 넣지 않습니다. 여러 finding이 같은 원인과 한 번의 수정으로 해결되면 기존 묶음 규칙대로 하나의 finding과 하나의 프롬프트를 만듭니다. Doctor는 이 프롬프트를 생성만 하며, 사용자가 실제 수정을 요청하기 전에는 실행하지 않습니다.

## 저장과 다중 워크스페이스

- 대상 프로젝트에는 쓰지 않습니다. schema v2 YAML과 HTML을 같은 임시 디렉토리에 저장하고 두 경로를 알려줍니다.
- 사용자가 명시적으로 "YAML만"을 요청한 경우에만 HTML을 생략합니다.
- 여러 워크스페이스를 전체 진단하면 각 workspace마다 schema v2 YAML과 HTML을 한 쌍씩 만듭니다.
- 같은 workspace를 범주별로 나눠 검사했다면 `checks`·`findings`·`verdicts`·`coverage`·`rejected`를 합치고 findings에서 summary를 다시 계산합니다. `meta`가 다르면 합치지 않습니다.
- 채팅에는 workspace별 요약, 적용 제외·미검증 수, "먼저 할 것"과 YAML·HTML 경로만 전달합니다.

## HTML 리포트

스키마와 필드 관계 검증을 통과한 YAML만 입력으로 사용해 `assets/report-template.html`의 구조를 채웁니다. HTML에서 판정이나 집계를 별도로 만들지 않습니다. 렌더링에 실패하면 검증된 YAML은 보존하고 실패 이유를 알리며, HTML까지 생성된 것처럼 보고하지 않습니다.

- 한 파일로 완결합니다. CDN·외부 폰트·JavaScript를 쓰지 않고 `<details>`로 접습니다.
- "먼저 할 것" 다음에 **범주별 검사 범위**를 보여 줍니다.
- `not-applicable`·`not-verified` 이유와 references를 숨기지 않습니다.
- 기존 finding 근거·수정 프롬프트, 판정 표, coverage, 기각 목록, severity count를 보존합니다.
- footer에 대상 코드를 수정하지 않았음을 명시합니다.
