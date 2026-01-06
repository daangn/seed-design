# @seed-design/cli

SEED Design 컴포넌트를 프로젝트에 추가하기 위한 CLI 도구입니다.

## 개발 환경 설정

### 의존성 설치

```bash
bun install
```

### 환경 변수 설정 (선택사항)

PostHog 텔레메트리를 사용하려면 `.env` 파일을 생성하세요:

```bash
# packages/cli/.env
POSTHOG_API_KEY=your-api-key
POSTHOG_HOST=https://us.i.posthog.com

# 텔레메트리 비활성화 (로컬 개발 시)
DISABLE_TELEMETRY=true
```

**참고**: 환경 변수가 없어도 CLI는 정상적으로 동작합니다. 텔레메트리만 비활성화됩니다.

## 개발

### Dev 모드 실행

Watch 모드로 CLI를 실행합니다:

```bash
bun dev
```

Dev 모드에서는:
- 코드 변경 시 자동으로 재빌드됩니다
- `NODE_ENV=dev`로 설정되어 텔레메트리 이벤트가 콘솔에만 출력됩니다
- PostHog API 호출이 실제로 발생하지 않습니다

### 로컬 테스트

1. `@seed-design/docs`에서 `bun dev` 실행 (snippet 서버)
2. `packages/cli`에서 `bun dev` 실행 (watch 모드)
3. `bun run ./bin/index.mjs` 실행하여 CLI 명령어 테스트:

```bash
bun run ./bin/index.mjs init
bun run ./bin/index.mjs add ui:action-button
```

## 빌드

프로덕션 빌드:

```bash
bun run build
```

빌드 결과물:
- `bin/index.mjs` - 번들링 및 minify된 CLI 실행 파일
- 환경 변수 (`POSTHOG_API_KEY`, `POSTHOG_HOST`)가 빌드 시 번들에 주입됩니다

## 테스트

```bash
bun test
```

## 배포

이 패키지는 [Changesets](https://github.com/changesets/changesets)을 통해 자동으로 배포됩니다.

**참고**: 배포 시 GitHub Secrets에 `POSTHOG_API_KEY`와 `POSTHOG_HOST`가 설정되어 있어야 텔레메트리가 활성화됩니다.
