---
name: changeset
description: git diff 분석 기반으로 changeset 파일을 자동 생성합니다. 변경된 패키지를 감지하고, 변경 타입을 분류하고, 한국어 유저향 메시지를 작성합니다.
---

# Changeset

git diff를 분석하여 changeset 초안을 생성하고, 사용자 확인 후 파일을 작성한다.

## 실행 절차

### Phase 1: 변경 분석

1. `git diff dev...HEAD --name-only`로 dev 브랜치 대비 변경된 파일 목록을 수집한다.
   - dev 브랜치가 아닌 다른 base를 사용해야 하면 사용자에게 확인한다.
2. 변경 파일 경로에서 패키지를 식별한다 — 아래 **패키지 식별 방법** 참조.
3. private 패키지와 제외 대상을 필터링한다.
4. 이미 존재하는 `.changeset/*.md` 파일을 읽어 이미 커버된 변경사항이 있는지 확인한다.
   - 이미 커버된 패키지가 있다면 사용자에게 알리고, 추가 changeset이 필요한지 확인한다.

### Phase 2: 변경 타입 결정

5. 각 패키지별로 `git diff dev...HEAD -- <패키지_경로>`를 실행하여 실제 변경 내용을 확인한다.
6. `references/patterns.md`의 **타입 분류 기준**에 따라 patch/minor/major를 판단한다.
   - **주의**: breaking change는 대부분 **minor**로 분류한다 (major가 아님). major는 패키지 전체 구조 변경 같은 대격변에만 사용한다.
   - breaking change가 포함된 minor에는 `(BREAKING CHANGE: ...)` 접두사를 메시지에 붙인다 — `references/patterns.md` 참조.
7. 판단 근거를 간략히 기록한다.

### Phase 3: 메시지 작성

8. `references/patterns.md`를 읽고 메시지 패턴을 참조한다.
9. diff 내용을 바탕으로 **디자인 시스템 소비자(개발자)** 관점의 한국어 메시지를 작성한다.
   - 내부 리팩토링이 아닌 **사용자에게 보이는 변경**에 초점을 맞춘다.
   - 타입별 구조를 따른다 (patch: 1줄+불릿, minor: 제목+설명+코드예제, major: 제목+설명+마이그레이션).
   - breaking change가 포함된 경우 `(BREAKING CHANGE: {마이그레이션 액션})` 접두사를 메시지 첫 줄에 붙인다.
10. 독립적인 변경이 여러 개면 별도 changeset 파일로 분리를 권장한다.

### Phase 4: 초안 확인

11. 아래 형식으로 초안을 보여준다:

```text
## Changeset 초안

### 포함 패키지
| 패키지 | 변경 타입 | 판단 근거 |
|--------|----------|----------|
| @seed-design/react | patch | ... |

### 메시지 미리보기
(changeset 파일 전체 내용을 코드블록으로)
```

12. 사용자에게 확인/수정을 요청한다.
13. 수정 요청이 있으면 반영 후 다시 보여준다.

### Phase 5: 파일 생성

14. 사용자가 승인하면 `.changeset/` 디렉토리에 Write 도구로 파일을 생성한다.
15. 파일명은 영어 소문자 `형용사-명사-동사.md` 형태의 랜덤 3단어 조합을 사용한다.
    - 기존 `.changeset/*.md` 파일명과 충돌하지 않도록 확인한다.

---

## 패키지 식별 방법

변경 파일 경로에서 가장 가까운 `package.json`을 찾아 `name` 필드를 읽는다.

```bash
# 변경 파일에서 패키지 루트 추출
git diff dev...HEAD --name-only | while read f; do
  dir="$f"
  while [ "$dir" != "." ]; do
    dir=$(dirname "$dir")
    [ -f "$dir/package.json" ] && echo "$dir" && break
  done
done | sort -u

# 각 패키지의 name과 private 확인
jq -r '{name: .name, private: (.private // false)}' <패키지경로>/package.json
```

### 주요 패키지 매핑 (참고용)

| 경로 | 패키지명 | 비고 |
|------|---------|------|
| `packages/react/` | `@seed-design/react` | |
| `packages/css/` | `@seed-design/css` | 생성 파일 포함 — rootage 변경이 원인일 수 있음 |
| `packages/rootage/` | `@seed-design/rootage-artifacts` | 디렉토리명 ≠ 패키지명 |
| `packages/cli/` | `@seed-design/cli` | |
| `packages/figma/` | `@seed-design/figma` | linked: mcp |
| `packages/mcp/` | `@seed-design/mcp` | linked: figma |
| `packages/codemod/` | `@seed-design/codemod` | linked: migration-index |
| `packages/migration-index/` | `@seed-design/migration-index` | linked: codemod |
| `packages/docs-mcp/` | `@seed-design/docs-mcp` | |
| `packages/stackflow/` | `@seed-design/stackflow` | |
| `packages/design-token/` | `@seed-design/design-token` | |
| `packages/stylesheet/` | `@seed-design/stylesheet` | |
| `packages/tailwind3-plugin/` | `@seed-design/tailwind3-plugin` | |
| `packages/tailwind4-theme/` | `@seed-design/tailwind4-theme` | |
| `packages/vite-plugin/` | `@seed-design/vite-plugin` | |
| `packages/rsbuild-plugin/` | `@seed-design/rsbuild-plugin` | |
| `packages/webpack-plugin/` | `@seed-design/webpack-plugin` | |
| `packages/react-headless/<name>/` | `@seed-design/react-<name>` | 하위 패키지별 |
| `ecosystem/figma-extractor/` | `@seed-design/figma-extractor` | |

## 제외 대상 (changeset 불필요)

- `package.json`의 `"private": true`인 패키지 (`packages/qvism-preset/`, `ecosystem/postcss-engaged/` 등)
- `packages/archive/*` — 아카이브 패키지
- `tools/*` — 내부 도구
- `examples/*` — 예제 프로젝트
- `docs/` — 문서 사이트
- `.claude/`, `scripts/`, 루트 설정 파일 — 인프라

## Linked 패키지 그룹

`.changeset/config.json`의 `linked` 배열에 정의된 패키지들은 릴리스 시 동일 버전으로 자동 처리된다. changeset에는 변경된 패키지만 포함하면 된다.

- `[@seed-design/figma, @seed-design/mcp]`
- `[@seed-design/codemod, @seed-design/migration-index]`

## 주의사항

- `packages/css/`는 rootage/qvism-preset에서 생성되는 파일이 많다. css에 변경이 감지되면 실제 원인이 rootage 변경인지 확인하고, changeset 메시지에 반영한다.
- changeset 메시지는 **CHANGELOG에 그대로 들어가는 유저향 텍스트**다. 내부 구현 디테일이 아닌 사용자 영향을 서술한다.
- frontmatter의 패키지명은 반드시 쌍따옴표(`"`)로 감싼다.

## 참조 파일

- `references/patterns.md` — 메시지 작성 패턴 가이드
