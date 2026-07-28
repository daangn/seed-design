# 사용 상태 진단 (doctor)

`doctor`는 프로젝트가 SEED를 어떻게 쓰고 있는지 진단하고, **무엇을 읽고 어떻게 고쳐야 하는지**까지 알려주는 명령어입니다. 린터가 아니라 가이드입니다 — 각 항목에 배경 맥락, 참조 문서 링크, 수정 방법이 함께 나옵니다.

`compat`(패키지 버전 호환성)·`upgrade.md`(changelog 기반 업그레이드 진단)와 역할이 다릅니다. doctor는 **코드 사용 상태**를 봅니다.

## 실행

```bash
npx @seed-design/cli@latest doctor
```

경로를 지정해 범위를 좁힐 수 있습니다.

```bash
npx @seed-design/cli@latest doctor src/pages
```

## 룰의 두 종류

doctor의 룰은 **판정을 무엇이 하느냐**로 나뉩니다. 둘 다 같은 모양의 가이드(맥락·참조 문서·수정 방법)를 냅니다.

- **결정론 룰** — 코드로 판정합니다. deprecated 사용, 최신 스펙에 없는 variant 값, 구버전 스니펫 등. 기본 출력과 `--json`에 포함되고 `--fail-on` 게이트의 대상입니다.
- **에이전트 룰** — 판단이 필요해 결정론으로 못 푸는 영역입니다. 컴포넌트 사용이 가이드라인에 맞는지, 직접 구현한 동작을 제공되는 prop으로 대체할 수 있는지 등. doctor는 LLM을 호출하지 않고 **검토 요청 문서만 생성**하며, 실행은 사용자의 에이전트가 합니다. 집계와 게이트에서는 제외됩니다.

## 에이전트로 검토하기

`--prompt`는 결정론 룰이 알아낸 **사실**과 에이전트에게 위임할 **검토 요청**을 한 문서로 만듭니다. 이 문서만으로 작업이 되도록 자기완결적으로 작성됩니다.

```bash
npx @seed-design/cli@latest doctor --prompt
```

이 스킬이 doctor를 다룰 때의 절차:

1. `doctor --prompt`를 실행해 핸드오프 문서를 받습니다.
2. 문서에 링크된 참조 문서를 **먼저 읽습니다**. 판단 근거는 그 문서여야 하고, 기억에 의존하지 않습니다.
3. "확인된 사실"은 이미 검증된 내용이므로 다시 조사하지 않고 그대로 활용합니다.
4. "검토 요청"은 acceptance criteria **항목별로 pass/fail**을 판정합니다. 자유 서술 총평이 아닙니다.
5. 위반만 보고하되 파일·라인 증거를 답니다. 확신이 없으면 보고하지 않습니다.

## CI에서 쓰기

`--fail-on` 기준(기본 `error`) 이상이면 종료 코드 `1`입니다. 에이전트 룰은 게이트에 포함되지 않으므로 CI 결과는 결정론적입니다.

```bash
npx @seed-design/cli@latest doctor --fail-on warn
```

`--json`은 스키마 버저닝된 리포트를 출력합니다. 억제된 finding도 `suppressed: true`로 포함되고, 각 finding에 룰의 가이드(맥락·참조 문서·수정 방법)가 실려 있습니다.

## 억제

정당한 사유가 있으면 주석으로 억제합니다. 사유를 함께 남기는 걸 권장합니다.

```tsx
// seed-doctor-ignore-next-line seed/no-deprecated-component -- 2.0 마이그레이션 진행 중
import { Fab } from "@seed-design/react";
```

룰 전체를 끄거나 심각도를 바꾸려면 프로젝트 루트에 `seed-doctor.json`을 둡니다.

```json
{
  "ignore": ["src/legacy/**"],
  "rules": { "seed/valid-variant": "warn" }
}
```
