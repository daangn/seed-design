## 디렉토리 개요

레포 루트 기준 `skills/`는 seed-design 스킬의 단일 원천(source of truth)이다. `.claude/skills`, `.claude/plugins/seed-design/skills`, `.agents/skills` 모두 이 디렉토리로의 symlink이다.

## 파일 작성 컨벤션

- 스킬 디렉토리명은 kebab-case를 사용한다.
- 각 스킬 디렉토리는 반드시 `SKILL.md`를 포함한다.
- 부가 자료는 `references/`, `rules/`, `scripts/`, `assets/` 하위에 둔다. `rules/`는 코드를 작성할 때 항상 적용되는 규칙을, `references/`는 절차와 참고 자료를 담는다.
- 신규/수정은 이 디렉토리에서만 수행한다. symlink이므로 별도 동기화 작업은 불필요하다.

## 코드 작성 컨벤션

- `SKILL.md` frontmatter에는 최소 `name`, `description`을 유지한다. `name`은 디렉토리명과 일치해야 하며, 스킬 이름을 바꾸면 둘을 함께 바꾼다.
- `SKILL.md`는 **200줄 이내**로 유지한다. 넘으면 깊이가 있는 부분을 `references/`나 `rules/`로 뺀다. `SKILL.md`는 무엇을 언제 읽을지 알려주는 진입점이고, 내용 자체를 담는 곳이 아니다.
- **파일 목록은 `SKILL.md`에 한 번만 나온다.** 라우팅 표에 "언제 읽는가"와 링크를 함께 적고, 문서 끝에 같은 목록을 다시 붙이지 않는다.
- 하위 파일은 **원칙 진술을 넘는 깊이**(절차, 코드 패턴, 조회표)를 담을 때만 만든다. `SKILL.md`의 내용을 길게 풀어 쓰기만 하는 파일은 만들지 않는다.
- 금지·권장에는 **이유를 함께 적는다.** 무엇을 하면 안 되는지만 적으면 예외 상황에서 판단할 근거가 없다.

### 경로 표기

가리키는 대상에 따라 세 가지로 나뉜다. 에이전트의 작업 디렉토리는 **레포 루트**라는 점이 기준이다.

| 대상 | 표기 | 예 |
|---|---|---|
| 같은 스킬 안의 파일 | 스킬 디렉토리 기준 상대 경로 | `references/doctor.md`, `rules/outdated-version.md` |
| 다른 스킬 | **경로를 쓰지 않고** 백틱으로 이름만 | `` `changeset` 스킬 `` |
| 스킬이 읽거나 쓰는 레포 파일 | 레포 루트 기준 경로 | `docs/content/components/{id}.mdx` |

두 번째가 규칙 소유(아래)를 지탱한다. 다른 스킬의 파일을 상대 경로로 직접 가리키면 그쪽 구조가 바뀔 때 조용히 깨지고, 규칙을 베껴 오고 싶은 유혹도 생긴다.

**기준은 에이전트가 읽는 시점이지 마크다운 뷰어가 아니다.** `references/doctor.md`가 `rules/x.md`를 가리킬 때, 파일시스템 상대경로는 `../rules/x.md`지만 스킬 루트 기준으로 쓴다 — 스킬을 로드한 에이전트에게는 후자가 맞고, 하위 폴더가 한 겹 더 생겨도 표기가 흔들리지 않는다. GitHub에서 클릭했을 때 링크가 안 열리는 것은 이 규약이 감수하는 비용이다.

barrel file은 스킬 디렉토리에 두지 않는다 — 마크다운 문서에는 재export 개념이 없고, 파일 목록은 `SKILL.md`의 라우팅 표 하나가 유일한 진입점이기 때문이다(위 "파일 목록은 한 번만" 규칙).

## 규칙 소유

**규칙 하나는 한 스킬에만 산다.** 다른 스킬에서 필요하면 베끼지 말고 이름으로 가리킨다. 새 규칙을 어디에 쓸지 모르겠으면 아래 표에서 소유자를 찾는다.

경계를 가르는 축은 **누구를 위한 작업인가**이다. 이 레포 안에서 SEED를 만드는 사람(생산자)과 SEED를 가져다 쓰는 프로젝트(소비자)는 필요한 규칙이 다르다.

| 스킬 | 관점 | 소유하는 결정 | 위임 |
|---|---|---|---|
| `create-component` | 생산자 | 컴포넌트 구현 절차, 플랫폼 게이트, 검증 체크리스트 | changeset → `changeset` · 가이드라인 문서 → `migrate-component-docs-from-figma` |
| `changeset` | 생산자 | bump 등급 판정, 유저향 메시지, **버전 대상 제외** | 릴리스 실행 → `snapshot-release` |
| `deprecation` | 생산자 | deprecate 표기, 마이그레이션 문서, 제거 추적 | bump 등급 → `changeset` · 소비자 코드 진단 → `seed-design` |
| `migrate-component-docs-from-figma` | 생산자 | Figma → MDX 변환, 가이드라인 문서 작성 규약 | 컴포넌트 구현 → `create-component` |
| `snapshot-release` | 생산자 | 스냅샷 릴리스 트리거와 대기 | 버전 결정 → `changeset` |
| `dev-figma-v3-migration-plugin` | 생산자 | V2→V3 Figma 플러그인 매핑 | — |
| `seed-design` | 소비자 | 셋업, 컴포넌트·파운데이션 사용법, **사용 상태 진단(`rules/`)** | 레포 내부 작업 전부 |

같은 주제가 여러 스킬에 걸쳐 보여도 **질문이 다르면 소유자가 다르다.** deprecation이 그 예다 — 어떻게 deprecate하는지는 `deprecation`, 그게 몇 등급 bump인지는 `changeset`, 소비자가 deprecated를 쓰고 있는지는 `seed-design`이 답한다.
