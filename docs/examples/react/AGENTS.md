# docs/examples/react

React 문서 페이지에 들어가는 사용 예시다. MDX의 `<ComponentExample name="react/<component>/<scenario>">`가 `components/component-preview.tsx`에서 이 폴더의 파일을 lazy import한다.

## 작업 절차

### 예시를 추가할 때

1. 목적을 하나로 정한다: recommended composition인가, arbitrary content 가능성 시연인가.
2. `<component>/<scenario>.tsx`(둘 다 kebab-case)에 예시 컴포넌트 하나를 default export한다. 한 파일은 핵심 메시지 하나만 보여준다 → 메시지가 다르면 파일을 나눈다.
3. MDX의 `<ComponentExample name="react/<component>/<scenario>">` 안에 ```` ```json doc-gen:file ```` 블록(`"file": "examples/react/<component>/<scenario>.tsx"`)을 넣는다.

## 규칙

- recommended composition 예시 → snippet이 있으면 `seed-design/ui/<name>`, 없으면 `@seed-design/react`의 SEED primitive와 system component를 쓴다.
- arbitrary content 시연 예시 → raw HTML이나 간단한 inline 구조도 쓴다.
- 시각적 정합성이 중요한 예시 → 관련 Figma·prototype·guideline을 먼저 확인하고 이름·구성과 icon style, spacing, tone을 맞춘다.
