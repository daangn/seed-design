---
"@seed-design/stackflow": patch
---

AppScreen transition의 easing과 duration 값을 리팩합니다. 모션은 더 응답성 있게, ease-in 사용을 제거합니다.

- iOS: easing을 `cubic-bezier(0.32, 0.72, 0, 1)`(Ionic drawer curve)로 변경, pop duration을 `280ms`로 분리해 진입/퇴장을 비대칭화합니다.
- Android: exit easing을 `linear`에서 `cubic-bezier(0.4, 0, 1, 1)`(Material Accelerate)로 교체합니다.
- FadeIn: ease-in을 제거하고 enter/exit 모두 `cubic-bezier(0.23, 1, 0.32, 1)`(strong ease-out)으로 통일합니다. enter duration은 opacity-only 모션에 맞춰 `220ms`로 축소합니다.
