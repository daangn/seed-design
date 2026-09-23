---
description: $COMPONENT_ID $COMPONENT_NAME $HAS_SNIPPET
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# React 컴포넌트 문서 작성

`seed-component` Skill의 짧은 경로 분기(`references/implementation-workflow.md`「React 문서·예제만 변경」)로 컴포넌트 문서를 만들거나 갱신한다. 작업 중 API·동작 변경이 필요해지면「기존 구현 변경」분기로 넘어간다.

## 인자

- $COMPONENT_ID: 대상 컴포넌트 id
- $COMPONENT_NAME: 표시 이름
- $HAS_SNIPPET: 선택. `true|false`. 생략하면 `docs/registry/react/registry-ui.ts` 등록 여부로 판단한다.

## 필수 결과

1. `docs/content/react/components/{component-id}.mdx`를 만들거나 갱신한다.
2. Usage와 Examples 섹션이 `docs/examples/react/{component-id}/`의 실제 예제 파일을 정확히 참조한다.
3. snippet 존재 여부를 Installation과 Usage 안내에 반영한다.
