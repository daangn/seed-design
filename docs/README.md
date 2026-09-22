# 문서 사이트

SEED Design System의 통합 문서 사이트입니다. Fumadocs를 기반으로 만듭니다.

## 개발

```bash
bun dev
```

브라우저에서 <http://localhost:3000>을 엽니다.

## Docs cold/warm 빌드 측정

`deploy-seed-design-docs-alpha-pages` 워크플로를 같은 커밋에서 연속 두 번 실행하면, Next.js Actions 캐시에 포함된 Turbopack·Rspeedy 캐시와 전체 Docs 빌드 시간을 비교할 수 있습니다. 실제 배포가 발생하므로 배포가 허용된 테스트 브랜치에서만 실행합니다.

1. Actions에서 `deploy-seed-design-docs-alpha-pages`를 수동 실행합니다.
2. `benchmark-cache-key`에 이전에 사용하지 않은 짧은 식별자(예: `docs-warm-20260810`)를 입력합니다. 두 실행에서 브랜치, 커밋, 이 값과 Figma 관련 입력값을 모두 같게 유지합니다.
3. 첫 실행이 끝나 Next.js 캐시 저장 단계까지 성공했는지 확인합니다. 이 실행은 새 키를 사용하므로 `Next.js cache exact hit`이 `false`여야 합니다.
4. 같은 설정으로 두 번째 실행을 시작합니다. 두 번째 실행에서는 `Next.js cache exact hit`이 `true`이고 `Next.js cache matched key`가 `Next.js cache primary key`와 같아야 합니다.

각 실행의 작업 요약에 있는 `Docs build benchmark` 표에서 아래 값을 기록합니다.

| 지표 | 의미 |
| --- | --- |
| `Total docs build time (seconds)` | Figma 이미지 준비, 타입 검사, Lynx Rspeedy, Turbopack, 변경 로그 생성까지 포함한 시간입니다. |
| `Lynx Rspeedy cache size (KiB)` | `docs/.next/cache/lynx-rspeedy`가 차지하는 크기입니다. |
| `Next.js cache exact hit` | 현재 소스의 기본 캐시 키와 정확히 일치한 캐시를 복원했는지 나타냅니다. `true`만 warm 비교의 기준으로 사용합니다. |
| `Next.js cache matched key` | 실제로 복원한 캐시 키입니다. 첫 실행에서 값이 있으면 새 식별자를 사용하지 않았거나 같은 식별자를 이미 사용한 것입니다. |

첫 번째 실행의 `exact hit=false`와 두 번째 실행의 `exact hit=true`를 확인한 뒤 전체 시간과 Rspeedy cache 크기를 나란히 비교합니다. 두 번째 실행이 정확한 hit가 아니면 복원 키가 다른 상태이므로 cold/warm 결과로 기록하지 않고, 새 `benchmark-cache-key`로 다시 측정합니다.
