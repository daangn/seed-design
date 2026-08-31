---
description: $TARGET_COMPONENT $TASK
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Figma V3 마이그레이션 플러그인 개발

`seed-dev-figma-v3-migration-plugin` 스킬로 매핑과 마이그레이션 플러그인을 갱신합니다.

## 인자

- $TARGET_COMPONENT: v2/v3 컴포넌트 이름 또는 대상 매핑 파일
- $TASK: 선택 사항. `extract|map|typecheck|debug`

## 필수 결과

1. `tools/figma-v3-migration/src/main/mapping`의 매핑 파일을 갱신합니다.
2. `bun extract`와 typecheck의 실행 방법 또는 결과를 남깁니다.
3. variant와 property 변환 내용을 명확하게 기록합니다.
