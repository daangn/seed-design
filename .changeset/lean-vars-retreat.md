---
"@seed-design/css": major
---

(BREAKING CHANGE: `typography`를 제외한 `@seed-design/css/vars/component` import를 디자인 토큰(`@seed-design/css/vars`)으로 바꿔야 합니다.) `@seed-design/css/vars/component`에서 `typography`만 제공합니다.

- `typography`를 제외한 `@seed-design/css/vars/component/*` 경로를 제거합니다. 이 경로들은 2.x에서도 SemVer 보장 대상이 아니었습니다.
- `@seed-design/css/vars/component` index를 제거합니다. index에서 `typography`를 가져왔다면 `@seed-design/css/vars/component/typography`에서 import해야 합니다.
