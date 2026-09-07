---
name: seed-dev-figma-v3-migration-plugin
description: Figma V3 migration 매핑·메타데이터 변환을 수정할 때 사용한다.
---

# Dev Figma V3 Migration Plugin

요청 범위와 목표 결과를 확인한 뒤, 필요한 가이드 절만 읽어 적용한다.

1. 현재 메타데이터로 판단할 수 없는 V2·V3 컴포넌트 속성만 추출해 동기화한다.
2. 변경된 매핑과 생성 메타데이터에 필요한 원천만 수정하고 기존 매핑 패턴을 따른다.
3. 변경한 표면과 가이드가 요구하는 검증만 수행한 뒤 변경 파일·남은 위험을 보고한다.

## 참조 파일

- `references/guide.md`
