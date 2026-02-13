# 문서 검증 규칙

## 1. Component Naming Consistency

**검증**: Design guidelines title ≡ Rootage metadata.name ≡ React docs title

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

## 2. Description Consistency

**검증**: React docs description ≡ Design guidelines description

```yaml
# Design Guidelines
description: 사용자가 특정 액션을 실행할 수 있도록 도와주는 컴포넌트입니다.

# React Docs - MUST match exactly
description: 사용자가 특정 액션을 실행할 수 있도록 도와주는 컴포넌트입니다.
```

## 3. Props/Variants Consistency

**검증**: Design guidelines Props 테이블이 Rootage YAML definitions를 반영

```yaml
# Rootage defines
definitions:
  variant=brandSolid: {...}
  variant=neutralSolid: {...}
  size=medium: {...}
  size=large: {...}

# Design guidelines MUST document
| 속성    | 값                              |
| variant | brand solid, neutral solid      |
| size    | medium, large                   |
```

## 4. Component ID Consistency

**검증**: MDX 컴포넌트의 ID가 Rootage metadata.id와 일치

```markdown
<PlatformStatusTable componentId="action-button" />  # Must match metadata.id
<ComponentSpecBlock id="action-button" />             # Must match metadata.id
```

## 5. File Existence Check

**검증**: Rootage YAML 존재 시 관련 문서도 존재해야 함

```text
Component ID | Rootage YAML | Design Docs | React Docs | Status
-------------|--------------|-------------|-----------|-------
action-button|      ✓       |      ✓      |     ✓     | Complete
checkbox     |      ✓       |      ✓      |     ✓     | Complete
new-comp     |      ✓       |      ✗      |     ✗     | Missing docs
```

## 경로 패턴

| Layer | Path Pattern |
|-------|--------------|
| Rootage | `packages/rootage/components/{id}.yaml` |
| Design Docs | `docs/content/docs/components/{id}.mdx` |
| React Docs | `docs/content/react/components/{id}.mdx` |
