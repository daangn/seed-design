---
"@seed-design/cli": patch
---

`upgrade` 명령어를 추가합니다.

- 프로젝트에 설치된 `@seed-design/*` 패키지의 현재 버전과 최신 버전을 비교하고, 그 사이의 변경사항(changelog)을 확인할 수 있습니다.
- `--raw` 플래그를 사용하면 UI 없이 순수 마크다운으로 출력되어 LLM 에이전트에 전달하기 적합합니다.
- 패키지명은 shorthand(`react`) 또는 full name(`@seed-design/react`) 모두 지원합니다.
