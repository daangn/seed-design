---
"@seed-design/cli": patch
---

`recast` 의존성을 v0.24로 업데이트합니다. `seed-design.json`의 `tsx`가 `false`일 때 `add`·`add-all` 명령이 JavaScript로 변환한 스니펫에서, 주석 바로 뒤의 JSX를 불필요한 괄호로 감싸던 문제와 원본 스니펫의 빈 줄이 사라지던 문제가 함께 수정됩니다.

- `recast`가 Node.js 22 이상을 요구하므로 `@seed-design/cli`의 Node.js 요구사항을 `>=22.0.0`으로 올립니다. Node.js 20에서 실행 중이라면 Node.js 22 이상으로 업그레이드해야 합니다.
