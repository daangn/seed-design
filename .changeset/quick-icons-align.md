---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

Lynx AppBar 가장자리 아이콘 버튼을 콘텐츠 여백에 자동으로 정렬합니다.

- 아이콘 버튼은 터치 타겟이 아이콘보다 커서 생기는 투명 여백(bleed)만큼 가장자리에서 당겨져야 하는데, Lynx AppBar에 이 보정이 빠져 AppBar가 우측으로 밀리던 문제를 해결합니다.
- `AppBarLeft`의 첫 번째 / `AppBarRight`의 마지막 아이콘 버튼에 자동 적용되며, `AppBarBackButton` / `AppBarCloseButton`은 물론 직접 만든 `AppBarIconButton`에도 동작합니다. 다중 버튼이나 `AppBarSlot`(custom)에서는 가장자리 아이콘 버튼에만 적용됩니다.
- 보정 방향을 직접 지정하는 `edge` prop(`"leading" | "trailing"`)을 추가했습니다. 보통은 `AppBarLeft` / `AppBarRight`가 자동 주입하므로 별도 설정이 필요 없습니다.

```tsx
// 기존 코드 그대로 자동 정렬됩니다.
<AppBar>
  <AppBarLeft>
    <AppBarBackButton bindtap={goBack} />
  </AppBarLeft>
  <AppBarMain title="동네생활" />
  <AppBarRight>
    <AppBarIconButton accessibility-label="알림" icon={<IconBellLine />} />
  </AppBarRight>
</AppBar>
```
