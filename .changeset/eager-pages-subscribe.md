---
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `@lynx-js/react`를 `0.117.0` 이상으로 업그레이드해야 합니다.) 테마 변경에 반응하는 `useSeedClassName` 훅을 추가합니다.

- root `<page>`에서 `getSeedClassName()` 대신 `useSeedClassName()`을 사용하면, host가 `lynx.__globalProps.theme`을 변경할 때 자동으로 리렌더되어 테마가 즉시 반영됩니다.
- `getSeedClassName()` 순수 함수는 그대로 유지됩니다. 테마 변경에 반응할 필요가 없는 정적 컨텍스트에서 계속 사용할 수 있습니다.
- `useGlobalProps()`에 의존하므로 `@lynx-js/react` `0.117.0` 이상이 필요합니다.

```tsx
import { useSeedClassName } from "@seed-design/lynx-react";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={seedClassName}>
      <App />
    </page>
  );
}
```
