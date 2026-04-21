---
"@seed-design/lynx-react": minor
---

Lynx 플랫폼용 `Switch` 컴포넌트 추가

- `SwitchRoot`, `SwitchControl`, `SwitchThumb`, `SwitchLabel` export
- `useControllableState`와 `usePressTap` primitive 인라인 조합으로 구현 (별도 `useSwitch` 훅 없음)
- 웹 대비 제외: `SwitchHiddenInput`, `name`/`value`/`required`/`invalid`, focus/focusVisible (Lynx 런타임 미지원)
- `active` (pressed) 모디파이어는 `switchmark` recipe CSS에 pressed 상태 추가 시 활성화 예정
