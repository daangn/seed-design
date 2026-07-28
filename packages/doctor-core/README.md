# @seed-design/doctor-core

SEED Doctor의 중립 룰 엔진입니다. 디자인 시스템 지식 없이 다음만 제공합니다:

- **계약**: `Rule`(static/agent), `Finding`, `DoctorReport`(스키마 버저닝된 JSON 출력)
- **실행기**: `runStaticRules` — 결정론 static 룰을 파일들에 실행
- **억제**: `// seed-doctor-ignore(-next-line) <rule-id> -- <사유>` 인라인 디렉티브
- **리포터**: 사람용 텍스트(`formatHumanReport`) / JSON(`buildJsonReport`)
- **핸드오프**: agent 룰의 대상·참조 문서·acceptance criteria를 에이전트용 마크다운으로 생성 (`generateAgentHandoff`) — 엔진은 LLM을 호출하지 않습니다

룰과 디자인 시스템 지식은 룰 팩 패키지(`@seed-design/doctor-preset`)가 소유하며, 진입점은 `@seed-design/cli`의 `seed-design doctor` 커맨드입니다.

```ts
import { runStaticRules, buildJsonReport } from "@seed-design/doctor-core";

const result = runStaticRules({ files, rules: rulePack.rules, config });
const report = buildJsonReport(result, meta);
```
