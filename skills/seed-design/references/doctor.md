# 사용 상태 진단 (doctor)

프로젝트가 SEED를 어떻게 쓰고 있는지 진단하고, **무엇을 읽고 어떻게 고쳐야 하는지**까지 알려주는 절차입니다. 린터가 아니라 가이드입니다 — 판정마다 배경 맥락, 참조 문서 링크, 수정 방법이 함께 나가야 합니다.

`compat`(스니펫 버전 호환성 검사)·`upgrade.md`(changelog 기반 업그레이드 진단)와 역할이 다릅니다. doctor는 **코드 사용 상태**를 봅니다.

## 원칙

- **진단은 read-only입니다.** "수정 방법"은 사용자에게 전달할 안내이지 지금 실행할 명령이 아닙니다. 코드 변경·재설치는 사용자가 별도로 지시할 때만 합니다.
- **판단 근거는 문서이지 기억이 아닙니다.** 각 룰이 가리키는 참조 문서를 실제로 읽고 대조합니다.
- **확신이 없으면 보고하지 않습니다.** 모든 판정에는 코드 증거(파일:라인)가 있어야 합니다.
- **이 진단은 상위 모델을 전제합니다.** 경량 모델이 기준 수집과 기각 목록을 통째로 건너뛰는 것이 실측됐습니다 — 형식은 통과하므로 결과만 봐서는 모릅니다. 아래 `coverage`가 그걸 드러내는 장치입니다.

## 지식 지도

| 지식 | 위치 |
|------|------|
| 컴포넌트 디자인 가이드라인 (판정 기준의 출처) | `https://seed-design.io/llms/components/{id}.txt` — **원문(raw)으로 읽기** |
| 가이드라인 문서 목록 | `https://seed-design.io/components/llms.txt` |
| React API (Props 표) | `https://seed-design.io/llms/react/components/{id}.txt` |
| Deprecated 현황 | `https://seed-design.io/llms/docs/migration/deprecations.txt` |
| 업그레이드 가이드 | `https://seed-design.io/llms/react/updates/upgrade/v2.txt` · `v1.txt` |
| 스니펫 canonical 세대 (`items[].snippets[].dependencies`) | `https://seed-design.io/__registry__/{framework}/{registryId}/index.json` (예: `react/ui`) |
| 개별 스니펫 본문 | `https://seed-design.io/__registry__/{framework}/{registryId}/{itemId}.json` — `{itemId}/index.json`은 404 |
| **설치 세대의** registry (그때 뭐가 있었는지) | `https://v1-0.seed-design.io` · `v1-1` · `v1-2` — **이 셋뿐입니다.** 아카이브된 버전만 서브도메인이 있고, 그 외(`v2-0` 등)는 도메인 자체가 없어 조회가 실패합니다 |
| 패키지 최신 버전 | `npm view {pkg} version` — 막힌 환경이면 `curl -s https://registry.npmjs.org/{pkg}/latest \| jq -r .version` (`/latest` 없이 받으면 400KB가 넘으니 반드시 붙입니다) |

## Step 1: 프로젝트 사실 수집

판정 전에 프로젝트 상태를 파악합니다.

1. `seed-design.json` — `framework`(기본 `react`)와 `path`(스니펫 디렉토리) 확인
2. `package.json` — 설치된 `@seed-design/*` 패키지와 버전
3. `path`가 가리키는 디렉토리 — 설치된 스니펫 목록

**모노레포라면 먼저 "어느 워크스페이스가 SEED를 쓰는가"를 찾습니다.** `seed-design.json`과 `@seed-design/*` 의존성이 워크스페이스마다 따로 있을 수 있고, SEED를 아예 안 쓰는 워크스페이스는 대상이 아닙니다. 파일을 찾을 때 `node_modules`와 `.claude/worktrees`는 **반드시 제외합니다** — 워크트리 사본의 `seed-design.json`이 잡히면 같은 프로젝트를 중복 진단하게 됩니다.

사용자가 경로를 지정하면 그 범위만, 아니면 프로젝트 전체를 봅니다.

## Step 2: 룰 순회

**`rules/` 디렉토리의 모든 파일을 나열하고, 각 파일을 읽고 그 판정 방법대로 프로젝트를 검사합니다.** 룰 파일이 추가되면 이 절차에 자동으로 포함됩니다 — 이 문서에는 룰 목록을 복제하지 않습니다.

각 룰은 공통 형식을 따릅니다: 무엇을 판정하는지(severity) → 왜 → 판정 방법 → 수정 방법 → 읽어야 할 문서. 판정이 나오면 해당 룰의 "수정 방법"과 "읽어야 할 문서"를 결과에 함께 싣습니다.

[component-guidelines](rules/component-guidelines.md)는 컴포넌트별로 반복 적용합니다 — 코드에 등장하는 컴포넌트마다 가이드라인 문서를 읽고 기준을 도출해 판정합니다.

## Step 3: 출력

**결과는 YAML 파일 하나로 씁니다.** 채팅 요약과 HTML 리포트는 이 파일에서 파생되므로, 형태가 셋으로 갈리지 않고 하나가 원본입니다. 스키마는 `assets/doctor-report.schema.json`이고, 필드 설명이 거기 들어 있습니다.

```yaml
schemaVersion: 1
meta:
  target: /path/to/project
  workspace: services/webview      # 모노레포일 때만. 단일 패키지면 생략
  framework: react
  date: "2026-08-02"   # 따옴표 필수 — 없으면 파서에 따라 날짜 객체가 되어 스키마(string)를 어깁니다
  seed:
    installed: { "@seed-design/react": 1.2.0, "@seed-design/css": 1.2.0 }
    latest: { "@seed-design/react": 2.1.0, "@seed-design/css": 2.3.0 }
    snippetRoot: ./src/seed-design
summary: { error: 0, warn: 1, info: 0 }   # findings에서 계산한 값 (아래는 축약 예시라 1건만 실었습니다)
findings:
  - rule: seed/component-guidelines/bottom-sheet
    severity: warn
    message: 시트 너비에 480px 상한이 없습니다.
    file: services/webview/src/components/bottom-sheet/FlexibleBottomSheet.css.ts
    line: 16
    criterion: "6"
    references: [https://seed-design.io/llms/components/bottom-sheet.txt]
    remediation: |
      문서 근거와 수정 방법. 지금 실행하지 말고 안내만 합니다.
coverage:
  - rule: seed/component-guidelines/bottom-sheet
    expected: 2    # 1단계 기계 수집 개수 (bottom-sheet 문서 기준 실제 값)
    judged: 2      # verdicts에 나온 1단계 기준 수 — expected와 다르면 그 자체가 결함
    derived: 6     # 2단계 판단 보충 개수
verdicts:
  - rule: seed/component-guidelines/bottom-sheet
    criterionId: bottom-sheet.rule-1   # 1단계 기준이면 고정 id
    text: Snap Point를 추가하는 경우 Handle을 반드시 표시해야 합니다.
    verdict: pass
    evidence: 스냅 포인트 미구현 — 조건 불성립
  - rule: seed/component-guidelines/bottom-sheet
    criterion: "6"                      # 2단계 도출분은 번호만
    text: Bottom Sheet는 화면 너비 최대 480px까지 보여집니다.
    verdict: fail
    evidence: FlexibleBottomSheet.css.ts:16 — maxWidth 없음
rejected:
  - candidate: aria-labelledby 미해결 참조
    reason: 문서에 접근성 문장이 없어 "문서에 없는 규칙을 만들지 않는다"로 기각
```

**대상 프로젝트에 쓰지 않습니다.** 진단은 read-only입니다. 기본은 임시 디렉토리에 쓰고 경로를 알려주며, 저장 위치는 사용자가 정합니다.

**채팅에는 요약과 "먼저 할 것"만 냅니다.** 파일에 전문이 있으므로 같은 내용을 반복하지 않습니다.

**`summary`는 손으로 세지 말고 `findings`에서 계산합니다.** 스무 건이 넘어가면 사람이 틀립니다.

범위를 나눠 여러 번 돌렸으면 조각들을 하나로 합칩니다. `findings`·`verdicts`·`rejected`는 이어 붙이고, **`summary`는 합친 뒤 다시 셉니다**(조각별 카운트를 더하면 안 됩니다). `meta`는 어느 조각 것이든 같아야 하며, 다르면 서로 다른 대상을 진단한 것이니 합치지 않습니다.

### coverage — 건너뛰기를 드러내는 장치

component-guidelines를 판정했으면 **컴포넌트마다 `coverage`를 채웁니다.**

- `expected` — 룰의 1단계(기계 수집)가 낸 기준 수. 같은 문서에 같은 명령이므로 누가 세도 같아야 합니다.
- `judged` — verdicts에 실제로 나온 1단계 기준 수(`criterionId` 있는 것).
- `derived` — 2단계(판단 보충)로 얹은 기준 수.

**`expected ≠ judged`면 그 자체가 보고할 결함입니다** — 기준을 건너뛴 실행입니다. 채팅 요약에도 커버리지를 한 줄 남깁니다: "bottom-sheet: 기준 2+6개 판정".

### verdicts — 판정 표

도출한 기준 전 항목이 들어갑니다. 통과한 것도 판정하지 못한 것도 숨기지 않습니다. 1단계 기준에는 `criterionId`를 답니다.

`unknown`은 정보가 부족해 판정할 수 없을 때 씁니다. **확인해서 통과한 것(`pass`)과 확인하지 못한 것을 같은 칸에 넣지 않습니다.** 왜 판정하지 못했는지는 `unknownReason`으로 구분합니다.

| 값 | 뜻 | 조치 주체 |
|---|---|---|
| `no-threshold` | 문서가 임계값을 정하지 않음 | — |
| `runtime-dependent` | 조건이 런타임 데이터로 결정됨 | 프로젝트 |
| `not-in-code` | 코드에서 확인할 수 없음 | 프로젝트 |
| `doc-conflict` | **문서 문장끼리 모순되거나 두 가지로 읽힘** | **SEED** — 문서를 고쳐야 합니다 |

`doc-conflict`만 조치 주체가 다릅니다. 나머지는 진단 대상 프로젝트의 사정이지만 이건 우리 문서의 결함이라, 같은 칸에 섞이면 고칠 사람에게 안 갑니다. 어느 문장이 어떻게 충돌하는지를 `evidence`에 적습니다.

검사는 했는데 **대상이 0개**여서 통과한 경우(조건절 기준의 조건 불성립, 해당 패키지 없음 등)도 `pass`이되, 근거에 "대상 없음"이라고 밝힙니다. 통과했다는 사실보다 **무엇을 근거로 통과했는지**가 읽는 사람에게 중요합니다.

**확인 자체를 못 했으면 `not-verified`로 적고, 무엇이 남았는지 씁니다.** 네트워크가 막혀 문서를 못 읽었거나 명령을 실행할 수 없었던 경우입니다. **검증 공백을 위반으로 바꾸지 않습니다** — 확인하지 못한 것은 "확인하지 못했다"이지 "잘못됐다"가 아닙니다. 진단을 못 돌린 영역이 있으면 그 사실을 밝히고, 안 본 곳을 본 것처럼 쓰지 않습니다.

`not-verified`는 **도구에 접근하지 못한 경우**입니다. 코드를 읽어 경로를 끝까지 추적했으면 확인한 것입니다 — 진단은 정적으로 수행하며 앱을 실행해볼 것을 요구하지 않습니다.

### findings — 고칠 것

`fail`인 항목만 들어갑니다. `criterion`으로 verdicts의 같은 항목과 이어지므로, 읽는 사람이 근거 기준을 찾아갈 수 있습니다.

**severity 기준**:

- `error` — 지금 사용자에게 실제 문제가 되는 것 (동작 오류, 깨진 접근성 참조, 잘못된 값)
- `warn` — 지금 동작하지만 고쳐야 하는 것 (디자인 시스템 이탈, 제공되는 기능의 중복 구현, 다음 메이저에서 깨질 것)
- `info` — 알고만 있으면 되는 것

한 기준에 위반 근거가 여러 개면 **파일마다 한 건씩** 냅니다(한 파일 안의 여러 줄은 한 건으로 묶고 remediation에 각각을 적습니다). 단 원인이 하나이고 조치도 한 번이면 **전체를 한 건으로 묶습니다** — 패키지가 뒤져서 스니펫이 전건 구세대인 경우가 그렇습니다. 묶을 때는 `file`에 대표 파일이나 그것들을 담은 디렉토리를 적고 **전체 목록은 `files`에** 둡니다. 여러 기준을 함께 묶었으면 `criterion`에 콤마로 나열합니다(`"1,4,8"`).

### rejected — 검토했지만 기각한 것

위반으로 올릴까 하다가 뺀 후보를 짧게 남깁니다. 다음 중 하나면 기각입니다.

- 문서나 룰이 현재 구현을 **허용**한다
- 증거가 부족하다
- 프로젝트의 **의도적인 선택**으로 보인다(설문에서 기본 선택을 주지 않는 것처럼, 도메인 요구가 문서 권장과 충돌하는 경우)
- 고쳐도 사용자에게 이득 없이 복잡도만 는다

**실제로 살펴본 후보만 적습니다.** 칸을 채우려고 지어내지 않습니다. 이 목록이 있어야 읽는 사람이 "이건 왜 지적 안 했지?"를 묻지 않습니다.

### summary

severity별 카운트(error N · warn N · info N)입니다. 점수나 등급은 매기지 않습니다. **개수를 늘리려고 지적을 만들지 않습니다** — 짧은 결과나 위반 0건도 정상입니다.

## HTML 리포트

진단 결과가 수십 건이 되면 텍스트로는 읽히지 않습니다. 판정 표가 길고, 원인이 하나인데 위반이 여러 건이고, remediation이 각각 한 문단이라 어디부터 봐야 할지 알기 어렵습니다. 사용자가 리포트를 원하면 **위 YAML을 입력으로 삼아** `assets/report-template.html`의 구조를 그대로 쓰고 데이터만 채웁니다.

- **한 파일로 완결시킵니다.** CDN·외부 폰트·스크립트를 쓰지 않습니다. 진단 대상 프로젝트에 SEED가 설치돼 있지 않아도, 인터넷이 없어도 열려야 합니다. 접기는 `<details>`로 하고 JS를 넣지 않습니다.
- YAML과 같은 디렉토리에 씁니다(대상 프로젝트에는 쓰지 않습니다).
- **"먼저 할 것"을 맨 위에 둡니다.** finding 목록을 severity 순으로 늘어놓는 것으로는 부족합니다 — 원인이 같은 것끼리 묶어 순서를 제시해야 유저가 다음에 뭘 할지 압니다. 패키지가 뒤져서 스니펫이 전건 구세대인 경우처럼, 조치 하나가 여러 finding을 한꺼번에 지웁니다.
- 텍스트 보고에 있던 것을 빼지 않습니다 — 판정 표(통과·판정 불가 포함), 기각한 후보, 카운트가 그대로 들어갑니다.
