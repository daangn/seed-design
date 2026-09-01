---
description: $TARGET_COMPONENT $TASK
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Figma V3 마이그레이션 플러그인 개발

`seed-dev-figma-v3-migration-plugin` 스킬로 매핑과 마이그레이션 플러그인을 갱신합니다.

## 인자

- $TARGET_COMPONENT: v2/v3 컴포넌트 이름 또는 대상 매핑 파일
- $TASK: 선택 사항. `extract|map|typecheck|debug`

## 작업별 필수 결과

명령은 `tools/figma-v3-migration`에서 실행합니다.

- `extract`: `bun extract`로 메타데이터를 동기화하고 변경된 생성 경로를 남깁니다. 대응하는 `src/main/mapping` 파일을 갱신하고 variant와 property 변환, `bun run typecheck:main` 결과를 기록합니다.
- `map`: 대상 `src/main/mapping` 파일을 갱신합니다. variant와 property 변환을 기록하고 `bun run typecheck:main` 결과를 남깁니다.
- `typecheck`: `tsc --noEmit`을 실행하는 `bun run typecheck` 결과와 진단만 남깁니다. 매핑 파일 변경은 요구하지 않습니다.
- `debug`: 재현 방법, 확인한 원인과 진단 결과만 남깁니다. 매핑 파일 변경은 요구하지 않습니다.
