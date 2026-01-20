# ecosystem

## 디렉토리 개요

SEED Design의 **CLI 도구와 코어 라이브러리**. `packages/`의 preset을 입력으로 받아 코드를 생성한다.

## 패키지 역할

| 디렉토리 | 역할 | 관련 패키지 |
|----------|------|-------------|
| `rootage/` | 토큰 생성 CLI | `packages/rootage` (입력) → `packages/css/vars` (출력) |
| `qvism/` | CSS Recipe 생성 CLI | `packages/qvism-preset` (입력) → `packages/css/recipes` (출력) |
| `figma-extractor/` | Figma 데이터 추출 | `packages/figma` |

## 관계 흐름

```
ecosystem/rootage CLI ← packages/rootage YAML
    ↓ 생성
packages/css/vars, packages/qvism-preset/src/vars

ecosystem/qvism CLI ← packages/qvism-preset recipes
    ↓ 생성
packages/css/recipes
```

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `bun rootage:generate` | rootage CLI 실행 |
| `bun qvism:generate` | qvism CLI 실행 |
| `bun generate:all` | 전체 생성 |

## 파일 작성 컨벤션

- 각 CLI는 독립 패키지 (`core/` + `cli/` 구조)
- TypeScript ESM으로 작성
