---
"@seed-design/doctor-core": minor
"@seed-design/doctor-preset": minor
"@seed-design/cli": minor
---

`seed-design doctor` 명령어가 추가됐어요 (실험적). 프로젝트가 SEED를 어떻게 쓰고 있는지 진단하고, **왜 중요한지·어떤 문서를 읽어야 하는지·어떻게 바꾸는지**를 함께 알려줘요.

- 결정론 룰: `seed/no-deprecated-component`(deprecated 컴포넌트·스니펫), `seed/valid-variant`(최신 스펙에 없는 variant 값), `seed/snippet-generation`(구버전 스니펫)
- 에이전트 룰: `seed/component-usage-review/{component}` — 정적 분석으로 판정할 수 없는 영역은 검토 요청 문서를 만들고 판단은 여러분의 에이전트가 해요. Bottom Sheet부터 시작해요
- `--prompt`로 사실과 검토 요청을 한 문서로 받아 에이전트에 바로 넘길 수 있어요
- `--json`(스키마 버저닝), `--fail-on`(CI 게이트), 인라인 억제 주석(`seed-doctor-ignore`), 선택적 `seed-doctor.json` 설정 지원

새 패키지 두 개가 함께 배포돼요. `@seed-design/doctor-core`는 디자인 시스템 지식이 없는 중립 룰 엔진이고, `@seed-design/doctor-preset`은 seed-design.io 아티팩트를 지식원으로 쓰는 SEED 룰 팩이에요.
