---
"@seed-design/react-tabs": patch
"@seed-design/react": patch
---

lazyMount를 사용하는 Tabs · ChipTabs에서 멀리 떨어진 탭을 선택하면 다른 탭이 열리던 문제를 해결합니다. lazyMount 및 TabsCarousel 사용 시 TabsContent 자체를 항상 렌더하고, TabsContent의 children만 lazy mount하도록 변경합니다.
