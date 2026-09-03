---
"@seed-design/cli": minor
---

`init`에서 deprecated된 `--default` 옵션을 제거합니다.

`--yes`와 완전히 같은 일을 하면서 "Deprecated"라는 설명을 단 채 도움말에 남아 있었습니다.

**동작 변경**: `seed-design init --default`는 이제 알 수 없는 옵션으로 실패합니다. 스크립트에서 쓰고 있었다면 `--yes`(`-y`)로 바꿔주세요. 동작은 그대로입니다.
