---
"@seed-design/lynx-react": patch
---

Lynx compound 컴포넌트에서 웹과 동일한 namespace export를 제공합니다.

- 기존 `SwitchRoot`, `CheckboxRoot`, `RadioGroupRoot`, `TagGroupRoot` 등 flat export는 유지하면서 `Switch.Root`, `Checkbox.Root`, `RadioGroup.Root`, `TagGroup.Root` 형태를 함께 지원합니다.
- `ProgressCircleRoot`, `ProgressCircleRange`, `ProgressCircleRootProps` flat export를 추가합니다. 기존 `ProgressCircle.Root` / `ProgressCircle.Range` 사용은 namespace export로 유지됩니다.
