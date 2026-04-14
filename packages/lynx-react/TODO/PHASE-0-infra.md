# Phase 0: 인프라 및 공통 유틸

컴포넌트 구현 전에 공통 기반을 먼저 깐다.

## 작업 항목

### 1. @lynx-js/lynx-ui-common dependency 추가

`packages/lynx-react/package.json`에 추가한다.

```bash
bun add @lynx-js/lynx-ui-common
```

사용할 훅 목록:
- `useLatest` - 항상 최신 값을 유지하는 ref
- `useMemoizedFn` - deps 변경에도 안정적인 함수 참조 (useCallback 대체)
- `usePrevious` - 이전 값 추적
- `useUnmount` - unmount 시 정리

### 2. useControllableState 구현

**파일**: `src/utils/use-controllable-state.ts`

@lynx-js/lynx-ui-common에 없으므로 직접 구현. lynx-ui-switch의 인라인 패턴을 참고.

```typescript
interface UseControllableStateProps<T> {
  value?: T;            // controlled value
  defaultValue: T;      // uncontrolled default
  onChange?: (value: T) => void;
}

function useControllableState<T>(props: UseControllableStateProps<T>): [T, (value: T) => void]
```

**참고 파일:**
- [lynx-ui-switch/switch.tsx](https://github.com/lynx-family/lynx-ui/tree/main/packages/lynx-ui-switch/src/switch.tsx) (인라인 구현)
- `@radix-ui/react-use-controllable-state` (웹 버전 참고용)

**핵심 로직:**
```typescript
const isControlled = value !== undefined;
const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
const currentValue = isControlled ? value : uncontrolledValue;

const setValue = (nextValue: T) => {
  if (!isControlled) setUncontrolledValue(nextValue);
  onChange?.(nextValue);
};
```

### 3. usePressTap 구현

**파일**: `src/utils/use-press-tap.ts`

bindtap, bindtouchstart, bindtouchend, bindtouchcancel 이벤트를 관리하는 훅.

```typescript
interface UsePressTapProps {
  disabled?: boolean;
  onTap?: () => void;
}

interface UsePressTapReturn {
  pressed: boolean;
  bindtap?: () => void;
  bindtouchstart?: () => void;
  bindtouchend?: () => void;
  bindtouchcancel?: () => void;
}

function usePressTap(props: UsePressTapProps): UsePressTapReturn
```

**참고 파일:**
- [lynx-ui-switch/use-press-tap.ts](https://github.com/lynx-family/lynx-ui/tree/main/packages/lynx-ui-switch/src/use-press-tap.ts)
- [lynx-ui-switch/use-effect-event.ts](https://github.com/lynx-family/lynx-ui/tree/main/packages/lynx-ui-switch/src/use-effect-event.ts)

**핵심 로직:**
- `bindtouchstart` -> pressed = true (disabled면 무시)
- `bindtouchend` / `bindtouchcancel` -> pressed = false
- `bindtap` -> onTap 호출 (disabled면 무시)
- 모든 핸들러는 useMemoizedFn으로 안정 참조 유지

### 4. Portal 구현

**파일**: `src/components/Portal/Portal.tsx`

오버레이/시트 컴포넌트(Phase 5)의 전제 조건이므로 인프라 Phase에서 먼저 구현.

**React 소스**: `packages/react/src/components/Portal/Portal.tsx`
**React headless**: `packages/react-headless/portal/src/`

**참고:** Lynx에서 `createPortal` 지원 여부 확인 필요. 미지원이면 lynx-ui-overlay 패턴 참고:
- [lynx-ui-overlay](https://github.com/lynx-family/lynx-ui/tree/main/packages/lynx-ui-overlay/src/)

### 5. 기존 유틸 확인

이미 존재하는 유틸:
- `src/utils/dynamic-style.ts` - CSS variable 동적 주입
- `src/get-seed-class-name.ts` - 테마 클래스명 생성

## 구현 시 공통 컨벤션 리마인더

> AGENTS.md에 상세 설명. 모든 컴포넌트에 적용.

- **ref null guard**: `...(ref ? { ref } : {})` - Lynx applyRef가 null에서 에러
- **children 분리**: `const { children, ...nativeProps } = restProps` - circular reference 방지
- **dynamicStyle()**: CSS variable 동적 주입 시 반드시 사용
- **네이티브 `<view>` 직접 사용**: Primitive.view 사용 금지 (BackgroundSnapshot 에러)
- **displayName 필수**: `Component.displayName = "ComponentName"`

## 산출물 체크리스트

- [ ] `package.json`에 `@lynx-js/lynx-ui-common` 추가
- [ ] `src/utils/use-controllable-state.ts` 구현
- [ ] `src/utils/use-press-tap.ts` 구현
- [ ] `src/components/Portal/Portal.tsx` 구현
- [ ] `docs/content/lynx/hooks/use-controllable-state.mdx` 문서
- [ ] `docs/content/lynx/hooks/use-press-tap.mdx` 문서
