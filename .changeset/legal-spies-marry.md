---
"@seed-design/cli": patch
---

snippet의 deprecated 여부를 기록합니다. cli add 명령 실행 시 snippet 목록에서 deprecate 여부를 표시하고, `--all`로 모든 스니펫 추가 시 기본적으로 deprecated snippet을 제외합니다.

```sh
seed-design add --all # deprecated snippet 제외
```

```sh
seed-design add --all --include-deprecated # deprecated snippet 포함
```
