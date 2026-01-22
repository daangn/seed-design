# packages/react-headless

## 디렉토리 개요

**Headless UI 컴포넌트**를 제공하는 패키지. 스타일 없이 순수한 로직(상태 관리, 접근성, 이벤트 처리)만 담당한다. `packages/react`에서 이 패키지의 컴포넌트에 스타일을 적용한다.

## 파일 작성 컨벤션

- `{component-name}/src/`: 컴포넌트별 디렉토리 (kebab-case)
- `use{Component}.ts`: 커스텀 훅
- `{Component}.tsx`: Primitive 컴포넌트
- `{Component}.namespace.ts`: Multi-part 컴포넌트용 barrel

## 코드 작성 컨벤션

- **스타일 로직 금지**: CSS나 스타일 관련 코드 없어야 함
- `data-*` 속성으로 상태 표현 (data-checked, data-disabled 등)
- `useControllableState`로 controlled/uncontrolled 지원
- `forwardRef` 필수

## Headless 컴포넌트 예시

✅ Good:
```typescript
// useCheckbox.ts - 상태 로직만, 스타일 없음
export function useCheckbox(props: UseCheckboxProps) {
  const [checked, setChecked] = useState(props.defaultChecked ?? false);

  return {
    rootProps: {
      "data-checked": checked,       // ✅ data-* 속성으로 상태 표현
      "data-disabled": props.disabled,
      onClick: () => setChecked(!checked),
    },
  };
}
```

❌ Bad:
```typescript
// 스타일 로직 포함 (Headless에서 금지)
export function useCheckbox(props) {
  return {
    rootProps: {
      className: checked ? "checked" : "",  // ❌ className 금지
      style: { color: checked ? "blue" : "gray" },  // ❌ style 금지
    },
  };
}
```
