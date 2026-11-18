# packages

배포·내부 라이브러리 workspace 모음이다. 패키지 사이 의존 방향은 `ARCHITECTURE.md`「패키지 의존 방향」에, 패키지별 검증과 규칙은 각 패키지 `AGENTS.md`에 있다.

## 규칙

- 다른 workspace 패키지는 패키지 이름과 그 패키지 `package.json`의 `exports` 경로로 import한다. 상대 경로로 다른 패키지의 `src/`를 가리키지 않는다 → 필요한 심볼이 공개되지 않았으면 대상 패키지의 `exports`와 진입점에 추가한다.
- 의존 패키지를 고친 뒤 소비 패키지를 검증할 때 → 의존 패키지를 `bun --filter <패키지 이름> build`로 먼저 빌드한다. 대부분의 `exports`가 `lib/` 빌드를 가리키므로 빌드하지 않으면 이전 코드로 검증된다.
