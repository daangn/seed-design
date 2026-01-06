---
name: component-guidelines-docs
description: Generate comprehensive component guideline documentation for SEED Design System. Use when creating or updating design guideline documentation in ./docs/content/docs/components directory. This skill helps create high-quality documentation similar to action-button.mdx.
allowed-tools: Read, Write, Glob, Grep, Bash
---

# Component Guidelines Documentation Generator

이 스킬은 SEED Design System의 컴포넌트 가이드라인 문서를 생성합니다. Action Button과 같은 고품질 디자인 가이드라인 문서를 작성할 수 있도록 돕습니다.

## 목적

- 일관된 구조의 컴포넌트 가이드라인 문서 생성
- Rootage YAML 스펙과 연동된 Props 정보 자동 추출
- 한국어 기반의 상세한 디자인 원칙과 사용 가이드 작성
- 표준화된 이미지 경로와 컴포넌트 참조 생성

## 사용 시나리오

1. 새로운 컴포넌트의 가이드라인 문서를 처음 작성할 때
2. 기존 컴포넌트의 가이드라인을 업데이트할 때
3. V2에서 V3로 마이그레이션 가이드를 추가할 때

## 작업 흐름

### 1. 사용자 입력 받기

사용자에게 다음 정보를 요청합니다:

**필수 정보**:
- **Component ID**: 예) `action-button`, `checkbox`, `badge`
  - 이 ID는 Rootage YAML 파일명과 동일해야 합니다
  - `/packages/rootage/components/{component-id}.yaml` 파일이 존재해야 합니다

**선택 정보**:
- **Documentation Type**: `simple` 또는 `comprehensive`
  - `simple`: 기본적인 Props와 Spec만 포함 (예: checkbox, badge)
  - `comprehensive`: Anatomy, Guidelines, Comparison 등 전체 섹션 포함 (예: action-button)

- **Custom Sections** (comprehensive인 경우):
  - Anatomy: 컴포넌트 구조도 포함 여부
  - Guidelines Topics: 작성할 가이드라인 주제 목록
    - 예) Hierarchy, Variant Usage, Brand Color Usage, Multiple Buttons, Long Label, With Icon
  - Comparison: 비교할 다른 컴포넌트 (예: "Action Button vs Chip")
  - V2 Differences: V2와의 차이점 설명 포함 여부

### 2. Rootage YAML 파일 읽기

`/packages/rootage/components/{component-id}.yaml` 파일을 읽어서 다음 정보를 추출합니다:

**YAML 구조 이해**:
```yaml
kind: ComponentSpec
metadata:
  id: action-button
  name: Action Button
data:
  schema:
    slots:                    # 컴포넌트의 구성 요소
      root:
        properties:
          backgroundColor: { type: color }
          borderRadius: { type: dimension }
      label:
        properties:
          color: { type: color }
          fontSize: { type: dimension }
  definitions:
    base:                     # 기본 상태별 스타일
      enabled: { ... }
      pressed: { ... }
      disabled: { ... }
    variant=brandSolid:       # variant별 스타일
      enabled: { ... }
    size=medium:              # size별 스타일
      enabled: { ... }
    variant=brandSolid, size=medium:  # 복합 조건
      enabled: { ... }
```

**추출할 정보**:
1. **Component Name**: `metadata.name` (예: "Action Button")
2. **Component ID**: `metadata.id` (예: "action-button")
3. **Available Props**:
   - Variants: `definitions`에서 `variant=` 로 시작하는 키 추출
   - Sizes: `definitions`에서 `size=` 로 시작하는 키 추출
   - States: `definitions.base`의 키들 (enabled, pressed, disabled, loading 등)
   - Layout: 컨텍스트나 관례를 통해 파악 (예: with text, icon only)
4. **Slots**: `schema.slots`의 키들 (root, label, icon, prefixIcon, suffixIcon 등)

### 3. Props 테이블 생성

YAML에서 추출한 정보로 Props 테이블을 생성합니다:

```markdown
## Props

| 속성        | 값                                                                                     | 기본값    |
| ----------- | -------------------------------------------------------------------------------------- | --------- |
| size        | {extracted sizes}                                                           | {default} |
| variant     | {extracted variants} |           |
| layout      | {inferred or provided}                                                                   | {default} |
| disabled    | true, false                                                                            | false     |
| loading     | true, false                                                                            | false     |
| prefix icon | icon                                                                                   |           |
| suffix icon | icon                                                                                   |           |
```

**참고 예시 (Action Button)**:
```markdown
| 속성        | 값                                                                                     | 기본값    |
| ----------- | -------------------------------------------------------------------------------------- | --------- |
| size        | xsmall, small, medium, large                                                           | medium    |
| variant     | brand solid, neutral solid, neutral weak, critical solid, brand outline, neutral outline |           |
| layout      | with text, icon only                                                                   | with text |
| disabled    | true, false                                                                            | false     |
| loading     | true, false                                                                            | false     |
| prefix icon | icon                                                                                   |           |
| suffix icon | icon                                                                                   |           |
```

### 4. 문서 구조 생성

#### Simple 타입 문서 구조:

```markdown
---
title: {Component Name}
description: {한국어 설명 - 컴포넌트의 역할과 목적을 1-2문장으로}
---

<PlatformStatusTable componentId="{component-id}" />

## 개요

{컴포넌트에 대한 간단한 소개}

### 옵션 테이블

{Props 테이블}

## 스펙

<ComponentSpecBlock id="{component-id}" />
```

#### Comprehensive 타입 문서 구조:

```markdown
---
title: {Component Name}
description: {한국어 설명 - 컴포넌트의 역할과 목적을 1-2문장으로}
---

<PlatformStatusTable componentId="{component-id}" />

## Anatomy

![Anatomy Image](/docs/components/{component-id}/anatomy.webp)

{컴포넌트의 구조와 구성 요소 설명}

## Props

{Props 테이블}

### Size

![Size](/docs/components/{component-id}/props-size.webp)

- {Size에 대한 상세 설명}
- {각 사이즈의 용도와 사용 시나리오}

### Variant

![Variant](/docs/components/{component-id}/props-variant.webp)

- {Variant에 대한 상세 설명}
- {각 variant의 특징과 사용 맥락}

### Layout

![Layout](/docs/components/{component-id}/props-layout.webp)

- {Layout 옵션에 대한 설명}
- {각 레이아웃의 활용 방법}

### State

![State](/docs/components/{component-id}/props-state.webp)

- {상태별 동작 설명}

### Width

![Width](/docs/components/{component-id}/props-width.webp)

- {너비 설정 옵션 설명}

## Guidelines

### {Guideline Topic 1}

![Guideline Image](/docs/components/{component-id}/guidelines-{topic}-1.webp)

{가이드라인 내용 - 표, 리스트, 이미지 등을 활용}

#### {Sub-topic}

![Sub-guideline](/docs/components/{component-id}/guidelines-{topic}-{subtopic}-1.webp)

{세부 가이드라인}

<Grid>
  <DoImage src="/docs/components/{component-id}/guidelines-{topic}-do-usage-1.webp" alt="{올바른 사용 설명}" />
  <DontImage src="/docs/components/{component-id}/guidelines-{topic}-dont-usage-1.webp" alt="{잘못된 사용 설명}" />
</Grid>

### {Guideline Topic 2}

{반복...}

## Comparison (선택)

### {Component A} vs {Component B}

![Comparison](/docs/components/{component-id}/comparison-{component-a}-vs-{component-b}-1.webp)

{두 컴포넌트의 차이점과 사용 시나리오}

|    | {Component A}                        | {Component B}             |
| ---------- | -----------------------------  | ----------------------------- |
| 목적       |   {purpose A}   |  {purpose B}       |
| 예시       |  {examples A}    |    {examples B}     |
| 표현       | {expression A}     |    {expression B}     |

## Differences from V2 (선택)

![Differences from V2](/docs/components/{component-id}/differences-with-v2-1.webp)

- {V2와의 차이점 나열}
- {마이그레이션 가이드}

## Spec

<ComponentSpecBlock id="{component-id}" />
```

### 5. 이미지 경로 규칙

모든 이미지는 다음 경로 패턴을 따릅니다:

```sh
/docs/public/docs/components/{component-id}/{section-name}.webp
```

**이미지 명명 규칙**:
- `anatomy.webp`: 컴포넌트 구조도
- `props-{property}.webp`: Props 설명 이미지
  - 예) `props-size.webp`, `props-variant.webp`, `props-layout.webp`, `props-state.webp`
- `guidelines-{topic}-{number}.webp`: 가이드라인 이미지
  - 예) `guidelines-hierarchy-1.webp`, `guidelines-variant-usage-1.webp`
- `guidelines-{topic}-{do|dont}-usage-{number}.webp`: Do/Don't 예시
  - 예) `guidelines-with-icon-do-usage-1.webp`, `guidelines-with-icon-dont-usage-1.webp`
- `comparison-{component1}-vs-{component2}-{number}.webp`: 비교 이미지
  - 예) `comparison-action-button-vs-chip-1.webp`
- `differences-with-v2-{number}.webp`: V2 차이점 이미지

**이미지 준비 및 변환**:
1. 사용자가 PNG 이미지를 `/docs/public/docs/components/{component-id}/` 폴더에 준비
2. 다음 스크립트를 실행하여 WebP로 변환:
   ```bash
   bun scripts/convert-images-to-webp.ts --path "docs/public/docs/components/{component-id}/**/*.png" --delete-original
   ```
3. 변환된 WebP 이미지를 문서에서 참조

### 6. 한국어 작성 가이드라인

**Tone & Voice**:
- 전문적이고 명확한 어조
- 사용자 중심의 설명 (기술적 세부사항보다는 사용 맥락 중심)
- 존댓말 사용 ("~합니다", "~해주세요")

**Description (Frontmatter)**:
- 컴포넌트의 역할을 명확히 설명
- 1-2문장으로 간결하게
- 예) "사용자가 특정 액션을 실행할 수 있도록 도와주는 컴포넌트입니다."

**Props 설명**:
- 각 prop의 용도와 사용 시나리오 설명
- 사이즈별/variant별 특징과 권장 사용처 명시
- 예) "Small과 Medium은 화면 중앙에서 범용적으로 사용되며, Large는 주로 CTA 역할로 사용됩니다."

**Guidelines 작성**:
- 실무 적용 가능한 구체적인 가이드 제공
- 올바른 사용법과 잘못된 사용법을 명확히 구분
- 디자인 원칙과 근거를 함께 제시
- 예시와 시각 자료를 적극 활용

**테이블 작성**:
- 명확한 헤더와 일관된 형식
- 한국어와 영어를 적절히 혼용 (기술 용어는 영어 유지)

### 7. 컴포넌트 참조

문서에서 사용 가능한 특수 컴포넌트들:

1. **`<PlatformStatusTable componentId="{id}" />`**
   - 플랫폼별 구현 상태 표시
   - 문서 최상단에 배치

2. **`<ComponentSpecBlock id="{id}" />`**
   - 컴포넌트의 기술 스펙 표시
   - 문서 최하단에 배치

3. **`<DoImage src="..." alt="..." />`**
   - 올바른 사용 예시 이미지
   - 반드시 한국어 alt 텍스트 작성

4. **`<DontImage src="..." alt="..." />`**
   - 잘못된 사용 예시 이미지
   - 반드시 한국어 alt 텍스트 작성

5. **`<Grid>`**
   - Do/Don't 이미지를 나란히 배치하는 컨테이너
   - 예시:
     ```tsx
     <Grid>
       <DoImage src="/path/to/do.webp" alt="올바른 사용법" />
       <DontImage src="/path/to/dont.webp" alt="잘못된 사용법" />
     </Grid>
     ```

### 8. 참조 자료

**Action Button 문서** (`/docs/content/docs/components/action-button.mdx`):
- Comprehensive 타입 문서의 모범 사례
- Guidelines 섹션 구조 참조
- 한국어 작성 스타일 참조
- 이미지 활용 패턴 참조

**다른 컴포넌트 문서들**:
- Simple 타입: `/docs/content/docs/components/checkbox.mdx`, `/docs/content/docs/components/badge.mdx`
- Comprehensive 타입: `/docs/content/docs/components/action-button.mdx`

### 9. 체크리스트

문서 생성 후 다음 사항을 확인합니다:

- [ ] Frontmatter의 title과 description이 정확한가?
- [ ] `<PlatformStatusTable>`과 `<ComponentSpecBlock>`의 componentId/id가 올바른가?
- [ ] Props 테이블의 정보가 YAML 파일과 일치하는가?
- [ ] 모든 이미지 경로가 표준 패턴을 따르는가?
- [ ] 한국어 설명이 명확하고 일관된가?
- [ ] Guidelines가 실무에 적용 가능하고 구체적인가?
- [ ] Do/Don't 예시가 `<Grid>` 컴포넌트로 적절히 구성되었는가?
- [ ] 문서의 전체 구조가 일관성 있는가?

## 사용 예시

### 예시 1: Simple 타입 문서 생성

**사용자 입력**:
```text
Component ID: checkbox
Documentation Type: simple
```

**생성 결과**:
```markdown
---
title: Checkbox
description: 사용자가 하나 이상의 옵션을 선택할 수 있도록 하는 컴포넌트입니다.
---

<PlatformStatusTable componentId="checkbox" />

## 개요

Checkbox는 사용자가 여러 옵션 중 하나 이상을 선택할 수 있게 합니다.

### 옵션 테이블

| 속성        | 값                           | 기본값    |
| ----------- | ---------------------------- | --------- |
| size        | small, medium, large         | medium    |
| disabled    | true, false                  | false     |
| checked     | true, false                  | false     |

## 스펙

<ComponentSpecBlock id="checkbox" />
```

### 예시 2: Comprehensive 타입 문서 생성

**사용자 입력**:
```text
Component ID: action-button
Documentation Type: comprehensive
Custom Sections:
  - Anatomy: yes
  - Guidelines Topics: ["Hierarchy", "Variant Usage", "Brand Color Usage", "Multiple Buttons", "Long Label", "With Icon"]
  - Comparison: "Action Button vs Chip"
  - V2 Differences: yes
```

**생성 결과**: `/docs/content/docs/components/action-button.mdx` 파일 참조

## 도구 사용 권한

이 스킬은 다음 도구들을 사용합니다:

- **Read**: Rootage YAML 파일 읽기, 참조 문서 읽기
- **Write**: MDX 파일 생성
- **Glob**: 유사 컴포넌트 문서 검색
- **Grep**: 패턴 분석 및 정보 추출
- **Bash**: 이미지 변환 스크립트 실행 안내

## 추가 참고사항

1. **YAML 파일이 없는 경우**:
   - 사용자에게 YAML 파일 경로 확인 요청
   - 또는 수동으로 props 정보 입력 받기

2. **이미지 준비 안내**:
   - 문서 생성 후 이미지 경로 목록을 사용자에게 제공
   - PNG→WebP 변환 명령어 안내

3. **기존 문서 업데이트**:
   - 기존 문서를 먼저 읽어서 내용 보존
   - 변경이 필요한 부분만 수정

4. **Guideline 작성 도움**:
   - Action Button 문서의 Guidelines 섹션을 참고하여 구조와 스타일 참조
   - 디자인 원칙, 사용 시나리오, 주의사항을 포괄적으로 작성
