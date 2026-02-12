---
"@seed-design/cli": patch
---

CLI 실패 원인 표시를 개선하고 `--verbose` 상세 진단 출력을 추가합니다.
`seed-design.json`이 없을 때 외부 명령 실행 대신 내부 초기화 로직으로 설정 파일을 생성합니다.
또한 `@clack/prompts`를 v1으로 업데이트하고 `init --default`를 `--yes` 호환 alias로 유지합니다.
