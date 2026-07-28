---
"@seed-design/css": minor
"@seed-design/lynx-css": minor
"@seed-design/react": minor
"@seed-design/rootage-artifacts": minor
---

기존 Alert Dialog와 별개로, 범용 Dialog와 ResponsiveDialog를 추가합니다.

- `Dialog`: `medium`, `large` size를 지원하며, 본문이 길면 Body가 스크롤되고 상단에 divider와 하단 fade가 나타납니다.
- `ResponsiveDialog`: `md` 이상에서는 Dialog로, 그 아래에서는 Bottom Sheet로 렌더링합니다.
- `ui:dialog`, `ui:responsive-dialog` snippet으로 설치할 수 있습니다.

```tsx
<DialogRoot size="medium">
  <DialogTrigger asChild>
    <ActionButton>열기</ActionButton>
  </DialogTrigger>
  <DialogContent title="제목" description="설명">
    <DialogBody>{/* ... */}</DialogBody>
    <DialogFooter>
      <HStack gap="x2" justify="flex-end">
        <DialogAction variant="neutralWeak">취소</DialogAction>
        <DialogAction variant="neutralSolid">확인</DialogAction>
      </HStack>
    </DialogFooter>
  </DialogContent>
</DialogRoot>
```
