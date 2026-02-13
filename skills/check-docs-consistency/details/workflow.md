# 검증 워크플로우

## Step 1: Discovery

컴포넌트 인벤토리 구축:

```bash
# Glob all Rootage YAML files
packages/rootage/components/*.yaml

# Extract component IDs from metadata.id
# Build component inventory
```

## Step 2: Cross-Reference Check

각 컴포넌트 ID에 대해 파일 존재 확인:

```bash
For each component ID:
  1. Check existence:
     - docs/content/docs/components/{id}.mdx
     - docs/content/react/components/{id}.mdx
  2. Flag missing files
```

## Step 3: Content Validation

완전한 세트(YAML + Design + React)에 대해 내용 검증:

```bash
For each complete set:
  1. Read all three files
  2. Extract metadata:
     - Names (title, metadata.name)
     - Descriptions
     - Props/variants/sizes
     - Component references (componentId, id)
  3. Compare values
  4. Report inconsistencies
```

## Step 4: Props Deep Validation

Props 상세 검증:

```typescript
// Extract props from YAML
const definitions = yaml.data.definitions
const variants = Object.keys(definitions)
  .filter(key => key.startsWith('variant='))
  .map(key => key.replace('variant=', ''))

const sizes = Object.keys(definitions)
  .filter(key => key.startsWith('size='))
  .map(key => key.replace('size=', ''))

// Compare with design docs Props table
// Flag missing or extra props
```

## Step 5: Report Generation

```markdown
# Consistency Report

## Summary
- Total components: 28
- Fully consistent: 22
- Issues found: 6

## Issues

### Critical (Must Fix)
1. **badge**: Design docs missing Props table
2. **chip**: Description mismatch

### Warnings (Review)
1. **avatar**: Missing size=xlarge documentation
2. **callout**: ComponentSpecBlock id typo

### Missing Documentation
1. **divider**: Has YAML, missing design guidelines
2. **dialog**: Has YAML, missing React docs
```

## 사용 시나리오

### Full Audit
```text
"Run docs consistency checker on all components"
→ 모든 컴포넌트에 대해 검증 실행
```

### Single Component
```text
"Check docs consistency for action-button"
→ action-button에 대해서만 상세 검증
```

### Missing Docs Only
```text
"Find components with missing documentation"
→ 파일 존재 확인만 실행
```
