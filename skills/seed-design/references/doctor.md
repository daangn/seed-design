# 사용 상태 진단 (doctor)

프로젝트가 SEED를 어떻게 쓰고 있는지 진단하고, **무엇을 읽고 어떻게 고쳐야 하는지**까지 알려주는 절차입니다. 린터가 아니라 가이드입니다 — 판정마다 배경 맥락, 참조 문서 링크, 수정 방법이 함께 나가야 합니다.

`compat`(스니펫 버전 호환성 검사)·`upgrade.md`(changelog 기반 업그레이드 진단)와 역할이 다릅니다. doctor는 **코드 사용 상태**를 봅니다.

## 원칙

- **진단은 read-only입니다.** "수정 방법"은 사용자에게 전달할 안내이지 지금 실행할 명령이 아닙니다. 코드 변경·재설치는 사용자가 별도로 지시할 때만 합니다.
- **판단 근거는 문서이지 기억이 아닙니다.** 각 룰이 가리키는 참조 문서를 실제로 읽고 대조합니다.
- **확신이 없으면 보고하지 않습니다.** 모든 판정에는 코드 증거(파일:라인)가 있어야 합니다.

## 지식 지도

| 지식 | 위치 |
|------|------|
| 컴포넌트 디자인 가이드라인 (판정 기준의 출처) | `https://seed-design.io/llms/components/{id}.txt` — **원문(raw)으로 읽기** |
| 가이드라인 문서 목록 | `https://seed-design.io/components/llms.txt` |
| React API (Props 표) | `https://seed-design.io/llms/react/components/{id}.txt` |
| Deprecated 현황 | `https://seed-design.io/llms/docs/migration/deprecations.txt` |
| 업그레이드 가이드 | `https://seed-design.io/llms/react/updates/upgrade/v2.txt` · `v1.txt` |
| 스니펫 canonical 세대 (`snippets[].dependencies`) | `https://seed-design.io/__registry__/{framework}/index.json` |
| npm 최신 버전 | `npm view {pkg} version` |

## Step 1: 프로젝트 사실 수집

판정 전에 프로젝트 상태를 파악합니다.

1. `seed-design.json` — `framework`(기본 `react`)와 `path`(스니펫 디렉토리) 확인
2. `package.json` — 설치된 `@seed-design/*` 패키지와 버전
3. `path`가 가리키는 디렉토리 — 설치된 스니펫 목록

사용자가 경로를 지정하면 그 범위만, 아니면 프로젝트 전체를 봅니다.

## Step 2: 룰 순회

**`../rules/` 디렉토리의 모든 파일을 나열하고, 각 파일을 읽고 그 판정 방법대로 프로젝트를 검사합니다.** 룰 파일이 추가되면 이 절차에 자동으로 포함됩니다 — 이 문서에는 룰 목록을 복제하지 않습니다.

각 룰은 공통 형식을 따릅니다: 무엇을 판정하는지(severity) → 왜 → 판정 방법 → 수정 방법 → 읽어야 할 문서. 판정이 나오면 해당 룰의 "수정 방법"과 "읽어야 할 문서"를 결과에 함께 싣습니다.

[component-guidelines](../rules/component-guidelines.md)는 컴포넌트별로 반복 적용합니다 — 코드에 등장하는 컴포넌트마다 가이드라인 문서를 읽고 기준을 도출해 판정합니다.

## Step 3: 출력

**판정 표** — 도출한 기준 전 항목을 남깁니다. 통과한 것도 판정하지 못한 것도 숨기지 않습니다.

| # | 기준 | 판정 | 근거 |
|---|------|------|------|
| 1 | 기준 문장 그대로 (도출한 경우 출처 절도) | `pass` / `fail` / `unknown` | 파일:라인 또는 판정하지 못한 이유 |

`unknown`은 정보가 부족해 판정할 수 없을 때 씁니다. **확인해서 통과한 것(`pass`)과 확인하지 못한 것을 같은 칸에 넣지 않습니다.**

**위반 목록** — `fail` 항목만 JSON 배열로 정리합니다.

```jsonc
{
  "ruleId": "<판정한 룰. 예: seed/component-guidelines/bottom-sheet>",
  "severity": "error" | "warn" | "info",
  "message": "<위반 내용 한 문장>",
  "file": "<프로젝트 루트 기준 상대 경로 — 대상 파일이 아니라 실제로 고쳐야 할 위치>",
  "line": 1,
  "remediation": "<수정 방법 — 참조 문서 근거 포함. 지금 실행하지 말고 안내만>",
  "data": { "criterion": "<위반한 기준 번호>" }
}
```

**severity 기준**:

- `error` — 지금 사용자에게 실제 문제가 되는 것 (동작 오류, 깨진 접근성 참조, 잘못된 값)
- `warn` — 지금 동작하지만 고쳐야 하는 것 (디자인 시스템 이탈, 제공되는 기능의 중복 구현, 다음 메이저에서 깨질 것)
- `info` — 알고만 있으면 되는 것

한 기준에 위반 근거가 여러 개면 **파일당 한 건으로 묶고** message에 요약, remediation에 각각을 적습니다.

**요약** — severity별 카운트(error N · warn N · info N)로 마무리합니다. 점수나 등급은 매기지 않습니다.
