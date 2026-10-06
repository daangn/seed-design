---
"@seed-design/lynx-react-attachment-display": minor
"@seed-design/lynx-react": minor
---

Lynx AttachmentDisplay를 SEED 스타일 없이 조합할 수 있는 `@seed-design/lynx-react-attachment-display`를 추가합니다. 원격 URL 항목(`DisplayItemEntry`)의 controlled·uncontrolled 상태, `maxEntries` 상한과 1 이하에서의 첫 항목 교체(최소 1 보정 없음), `addEntries`·`updateEntryStatus`·`removeEntry`·`clearEntries`·`reorderEntry`의 disabled·readOnly guard, `Root`·`Trigger`·`ItemImage`·`ItemBackdrop`·`ItemRemoveButton`·`Description`·`ErrorMessage`·`Context` 파트를 제공합니다. Context는 React `@seed-design/react-attachment-display`와 같이 `AttachmentDisplayProvider`·`useAttachmentDisplayContext({ strict })`, item은 `AttachmentDisplayItemProvider`·`useAttachmentDisplayItemContext({ strict })`로 공개합니다. 같은 index로 `reorderEntry`를 호출하거나 자리가 없을 때 `addEntries`를 호출하면 목록이 바뀌지 않으므로 `onEntriesChange`를 호출하지 않습니다.

`@seed-design/lynx-react` AttachmentDisplay는 이 패키지 위에 Recipe를 조립합니다. **Breaking:** `AttachmentDisplay.Root`와 `useAttachmentDisplay`의 `onTriggerTap` prop을 제거합니다. React와 같이 picker callback은 Headless 계약이 아니며, `AttachmentDisplay.Trigger`의 `bindtap`에서 `useAttachmentDisplayContext()`의 `addEntries`·`updateEntryStatus`를 사용하세요. Registry `AttachmentDisplay`(`attachment-display-field`)의 `onTriggerTap` API는 그대로입니다. `useAttachmentDisplayContext`·`useAttachmentDisplayItemContext`가 `{ strict: false }`를 받아 Provider 밖에서 `null`을 반환할 수 있고, Trigger·ItemRemoveButton native view에 불필요한 `pressed` 속성을 더 이상 붙이지 않습니다.

```tsx
// 이전
<AttachmentDisplay.Root onTriggerTap={({ addEntries }) => pick().then(addEntries)}>
  <AttachmentDisplay.Trigger />
</AttachmentDisplay.Root>

// 이후
<AttachmentDisplay.Root>
  <AttachmentDisplay.Context>
    {({ addEntries }) => <AttachmentDisplay.Trigger bindtap={() => pick().then(addEntries)} />}
  </AttachmentDisplay.Context>
</AttachmentDisplay.Root>
```
