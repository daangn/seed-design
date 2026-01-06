---
name: docs-consistency-checker
description: Validate consistency across SEED Design component documentation layers (design guidelines in ./docs/content/docs/components, Rootage specs in ./packages/rootage/components, and React docs in ./docs/content/react/components). Use when auditing documentation completeness, before releases, or validating new component docs.
allowed-tools: Read, Grep, Glob
---

# Documentation Consistency Checker

Validates consistency across three documentation layers in SEED Design System.

## Purpose

이 스킬은 SEED Design System의 문서 레이어 간 일관성을 검증합니다. 디자인 가이드라인, Rootage 컴포넌트 스펙, React 구현 문서가 서로 일치하는지 확인하고, 불일치하거나 누락된 부분을 찾아냅니다.

## When to Use

다음 상황에서 이 스킬을 사용하세요:

1. **릴리스 전 감사**: 메이저 릴리스 전 모든 컴포넌트 문서 완전성 검증
2. **새 컴포넌트 검토**: 새 컴포넌트 문서 발행 전 일관성 확인
3. **문서 정리**: 고아 파일(orphaned files) 및 오래된 문서 식별
4. **Props 검증**: 컴포넌트 Props가 Rootage 스펙과 일치하는지 확인
5. **정기 감사**: 월간/분기별 문서 품질 점검

**트리거 키워드**: "docs consistency", "documentation audit", "validate docs", "check documentation", "pre-release validation"

## Documentation Layers

### Layer 1: Design Guidelines
- **Path**: `./docs/content/docs/components/{component-id}.mdx`
- **Purpose**: 디자인 명세 및 사용 가이드라인
- **Key Sections**: Props, Anatomy, Guidelines, Spec

### Layer 2: Rootage Component Spec
- **Path**: `./packages/rootage/components/{component-id}.yaml`
- **Purpose**: 기술적 컴포넌트 명세
- **Key Data**: metadata.id, metadata.name, schema.slots, definitions

### Layer 3: React Implementation Docs
- **Path**: `./docs/content/react/components/{component-id}.mdx`
- **Purpose**: React API 문서 및 예시
- **Key Sections**: Installation, Props, Examples

## Consistency Requirements

### 1. Component Naming Consistency

**검증 항목**:
- Design guidelines `title` ≡ Rootage `metadata.name`
- React docs `title` ≡ Design guidelines `title`
- 모든 문서가 동일한 대소문자와 형식 사용

**예시**:
```yaml
# Rootage YAML
metadata:
  id: action-button
  name: Action Button

# Design Guidelines MDX
---
title: Action Button  # Must match
---

# React Docs MDX
---
title: Action Button  # Must match
---
```

**검증 로직**:
```typescript
rootage.metadata.name === designDocs.title === reactDocs.title
```

### 2. Description Consistency

**검증 항목**:
- React docs description ≡ Design guidelines description
- 양쪽 모두 동일한 사용자 설명 제공

**예시**:
```yaml
# Design Guidelines
description: 사용자가 특정 액션을 실행할 수 있도록 도와주는 컴포넌트입니다.

# React Docs - MUST match exactly
description: 사용자가 특정 액션을 실행할 수 있도록 도와주는 컴포넌트입니다.
```

**검증 로직**:
```typescript
designDocs.description === reactDocs.description
```

### 3. Props/Variants Consistency

**검증 항목**:
- Design guidelines Props 테이블이 Rootage YAML definitions를 반영
- Variants, sizes, states가 YAML에서 추출한 것과 일치

**검증 워크플로우**:
1. Rootage YAML definitions 읽기
2. Variants (`variant=*`), sizes (`size=*`), states (`base.*`) 추출
3. Design guidelines Props 테이블과 비교
4. 불일치 또는 누락된 문서화 플래그

**예시**:
```yaml
# Rootage defines
definitions:
  variant=brandSolid: {...}
  variant=neutralSolid: {...}
  size=medium: {...}
  size=large: {...}

# Design guidelines MUST document
| 속성    | 값                              |
| variant | brand solid, neutral solid      |  # Must match YAML
| size    | medium, large                   |  # Must match YAML
```

**검증 로직**:
```typescript
extractedPropsFromYAML ⊆ documentedPropsінDesignDocs
// Documented props should cover all YAML-defined props
```

### 4. Component ID Consistency

**검증 항목**:
- `<PlatformStatusTable componentId="X" />` ≡ Rootage `metadata.id`
- `<ComponentSpecBlock id="X" />` ≡ Rootage `metadata.id`

**예시**:
```markdown
# Design Guidelines
<PlatformStatusTable componentId="action-button" />  # Must match metadata.id
<ComponentSpecBlock id="action-button" />             # Must match metadata.id
```

**검증 로직**:
```typescript
<PlatformStatusTable componentId="X" /> where X === rootage.metadata.id
<ComponentSpecBlock id="X" /> where X === rootage.metadata.id
```

### 5. Slot/Part Documentation

**검증 항목**:
- Design guidelines에서 Rootage schema의 주요 slots 언급
- Anatomy 섹션이 주요 아키텍처 parts 커버

**예시**:
```yaml
# Rootage defines
schema:
  slots:
    root: {...}
    label: {...}
    icon: {...}
    prefixIcon: {...}
    suffixIcon: {...}

# Design guidelines should explain:
- Icon usage (prefixIcon, suffixIcon, icon-only layout)
- Label positioning
- Root container behavior
```

**검증 기준**:
- 모든 주요 slots가 문서에 언급되는지 확인
- Anatomy 또는 Props 섹션에서 설명 확인

### 6. File Existence Check

**검증 항목**:
- Rootage YAML 존재 → Design guidelines 존재해야 함
- Design guidelines 존재 → React docs 존재해야 함
- 고아 파일 플래그

**Coverage Matrix**:
```
Component ID | Rootage YAML | Design Docs | React Docs | Status
-------------|--------------|-------------|-----------|-------
action-button|      ✓       |      ✓      |     ✓     | Complete
checkbox     |      ✓       |      ✓      |     ✓     | Complete
new-comp     |      ✓       |      ✗      |     ✗     | Missing docs
```

## Workflow

### Step 1: Discovery

컴포넌트 인벤토리 구축:

```bash
1. Glob all Rootage YAML files: packages/rootage/components/*.yaml
2. Extract component IDs from metadata.id
3. Build component inventory
```

**도구 사용**:
```typescript
// Glob to find all YAML files
const yamlFiles = await glob('packages/rootage/components/*.yaml')

// Read each file and extract metadata.id
for (const file of yamlFiles) {
  const content = await read(file)
  const yaml = parseYAML(content)
  const componentId = yaml.metadata.id
  inventory.push(componentId)
}
```

### Step 2: Cross-Reference Check

각 컴포넌트 ID에 대해 파일 존재 확인:

```bash
For each component ID:
  1. Check existence:
     - docs/content/docs/components/{id}.mdx
     - docs/content/react/components/{id}.mdx
  2. Flag missing files
```

**도구 사용**:
```typescript
for (const id of inventory) {
  const designDocsPath = `docs/content/docs/components/${id}.mdx`
  const reactDocsPath = `docs/content/react/components/${id}.mdx`

  const designExists = await fileExists(designDocsPath)
  const reactExists = await fileExists(reactDocsPath)

  if (!designExists) issues.push({ id, type: 'missing_design_docs' })
  if (!reactExists) issues.push({ id, type: 'missing_react_docs' })
}
```

### Step 3: Content Validation

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

**도구 사용**:
```typescript
// Read files
const yamlContent = await read(yamlPath)
const designContent = await read(designPath)
const reactContent = await read(reactPath)

// Parse frontmatter
const designFrontmatter = parseFrontmatter(designContent)
const reactFrontmatter = parseFrontmatter(reactContent)

// Compare names
if (yaml.metadata.name !== designFrontmatter.title) {
  issues.push({
    id,
    type: 'name_mismatch',
    expected: yaml.metadata.name,
    actual: designFrontmatter.title
  })
}

// Compare descriptions
if (designFrontmatter.description !== reactFrontmatter.description) {
  issues.push({
    id,
    type: 'description_mismatch',
    design: designFrontmatter.description,
    react: reactFrontmatter.description
  })
}
```

### Step 4: Props Deep Validation

Props 상세 검증:

```bash
For each component:
  1. Parse Rootage YAML definitions
  2. Extract:
     - Variants: keys matching "variant="
     - Sizes: keys matching "size="
     - States: base.* keys
  3. Read design guidelines Props table
  4. Compare extracted vs documented
  5. Flag missing or extra props
```

**도구 사용**:
```typescript
// Extract props from YAML
const definitions = yaml.data.definitions
const variants = Object.keys(definitions)
  .filter(key => key.startsWith('variant='))
  .map(key => key.replace('variant=', ''))

const sizes = Object.keys(definitions)
  .filter(key => key.startsWith('size='))
  .map(key => key.replace('size=', ''))

const states = Object.keys(definitions.base || {})

// Extract props from design docs (using Grep)
const propsTableMatch = await grep({
  pattern: '\\| variant\\s+\\|.*\\|',
  path: designPath,
  output_mode: 'content'
})

// Parse table and compare
const documentedVariants = parsePropsTable(propsTableMatch)

const missingVariants = variants.filter(v => !documentedVariants.includes(v))
if (missingVariants.length > 0) {
  issues.push({
    id,
    type: 'missing_variants',
    missing: missingVariants
  })
}
```

### Step 5: Component ID Validation

Design guidelines에서 컴포넌트 ID 참조 확인:

```typescript
// Check PlatformStatusTable componentId
const platformStatusMatch = await grep({
  pattern: '<PlatformStatusTable componentId="([^"]+)"',
  path: designPath,
  output_mode: 'content'
})

const extractedId = extractComponentId(platformStatusMatch)
if (extractedId !== yaml.metadata.id) {
  issues.push({
    id,
    type: 'platform_status_id_mismatch',
    expected: yaml.metadata.id,
    actual: extractedId
  })
}

// Check ComponentSpecBlock id
const specBlockMatch = await grep({
  pattern: '<ComponentSpecBlock id="([^"]+)"',
  path: designPath,
  output_mode: 'content'
})

const specId = extractComponentId(specBlockMatch)
if (specId !== yaml.metadata.id) {
  issues.push({
    id,
    type: 'spec_block_id_mismatch',
    expected: yaml.metadata.id,
    actual: specId
  })
}
```

### Step 6: Report Generation

검증 결과를 사용자 친화적 리포트로 생성:

```markdown
# Consistency Report

## Summary
- Total components: 28
- Fully consistent: 22
- Issues found: 6

## Issues

### Critical (Must Fix)
1. **badge**: Design docs missing Props table
2. **chip**: Description mismatch between design/react docs

### Warnings (Review)
1. **avatar**: Rootage defines size=xlarge but design docs don't document it
2. **callout**: ComponentSpecBlock id="callouts" (should be "callout")

### Missing Documentation
1. **divider**: Has YAML, missing design guidelines
2. **dialog**: Has YAML, missing React docs

## Recommendations
{Actionable fixes with file paths and specific changes}
```

## Usage Scenarios

### Scenario 1: Full Audit

**사용자 요청**:
```
"Run docs consistency checker on all components"
```

**실행 과정**:
1. 모든 Rootage YAML 파일 검색
2. 각 컴포넌트에 대해 6가지 검증 항목 실행
3. Comprehensive 리포트 생성

### Scenario 2: Single Component

**사용자 요청**:
```
"Check docs consistency for action-button"
```

**실행 과정**:
1. action-button에 대해서만 검증
2. Detailed 모드로 결과 출력

### Scenario 3: Focus on Missing Docs

**사용자 요청**:
```
"Find components with missing documentation"
```

**실행 과정**:
1. 파일 존재 확인만 실행 (Step 2)
2. 누락된 문서 목록 출력

### Scenario 4: Props Validation

**사용자 요청**:
```
"Validate that all component props match Rootage specs"
```

**실행 과정**:
1. Props 검증만 실행 (Step 4)
2. 불일치하는 props 목록 출력

## Output Formats

### Compact Mode (default)

간단한 상태 요약:

```markdown
✅ action-button - Fully consistent
⚠️  checkbox - Warning: Description differs slightly
❌ badge - Critical: Missing Props table
📋 divider - Missing: Design guidelines not found
```

**상태 아이콘**:
- ✅ Fully consistent: 모든 검증 통과
- ⚠️ Warning: 경미한 불일치, 검토 필요
- ❌ Critical: 중요한 문제, 즉시 수정 필요
- 📋 Missing: 파일 누락

### Detailed Mode (--verbose)

상세한 검증 결과:

```markdown
## action-button
Status: ✅ Fully consistent

Checks performed:
- ✅ Name consistency (Action Button)
- ✅ Description matches
- ✅ Props table matches YAML (6/6 props documented)
- ✅ Component IDs correct
- ✅ All files exist

## checkbox
Status: ⚠️  Warning

Checks performed:
- ✅ Name consistency (Checkbox)
- ⚠️  Description differs:
  - Design: "사용자가 하나 이상의 옵션을 선택할 수 있게 해주는..."
  - React:  "사용자가 하나 이상의 옵션을 선택할 수 있게 해주는..."
  - Diff: Extra text in react docs
- ✅ Props table matches YAML
- ✅ Component IDs correct
- ✅ All files exist

Recommendation: Align descriptions in both files
```

### Summary Report

전체 프로젝트 상태:

```markdown
# SEED Design Documentation Consistency Report
Generated: 2025-01-21

## Overall Status
- Total Components: 58
- Fully Consistent: 48 (82.8%)
- With Warnings: 6 (10.3%)
- Critical Issues: 2 (3.4%)
- Missing Docs: 2 (3.4%)

## Critical Issues (Must Fix Immediately)

### 1. badge
**Issue**: Design docs missing Props table
**Impact**: Users cannot understand component options
**Fix**: Add Props table to `/docs/content/docs/components/badge.mdx`

### 2. chip
**Issue**: Description mismatch
**Details**:
- Design: "정보를 표현하고 선택을 나타내는 컴포넌트입니다."
- React: "사용자 입력을 나타내는 컴포넌트입니다."
**Fix**: Align descriptions in both files

## Warnings (Review Soon)

### 1. avatar
**Issue**: Missing variant documentation
**Details**: Rootage defines `size=xlarge` but design docs only show small, medium, large
**Fix**: Add xlarge size to Props table

### 2. callout
**Issue**: ComponentSpecBlock ID typo
**Details**: Uses `id="callouts"` but should be `id="callout"`
**Fix**: Change ComponentSpecBlock id in design docs

## Missing Documentation

### 1. divider
**Missing**: Design guidelines
**Path**: `/docs/content/docs/components/divider.mdx`
**Status**: Rootage YAML exists, React docs exist

### 2. dialog
**Missing**: React documentation
**Path**: `/docs/content/react/components/dialog.mdx`
**Status**: Rootage YAML exists, design docs exist

## Recommendations

1. **Immediate Actions** (Critical):
   - Fix badge Props table
   - Align chip descriptions

2. **This Week** (Warnings):
   - Document avatar xlarge size
   - Fix callout ComponentSpecBlock ID

3. **This Sprint** (Missing Docs):
   - Create divider design guidelines
   - Write dialog React documentation

## Next Steps

1. Assign issues to owners
2. Create tracking tasks
3. Re-run validation after fixes
4. Schedule regular monthly audits
```

## Validation Rules

### Rule 1: Exact Name Match
```typescript
rootage.metadata.name === designDocs.title === reactDocs.title
```

### Rule 2: Exact Description Match
```typescript
designDocs.description === reactDocs.description
```

### Rule 3: Props Coverage
```typescript
extractedPropsFromYAML ⊆ documentedPropsInDesignDocs
// Documented props should cover all YAML-defined props
```

### Rule 4: Component ID Match
```typescript
<PlatformStatusTable componentId="X" /> where X === rootage.metadata.id
<ComponentSpecBlock id="X" /> where X === rootage.metadata.id
```

### Rule 5: File Completeness
```typescript
if (rootageYAML.exists()) {
  designDocs.shouldExist() // Warning if missing
  reactDocs.shouldExist()  // Info if missing (may be WIP)
}
```

## Implementation Guidelines

### Tool Usage

**Read**:
- YAML 파일 파싱
- MDX frontmatter 추출
- 파일 존재 확인

**Grep**:
- Props 테이블 추출
- Component ID 참조 찾기
- 특정 패턴 검색

**Glob**:
- 모든 컴포넌트 YAML 파일 찾기
- 문서 파일 목록 생성

### Error Handling

```typescript
try {
  const content = await read(filePath)
} catch (error) {
  if (error.code === 'ENOENT') {
    issues.push({ type: 'file_not_found', path: filePath })
  } else {
    throw error
  }
}
```

### Performance

- **병렬 처리**: 독립적인 컴포넌트 검증은 병렬로 실행
- **캐싱**: 동일 파일을 여러 번 읽지 않도록 캐싱
- **조기 종료**: Critical 문제 발견 시 즉시 보고 (선택적)

## Extensibility

### Future Enhancements

1. **이미지 경로 검증**:
   - Design guidelines에서 참조하는 이미지 파일 존재 확인
   - 이미지 파일이 WebP 포맷인지 검증

2. **예시 코드 검증**:
   - React 예시가 올바른 props 참조하는지 확인
   - 예시 코드가 실제로 실행 가능한지 검증

3. **접근성 검사**:
   - Design docs에서 a11y 기능 언급 확인
   - ARIA attributes 문서화 검증

4. **로컬라이제이션 검증**:
   - 한국어 설명 일관성 확인
   - 번역 품질 검사

## Checklist

검증 실행 전 확인 사항:

- [ ] 모든 Rootage YAML 파일이 최신 상태인가?
- [ ] Git 워킹 디렉토리가 깨끗한가? (커밋되지 않은 변경사항 없음)
- [ ] 검증 범위가 명확한가? (전체 vs 특정 컴포넌트)
- [ ] 출력 형식이 결정되었는가? (Compact vs Detailed)

검증 실행 후 확인 사항:

- [ ] Critical 이슈가 모두 문서화되었는가?
- [ ] 각 이슈에 수정 방법이 명시되었는가?
- [ ] 이슈가 tracking 시스템에 등록되었는가?
- [ ] 담당자가 할당되었는가?
- [ ] 다음 검증 일정이 계획되었는가?

## Reference

**유사 도구**:
- ESLint (코드 일관성 검사)
- Vale (문서 스타일 검사)
- markdownlint (Markdown 규칙 검사)

**SEED Design 문서 레이어**:
- Design Guidelines: 디자인 원칙과 사용 가이드
- Rootage Spec: 기술적 명세와 스타일 정의
- React Docs: 구현 API와 사용 예시

## Tips

1. **정기 실행**:
   - 릴리스 전 필수 실행
   - 월간 정기 감사 일정 수립
   - CI/CD 파이프라인에 통합 고려

2. **점진적 개선**:
   - Critical 이슈 먼저 해결
   - Warning은 스프린트 계획에 포함
   - Missing docs는 백로그에 추가

3. **자동화**:
   - GitHub Actions로 PR 시 자동 검증
   - Slack/Discord로 이슈 알림
   - Dashboard로 시각화

4. **문서 품질**:
   - 검증 통과가 목표가 아님
   - 사용자 관점의 명확성이 우선
   - 일관성은 수단, 품질은 목적

5. **팀 협업**:
   - 검증 결과를 팀과 공유
   - 문제 패턴 분석 및 개선
   - 문서 작성 가이드 업데이트
