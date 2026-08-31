---
"@seed-design/lynx-react": patch
---

Android에서 `BottomSheet` 내부를 스크롤하거나 드래그할 때 시트 뒤의 `list`/`scroll-view`가 함께 스크롤되던 문제를 수정합니다. 본문은 nested scroll에서 제외하고, 핸들·헤더·푸터·backdrop 위의 스와이프는 플랫폼 제스처로 전달되지 않도록 막습니다. 시트 드래그와 본문 스크롤 동작은 그대로입니다.
