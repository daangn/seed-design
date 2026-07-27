---
"@seed-design/css": minor
"@seed-design/lynx-css": minor
"@seed-design/react": minor
"@seed-design/rootage-artifacts": minor
---

기존 Alert Dialog와 별개로, 범용 Dialog(`ContentDialog`)와 뷰포트에 따라 형태가 바뀌는 `ResponsiveDialog`를 추가합니다.

- `ContentDialog`: `medium`/`large` 두 size를 지원합니다. 본문이 넘칠 때만 Body에 스크롤 divider와 하단 fade가 적용되고, 우상단 close button을 옵션으로 노출할 수 있습니다.
- `ResponsiveDialog`: `md` 이상에서는 Dialog로, `sm` 이하에서는 Bottom Sheet로 렌더링합니다.
- 스니펫 `dialog`, `responsive-dialog`를 registry에 추가합니다.

```tsx
<DialogRoot size="medium">
  <DialogTrigger asChild>
    <ActionButton>열기</ActionButton>
  </DialogTrigger>
  <DialogContent title="제목" description="설명" showCloseButton>
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

또한 rootage 컴포넌트 스펙의 이름을 Figma 스펙에 맞춥니다. 기존 `dialog`는 `alert-dialog`로, 신규 범용 Dialog가 `dialog`를 사용합니다. 이에 따라 `vars/component/dialog`가 가리키는 컴포넌트가 Alert Dialog에서 범용 Dialog로 바뀌고, Alert Dialog의 변수는 `vars/component/alert-dialog`로 이동합니다. recipe 이름(`dialog`, `content-dialog`)과 클래스 이름은 그대로입니다.
