# @seed-design/lynx-react-time-picker

Headless hook built to implement [SEED Lynx Time Picker](https://seed-design.io/lynx/components/time-picker). This is an internal utility, not intended for public usage.

## Usage

`useTimePicker` turns a 24-hour `{ hour, minute }` value into period, hour, and minute wheel columns. Render each column with any wheel component.

```tsx
import { useTimePicker } from "@seed-design/lynx-react-time-picker";

export function AlarmTime() {
  const api = useTimePicker({ defaultValue: { hour: 9, minute: 30 }, locale: "ko-KR" });

  return (
    <view>
      {api.columnOrder.map((type) => {
        const column = api.columns[type];
        return <MyWheel key={type} {...column} />;
      })}
    </view>
  );
}
```

## Localization

Lynx has no `Intl`, so `locale` only distinguishes the `ko`, `ja`, and `en` language subtags. Other locales use `en`.
