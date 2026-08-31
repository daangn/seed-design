---
"@seed-design/cli": patch
---

여러 단어로 이루어진 옵션이 kebab-case와 camelCase 표기 모두에 답합니다.

이전 파서는 선언된 이름에서 다른 표기를 스스로 만들어냈기 때문에, `--baseUrl`과 `--base-url`이 첫 릴리스부터 똑같이 동작했습니다. 새 파서는 넘겨받은 이름만 알기 때문에 그동안 쓰이던 표기 한쪽이 사라져 있었습니다. 이제 아래 네 옵션이 두 표기를 모두 받습니다.

```sh
seed-design add --base-url https://v1-2.seed-design.io   # --baseUrl과 동일
seed-design add --onDiff backup                          # --on-diff와 동일
seed-design add --seedReactVersion 1.2                   # --seed-react-version과 동일
seed-design add-all --includeDeprecated                  # --include-deprecated와 동일
```

**동작 변경**: `--seedReactVersion`은 이전에도 옵션 자체는 받았지만 값이 조용히 버려져 기본 레지스트리를 그대로 썼습니다. 이제 지정한 버전이 실제로 적용됩니다. 이 표기로 버전을 넘기고 있었다면 지금까지 무시되던 값이 반영되므로, 의도한 버전이 맞는지 확인해 주세요.
