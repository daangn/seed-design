---
"@seed-design/cli": patch
---

도움말의 `예시:` 목록을 한 줄에 하나씩 출력합니다.

모든 명령어에서 예시가 한 줄로 이어 붙어 있었습니다. 예시가 셋 이상이면 어디서 끊어 읽어야 할지 알 수 없었어요.

```sh
# 이전
예시:   seed-design compat   seed-design compat -c action-button   seed-design compat --all

# 이후
예시:
  seed-design compat
  seed-design compat -c action-button
  seed-design compat --all
```
