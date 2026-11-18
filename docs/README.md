# 문서 사이트

SEED Design System의 통합 문서 사이트입니다. Astro와 Fumadocs(콘텐츠 엔진)로 만듭니다.

## 개발

```bash
bun dev
```

브라우저에서 터미널에 표시된 주소(기본 <http://localhost:4321>)를 엽니다.

```bash
bun run build     # build:pre → build:astro → build:post, 산출물은 out/
bun run preview   # out/을 정적 서버로 엽니다
```

## Docs cold/warm 빌드 측정

`deploy-seed-design-docs-alpha-pages` 워크플로를 같은 커밋에서 연속 두 번 실행하면 cold와 warm 빌드 시간을 비교할 수 있습니다. 실제 배포가 발생하므로 배포가 허용된 테스트 브랜치에서만 실행합니다.

1. Actions에서 `deploy-seed-design-docs-alpha-pages`를 수동 실행합니다.
2. `benchmark-cache-key`에 이전에 사용하지 않은 짧은 식별자(예: `docs-warm-20261118`)를 입력합니다. 두 실행에서 브랜치, 커밋, 이 값과 Figma 관련 입력값을 모두 같게 유지합니다. Figma 이미지 캐시는 이 namespace를 따르지 않습니다.
3. 첫 실행의 `Docs build cache restore` 표에서 lynx-out·lynx-rspack·typetable·astro가 모두 `miss`인지 확인합니다.
4. 같은 설정으로 두 번째 실행을 시작합니다. lynx-out이 `exact`, typetable·astro가 `exact`여야 warm 비교로 씁니다.

각 실행의 작업 요약에 있는 `Docs build timings` 표와 artifact `docs-build-timings`(JSON, 빌드 로그)에서 아래 값을 기록합니다. 캐시 단위와 key는 `.github/actions/docs-build-cache/README.md`에 있습니다.

| 지표 | 의미 |
| --- | --- |
| `setup start → build end (s)` | setup 시작부터 `Build: post` 끝까지입니다. 배포·링크 검사는 들어가지 않습니다. |
| `Build: pre/astro/post (s)` | 단계별 시간입니다. `Build: pre`·`Build: post`의 명령별 시간은 접힌 `concurrently timings` 표에 있습니다. |
| `Astro paths restored / rendered` | incremental build가 캐시에서 복원한 경로와 다시 렌더링한 경로의 수입니다. |
| `lynx-out` | `hit`이면 Lynx 예제를 빌드하지 않고 복원한 산출물을 확인만 했습니다. |
