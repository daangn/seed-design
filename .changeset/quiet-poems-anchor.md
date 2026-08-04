---
"@seed-design/react": minor
"@seed-design/css": minor
"@seed-design/react-popover": minor
"@seed-design/rootage-artifacts": minor
---

Popover 컴포넌트를 추가합니다.

- 트리거 또는 `PopoverAnchor`에 앵커링되어 화면 위에 떠 있는 컨테이너로, Header/Body/Footer 구조를 제공합니다.
- `placement`로 트리거 기준 위치를 지정하며, 뷰포트 경계를 벗어나면 자동으로 뒤집히거나(flip) 이동합니다(shift). `safeAreaAware`가 기본으로 켜져 있어 노치와 홈 인디케이터 안쪽에 배치됩니다.
- `PopoverBody`는 콘텐츠가 실제로 넘칠 때에만 상단 divider와 하단 scroll fog를 표시합니다.
- `PopoverContent`에 `title`, `description`을 전달하면 `aria-labelledby`, `aria-describedby`가 함께 연결됩니다. 전달하지 않으면 해당 속성을 노출하지 않으므로, 직접 지정한 `aria-label`을 덮어쓰지 않습니다.
- 열릴 때 콘텐츠로 포커스를 옮기고 닫힐 때 트리거로 되돌립니다. 포커스를 가두지는 않아 `Tab`으로 Popover 밖으로 나갈 수 있고, 배경도 계속 조작할 수 있습니다.
- `lazyMount`(기본 `true`), `unmountOnExit`(기본 `false`)로 콘텐츠의 마운트 시점을 제어할 수 있습니다.
- `npx @seed-design/cli@latest add ui:popover`로 설치할 수 있습니다.

```tsx
<PopoverRoot>
  <PopoverTrigger asChild>
    <ActionButton variant="neutralSolid">Open Popover</ActionButton>
  </PopoverTrigger>
  <PopoverContent title="제목" description="설명을 작성할 수 있어요">
    <PopoverBody>본문 내용</PopoverBody>
    <PopoverFooter>
      <ActionButton variant="neutralSolid">확인</ActionButton>
    </PopoverFooter>
  </PopoverContent>
</PopoverRoot>
```

`onOpenChange` 두 번째 인자로 `details`를 제공합니다.

- 열릴 때(`open: true`)는 `"trigger"`입니다.
- 닫힐 때(`open: false`)는 `"closeButton"`, `"escapeKeyDown"`, `"interactOutside"`, `"cascadeDismiss"` 중 하나입니다.

Escape 키와 외부 영역 누름은 SEED 공용 dismissible layer stack에서 처리합니다. 가장 위에 있는 레이어만 닫히고, 상위 레이어(Dialog, Drawer 등)가 닫히면 함께 닫힙니다. 터치에서는 스크롤 도중 화면에 손이 닿는 것을 닫기로 보지 않습니다. 같은 headless를 사용하는 HelpBubble에도 동일하게 적용되며, `onOpenChange`의 `details`도 함께 제공됩니다.
