# Stackflow Activity Display Optimization with Overlay Support

## Context

Stackflow의 `basicRendererPlugin`은 `useStyleEffectHide`를 통해 `enter-done` 상태의 top activity 아래 activity들에 `display: none`을 적용하여 성능을 최적화한다 (불필요한 paint/composite/GPU 비용 절감).

SEED Design Stackflow 패키지는 현재 이 최적화를 적용하지 않고 있다. 이번 작업에서는 `display: none` 최적화를 도입하되, **오버레이 activity (BottomSheet, Dialog, MenuSheet 등)**가 별도 Stackflow activity로 push될 때 뒤 activity가 보여야 하는 요구사항을 함께 처리한다.

## User API

### activityType prop

`AppScreen.Root`에 `activityType` prop을 추가한다. 기본값은 `"full-screen"`.

```tsx
// 기존 full-screen activity (변경 없음)
<AppScreen.Root>
  <AppScreen.Dim />
  <AppScreen.Layer>...</AppScreen.Layer>
  <AppScreen.Edge />
</AppScreen.Root>

// 오버레이 activity
<AppScreen.Root activityType="overlay">
  <AppScreen.Dim />
  <AppScreen.Layer>
    <BottomSheet.Root open={activity.isActive}>...</BottomSheet.Root>
  </AppScreen.Layer>
  <AppScreen.Edge />
</AppScreen.Root>
```

## Architecture

### Component Tree

```
<GlobalInteraction>                       ← HideEffectProvider 추가
  ├─ <AppScreen zIndex=0 type="full-screen">  ← useHideEffect 등록
  ├─ <AppScreen zIndex=1 type="full-screen">  ← useHideEffect 등록
  ├─ <AppScreen zIndex=2 type="overlay">       ← useHideEffect 등록
  └─ <AppScreen zIndex=3 type="overlay">       ← useHideEffect 등록
</GlobalInteraction>
```

### Core Data Structure

```typescript
type ActivityType = "full-screen" | "overlay";

interface HideEffectConnection {
  ref: React.RefObject<HTMLElement>;
  activityType: ActivityType;
  transitionState: string;
}

// connections: Map<zIndex, HideEffectConnection>
```

### Hide Logic Algorithm

스택을 top(가장 높은 zIndex)에서 bottom으로 순회하며 display를 결정한다:

```
1. top activity가 enter-done이 아니면 → 전환 중이므로 아무것도 hide하지 않음
2. top에서 아래로 순회하면서:
   a. overlay activity → skip (뒤가 보여야 함)
   b. full-screen activity + enter-done → "기준점" 발견
      - 기준점 바로 아래 1개 activity → display 유지 (pop/swipe-back 대비)
      - 그 아래 모든 activity → display: none
3. overlay만 연속으로 쌓인 경우 → 아무것도 hide하지 않음
```

### Scenario Table

| Stack | Action | Result |
|-------|--------|--------|
| `A` → `B(full, done)` | B enter-done | A: display 유지 (B 바로 아래) |
| `A` → `B` → `C(full, done)` | C enter-done | B: display 유지 (C 바로 아래), A: `display: none` |
| `A` → `Sheet(overlay, done)` | Sheet enter-done | A: display 유지 (overlay는 skip, hide 없음) |
| `A` → `B(full, done)` → `Sheet(overlay)` | Sheet enter-done | Sheet skip → B가 기준점 → A: display 유지 (B 바로 아래) |
| `A` → `B` → `C(full, done)` → `Sheet(overlay)` | Sheet enter-done | Sheet skip → C 기준점 → B: display 유지, A: `display: none` |
| `A` → `Sheet1(overlay)` → `Dialog(overlay)` | Dialog enter-done | 모두 overlay → hide 없음, A 보임 |
| `A` → `B` → `C` → `D(full, done)` | D enter-done | C: display 유지, B+A: `display: none` |

### Swipe-back / Pop Behavior

- swipe-back/pop 시 top activity의 transitionState가 `enter-done` → `exit-active`로 변경
- 이 변경이 감지되면 hide effect를 재평가
- 기준점 바로 아래 activity는 이미 display가 유지되어 있으므로 **flicker 없이 즉시 전환**
- 전환 완료 후 새로운 top activity 기준으로 hide 재계산

## Implementation

### New Files

**`packages/stackflow/src/hooks/useHideEffect.ts`**

핵심 hook. 역할:
1. `HideEffectContext`를 통해 공유 connections Map을 관리
2. 각 activity가 마운트 시 자신을 등록 (zIndex, ref, activityType, transitionState)
3. 언마운트 시 등록 해제
4. transitionState 변경 시 hide 로직 재실행

Export:
- `HideEffectProvider`: GlobalInteraction에서 사용하는 Context Provider
- `useHideEffect(props)`: 각 AppScreen에서 호출하는 hook

### Modified Files

**`packages/stackflow/src/primitive/AppScreen/useAppScreen.tsx`**
- `UseAppScreenProps`에 `activityType?: ActivityType` 추가
- `activityProps`의 `data-activity-type`을 하드코딩 `"full-screen"` → prop 값으로 변경
- `useHideEffect` 호출 추가 (activity ref, activityType, transitionState 전달)

**`packages/stackflow/src/primitive/AppScreen/AppScreen.tsx`**
- `AppScreenRoot`에 ref 전달 (useHideEffect가 DOM 조작에 사용)

**`packages/stackflow/src/components/AppScreen/AppScreen.tsx`**
- `AppScreenRootProps`에 `activityType` prop 추가
- primitive로 전달

**`packages/stackflow/src/primitive/GlobalInteraction/GlobalInteraction.tsx`**
- `HideEffectProvider`로 children 감싸기

**`packages/stackflow/src/primitive/GlobalInteraction/useGlobalInteraction.ts`**
- 변경 없음 (HideEffectProvider는 GlobalInteraction.tsx에서 추가)

**`packages/stackflow/src/hooks/index.ts`**
- `useHideEffect` export 추가

## DOM Manipulation Strategy

`display: none`은 React state가 아닌 **DOM style 직접 조작**으로 적용한다.

```typescript
// hide
ref.current.style.display = "none";

// restore
ref.current.style.display = "";
```

이유:
- React 렌더링 사이클과 독립적으로 즉시 반영
- CSS specificity 문제 없이 항상 적용
- transitionState 변경 시 cleanup 함수로 복원 보장
- Stackflow 원본(`useStyleEffectHide`)과 동일한 검증된 패턴

## Performance Characteristics

- **연산 비용**: O(n) where n = 활성 activity 수 (보통 3-5개). 무시 가능.
- **실행 빈도**: activity 전환 시에만 (transitionState 변경). 렌더링마다가 아님.
- **이득**: `display: none` 적용된 activity는 렌더 트리에서 제외 → paint/composite/GPU 비용 절감.
- **swipe-back**: 기준점 바로 아래 activity는 display 유지하므로 복원 비용 0.

## Verification

1. **단위 테스트**: useHideEffect hook의 hide 로직 테스트
   - full-screen 스택에서 정상 hide/restore
   - overlay activity가 있을 때 뒤 activity 보임
   - 연속 overlay에서 모든 activity 보임
   - 기준점 바로 아래 activity display 유지

2. **통합 테스트**: Storybook activity 예제에서 확인
   - push/pop 시 display 변경 확인
   - swipe-back 시 flicker 없음 확인
   - overlay activity push/pop 시 뒤 activity 가시성 확인

3. **수동 검증**: examples/stackflow-spa에서 다양한 시나리오 테스트
   - 브라우저 DevTools로 `display` style 변경 확인
   - Performance 탭에서 paint/composite 이벤트 감소 확인
