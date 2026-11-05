---
description: $TARGET_COMPONENT $TASK
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Figma V3 마이그레이션 플러그인 개발

`seed-dev-figma-v3-migration-plugin` Skill로 매핑과 마이그레이션 플러그인을 갱신한다. 명령은 `tools/figma-v3-migration`에서 실행한다.

## 인자

- $TARGET_COMPONENT: v2/v3 컴포넌트 이름 또는 대상 매핑 파일
- $TASK: 선택. `extract|map|typecheck|debug`

## 작업별 필수 결과

- `extract` → `bun extract`로 `src/main/data/__generated__/v3-component-sets` 메타데이터를 동기화하고 바뀐 생성 경로를 남긴다. 대응하는 `src/main/mapping` 파일을 갱신하고 variant·property 변환과 `bun run typecheck:main` 결과를 기록한다.
- `map` → 대상 `src/main/mapping` 파일을 갱신한다. variant·property 변환과 `bun run typecheck:main` 결과를 기록한다.
- `typecheck` → `bun run typecheck`(`typecheck:main`과 `typecheck:ui`) 결과와 진단만 남긴다. 매핑 파일은 바꾸지 않는다.
- `debug` → 재현 방법, 확인한 원인, 진단 결과만 남긴다. 매핑 파일은 바꾸지 않는다.
