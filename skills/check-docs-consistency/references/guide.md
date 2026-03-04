# Check Docs Consistency

SEED Design System의 문서 레이어 간 일관성을 검증합니다.

## Quick Start

1. 단일 컴포넌트 점검인지 전체 감사인지 범위를 먼저 결정합니다.
2. Rootage/Design Docs/React Docs 3개 레이어를 동일한 컴포넌트 ID로 비교합니다.
3. 불일치 유형(이름/설명/props/파일 누락)을 분류해서 보고합니다.
4. 세부 규칙은 `references/validation-rules.md`, 실행 절차는 `references/workflow.md`를 참고합니다.

## 문서 레이어

| Layer | Path | 역할 |
|-------|------|------|
| Rootage | `packages/rootage/components/{id}.yaml` | 기술적 컴포넌트 명세 |
| Design Docs | `docs/content/docs/components/{id}.mdx` | 디자인 가이드라인 |
| React Docs | `docs/content/react/components/{id}.mdx` | React API 문서 |

## 검증 항목

### 1. Naming Consistency
```text
rootage.metadata.name === designDocs.title === reactDocs.title
```

### 2. Description Consistency
```text
designDocs.description === reactDocs.description
```

### 3. Props Coverage
```text
extractedPropsFromYAML ⊆ documentedPropsInDesignDocs
```

### 4. Component ID Match
```text
<PlatformStatusTable componentId="X" /> where X === rootage.metadata.id
<ComponentSpecBlock id="X" /> where X === rootage.metadata.id
```

### 5. File Existence
```text
if (rootageYAML.exists()) {
  designDocs.shouldExist()
  reactDocs.shouldExist()
}
```

## Quick Reference

### Full Audit
```bash
# 모든 Rootage YAML 검색
ls packages/rootage/components/*.yaml

# 각 컴포넌트에 대해 문서 존재 확인
# 내용 비교 및 불일치 보고
```

### Single Component Check
```bash
# 특정 컴포넌트만 검증
# packages/rootage/components/{id}.yaml
# docs/content/docs/components/{id}.mdx
# docs/content/react/components/{id}.mdx
```

## Output Format

### Compact
```text
✅ action-button - Fully consistent
⚠️  checkbox - Warning: Description differs
❌ badge - Critical: Missing Props table
📋 divider - Missing: Design guidelines not found
```

### Detailed
```text
## action-button
Status: ✅ Fully consistent

Checks:
- ✅ Name consistency (Action Button)
- ✅ Description matches
- ✅ Props documented (6/6)
- ✅ Component IDs correct
- ✅ All files exist
```

## 상세 가이드

각 검증 규칙의 상세 내용은 `references/` 폴더 참조:
- `references/validation-rules.md` - 검증 규칙 상세
- `references/workflow.md` - 검증 워크플로우

## 사용 시나리오

| 요청 | 실행 |
|------|------|
| "Run docs consistency checker" | 전체 감사 |
| "Check docs for action-button" | 단일 컴포넌트 검증 |
| "Find missing documentation" | 파일 존재 확인만 |
| "Validate props match YAML" | Props 검증만 |
