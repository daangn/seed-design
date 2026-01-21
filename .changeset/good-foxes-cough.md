---
"@seed-design/rootage-artifacts": minor
"@seed-design/figma": minor
"@seed-design/react": minor
"@seed-design/css": minor
---

`SwitchMark`를 `Switchmark`로, `RadioMark`를 `Radiomark`로 Snippet 컴포넌트 이름을 변경합니다.

- **1.1 → 1.2 업그레이드 시 변경 권장**: snippet을 다시 내려받고, `SwitchMark`, `RadioMark`를 사용하는 코드를 아래와 같이 변경하세요.

  - `npx @seed-design/cli@latest add ui:switch ui:radio-group`
  - snippet에 `SwitchMark`, `RadioMark` 정의가 존재하지만, 1.3 릴리즈 시 snippet에서 해당 맵핑이 제거될 예정이므로 미리 변경해두시길 권장드립니다.

  ```tsx
  // 전
  import { ListSwitchItem, ListRadioItem } from "seed-design/ui/list";
  import { SwitchMark } from "seed-design/ui/switch";
  import { RadioMark } from "seed-design/ui/radio-group";

  <ListSwitchItem
    title="리스트 아이템 스위치"
    detail="설명 텍스트"
    suffix={<SwitchMark tone="neutral" />}
  />;

  <ListRadioItem
    prefix={<RadioMark tone="neutral" size="large" />}
    value="option"
    title="옵션"
  />;
  ```

  ```tsx
  // 후
  import { ListSwitchItem, ListRadioItem } from "seed-design/ui/list";
  import { Switchmark } from "seed-design/ui/switch";
  import { Radiomark } from "seed-design/ui/radio-group";

  <ListSwitchItem
    title="리스트 아이템 스위치"
    detail="설명 텍스트"
    suffix={<Switchmark tone="neutral" />}
  />;

  <ListRadioItem
    prefix={<Radiomark tone="neutral" size="large" />}
    value="option"
    title="옵션"
  />;
  ```
