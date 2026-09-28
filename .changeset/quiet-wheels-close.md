---
"@seed-design/react-date-picker": minor
---

Week의 연·월 Wheel Picker 동작을 보강합니다.

- `useDatePicker`에 `closeWheel` action을 추가합니다. 바깥 누르기나 `Escape`처럼 제목 버튼이 아닌 경로로 Wheel Picker를 닫을 때 사용하며, 제목 버튼으로 닫을 때와 같이 고른 연·월을 표시 날짜에 반영합니다. Wheel Picker가 닫혀 있으면 아무것도 하지 않습니다.
- Week가 두 달에 걸치면 제목과 Wheel Picker가 다음 달을 기준으로 표시합니다. 다음 달이 이동 가능한 월 범위 밖이면 이전 달을 표시합니다.
