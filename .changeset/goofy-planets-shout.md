---
"@seed-design/react": patch
---

TagGroupRoot 내부에서 `""`, 0 등 falsy한 값으로 조건부 렌더링 시 불필요한 separator가 표시될 수 있는 문제를 수정합니다.

```tsx
<TagGroupRoot>
  {distance && <TagGroupItem label=`${distance}m` />} // distance === 0인 경우 separator 표시되는 문제 수정
  {label && <TagGroupItem label={label} />} // label === ""인 경우 separator 표시되는 문제 수정
</TagGroupRoot>
```
