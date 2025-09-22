---
"@seed-design/cli": major
---

**`add` 명령어 사용 방식을 변경합니다.**

- 항목 추가

```sh
seed-design add ui:action-button breeze:animate-number # ui 이외 레지스트리의 항목도 추가할 수 있게 되었습니다.
```

- 특정 레지스트리에 있는 모든 항목 추가

```sh
seed-design add-all ui lib breeze
```

- 모든 레지스트리의 모든 항목 추가

```sh
seed-design add-all --all
```

패키지 의존성 및 스니펫 의존성 설치 방식을 최적화합니다.
