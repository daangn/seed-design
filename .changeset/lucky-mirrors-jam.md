---
"@seed-design/react-pull-to-refresh": minor
"@seed-design/css": minor
---

PullToRefresh 인디케이터의 여백과 당김 거리를 조정합니다.

- 인디케이터 영역이 프로그레스 서클(24px)과 그 위아래 여백(각 32px)을 감싸는 크기로 커집니다. `--ptr-size`가 `44px`에서 `calc(var(--seed-dimension-x6) + var(--seed-dimension-x8) * 2)`(88px)로 바뀌며, 새로고침 중에 열려 있는 공간도 같은 만큼 넓어집니다.
- `threshold` 기본값이 `44`에서 `88`로 바뀝니다. 인디케이터 영역과 이 값이 어긋나면 프로그레스 서클이 잘리거나 치우쳐 보이므로, 둘 중 하나를 바꾸면 나머지도 함께 맞춰주세요.
- `displacementMultiplier` 기본값이 `0.5`에서 `0.75`로 바뀝니다. 당겨야 하는 거리가 두 배가 되는 대신 손가락 이동 거리는 88px에서 117px로만 늘어나, 기존과 비슷한 무게감을 유지합니다.
- 이전 동작이 필요하면 `threshold={44}`, `displacementMultiplier={0.5}`를 직접 넘기고 `--ptr-size`를 `44px`로 덮어쓰면 됩니다.
