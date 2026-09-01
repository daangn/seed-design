---
description: $COMPONENT_ID $COMPONENT_NAME $HAS_SNIPPET
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# React 컴포넌트 문서 작성

`seed-create-component` 스킬의 React `docs-only` 경로로 컴포넌트 문서를 만들거나 갱신합니다.

## 인자

- $COMPONENT_ID: 대상 컴포넌트 id
- $COMPONENT_NAME: 표시 이름
- $HAS_SNIPPET: 선택 사항. `true|false`

## 필수 결과

1. `docs/content/react/components/{component-id}.mdx`를 만들거나 갱신합니다.
2. Usage와 Examples 섹션이 실제 예제 파일을 정확히 참조합니다.
3. Snippet 존재 여부를 Installation과 Usage 안내에 반영합니다.
