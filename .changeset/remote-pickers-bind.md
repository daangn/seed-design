---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `AttachmentDisplay.Root`·`useAttachmentDisplay`의 `onTriggerTap`을 제거하고, 파일 선택 함수를 `AttachmentDisplay.Trigger`의 `bindtap`에 연결해야 합니다.) 첨부 선택 버튼에서 파일 선택과 항목 추가를 직접 연결하도록 변경합니다. `AttachmentDisplay.Context` 또는 `useAttachmentDisplayContext`의 `addEntries`·`updateEntryStatus`로 선택한 항목과 업로드 상태를 갱신합니다.

```tsx
// 이전
<AttachmentDisplay.Root onTriggerTap={({ addEntries }) => pick().then(addEntries)}>
  <AttachmentDisplay.Trigger />
</AttachmentDisplay.Root>

// 이후
<AttachmentDisplay.Root>
  <AttachmentDisplay.Context>
    {({ addEntries }) => (
      <AttachmentDisplay.Trigger bindtap={() => pick().then(addEntries)} />
    )}
  </AttachmentDisplay.Context>
</AttachmentDisplay.Root>
```

Registry `ui:attachment-display-field`의 `AttachmentDisplay.onTriggerTap`은 유지합니다. 이 마이그레이션은 `@seed-design/lynx-react`에서 가져온 컴포넌트와 훅에만 적용합니다.
