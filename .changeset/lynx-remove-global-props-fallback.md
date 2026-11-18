---
"@seed-design/lynx-react": major
"@seed-design/lynx-react-use-safe-area": major
"@seed-design/lynx-react-scale-feedback": major
"@seed-design/lynx-react-bottom-sheet": major
"@seed-design/lynx-react-floating": major
"@seed-design/lynx-react-select": major
"@seed-design/lynx-react-menu": major
"@seed-design/lynx-react-popover": major
---

(BREAKING CHANGE: 호스트 값은 `SeedProvider`의 `preferredColorScheme`·`preferredMotion`·`safeAreaInsets`로 넘겨야 합니다. floating의 `SafeAreaProbe` 대신 `getSafeAreaBoundary`로 위치 경계를 계산해야 합니다.) SEED Lynx 패키지가 호스트 global props를 직접 읽지 않고, Safe Area를 Provider 값으로만 계산합니다.

- `SeedProvider`·`useSeedContext`·`useSeedClassName`·`getSeedClassName`이 `lynx.__globalProps.theme`을 읽지 않습니다. `preferredColorScheme`을 넘기지 않으면 `colorMode: "system"`은 라이트 테마가 됩니다.
- `useScaleFeedback`이 `lynx.__globalProps.motion`을 읽지 않습니다. `preferredMotion`을 넘기지 않으면 Scale Feedback이 켜집니다.
- `useSafeArea`가 `lynx.__globalProps.safeAreaInset*`과 `env(safe-area-inset-*)`를 쓰지 않습니다. `SeedProvider`의 `safeAreaInsets`나 `SafeAreaProvider`가 없으면 모든 방향에 `"0px"`를 반환합니다.
- headless Bottom Sheet가 `lynx.__globalProps.screenHeight`·`screenWidth`를 읽지 않습니다. `screenHeight`·`screenWidth`를 넘기지 않으면 `500`·`375`를 씁니다. styled `BottomSheet`는 그대로 동작합니다.
- `@seed-design/lynx-react-floating`에서 `SafeAreaProbe`, `SafeAreaProbeNodes`, `SafeAreaProbeProps`, `FloatingBoundary`, `measureFloatingBoundary`를 제거합니다. 위치 경계는 `getSafeAreaBoundary(root, container, insets)`로 구합니다. `root`에는 `measureRootRect()`로 측정한 rect를, `insets`에는 Provider inset을 넘깁니다.
- headless Select·Menu·Popover가 Safe Area 측정용 view를 렌더링하지 않고, Provider inset으로 위치 경계를 계산합니다. `useSelect`·`useMenu`·`usePopover`의 반환값에서 `safeAreaRef`를 제거합니다.
- Dialog·AlertDialog는 위아래 Safe Area 여백에 Provider의 `top`·`bottom` inset 중 큰 값을 씁니다.
- global props를 읽을 때 개발 빌드에서 보이던 deprecated 경고도 사라집니다.

앱 root에서 global props를 읽어 `SeedProvider`에 넘깁니다.

```tsx
const g = lynx.__globalProps as HostGlobalProps;

<SeedProvider
  preferredColorScheme={g.theme === "dark" ? "dark" : "light"}
  preferredMotion={g.motion === "reduced" ? "reduced" : "default"}
  safeAreaInsets={{
    top: g.safeAreaInsetTop ?? 0,
    right: g.safeAreaInsetRight ?? 0,
    bottom: g.safeAreaInsetBottom ?? 0,
    left: g.safeAreaInsetLeft ?? 0,
  }}
>
  <App />
</SeedProvider>;
```
