---
"@seed-design/icon": patch
---

# 한국어

라이브러리 제공자가 `seed-icon`을 사용할 때 필요한 `provider`가 추가되었습니다.
**라이브러리 제공자가 아닌 기존 프로젝트는 그대로 사용할 수 있습니다.**

### provider

- `withContext`와 `contextPath` 옵션을 추가했습니다.
- `withContext` 옵션은 `true`로 설정하면 `contextPath`에 설정된 경로로 `context`를 생성합니다.
- 라이브러리 제공자는 유저가 어떤 sprite.svg 경로를 사용할 지 모릅니다. 어떤 loader를 쓰는지 라이브러리 제작자 입장에서는 알 수 없습니다.
- 그래서 `seed-icon` 에서 제공되는 `provider`를 노출시켜 유저가 `spriteUrl`을 설정하도록 하였습니다.

### etc

- 코드 리팩토링
- Readme.md 내용 추가

# English

Added `provider`, which is required when a library provider uses `seed-icon`.
**Existing projects that are not library providers can still be used as is**.

### provider

- Added `withContext` and `contextPath` options.
- The `withContext` option, when set to `true`, creates a `context` with the path set in `contextPath`.
- The library provider doesn't know which sprite.svg path the user will use. The library provider doesn't know what loader user use.
- So we expose the `provider` provided by `seed-icon` and let the user set the `spriteUrl`.

### etc

- Code refactoring
- Added `Readme.md` content
