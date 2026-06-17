# AGENTS.md

## 디렉토리 개요

SEED 디자인 가이드라인을 기계가독 스펙(YAML)으로 모으는 폴더다. 컴포넌트/파운데이션/패턴별 **do·dont 규범 진술**의 단일 원천(SSOT)이며, rootage 바깥 독립 패키지라 가이드라인 수정이 published 산출물(rootage)의 버전에 영향을 주지 않는다. docs가 빌드 타임에 YAML을 직접 읽어 `<GuidelineRef>`·`<Guidelines>`로 렌더한다. 스키마는 `guideline.schema.json`.

## 파일 작성 컨벤션

- 디렉토리 = scope: `component/`, `foundation/`, `pattern/`. 한 파일 = 한 target.
- 파일명 = target(컴포넌트/파운데이션 이름, kebab). 예: `component/action-button.yaml`. `metadata.target`·`metadata.scope`는 **경로와 반드시 일치**한다.
- 모든 YAML 첫 줄에 모델라인을 둔다: `# yaml-language-server: $schema=../guideline.schema.json` (에디터 검증/자동완성).
- **zero-build**: YAML이 그대로 소비되는 산출물이다. generate/compile 스크립트를 추가하지 않는다.
- barrel/index 파일 없음. 순수 데이터만 둔다.

## 가이드라인 작성 컨벤션

### 필드

- `id`: `G-{C|F|P}-{target}-{slug}`. slug은 kebab, **파일 내에서 유일**하면 된다(target 접두사가 전역 유일성을 보장). **한 번 부여하면 바꾸지 않는다** — MDX와 다른 yaml의 `refs`가 참조하는 public 식별자다. 항목을 빼야 하면 삭제하지 말고 `deprecated: true` + `reason`으로 표시한다.
- `type`: `do` | `dont` 둘뿐.
- `group`: 플랫 태그(`icon`/`variant`/`layout`/`label`/`brand-color`/`vs-chip` 등). 같은 컴포넌트 내 기존 그룹명을 재사용한다. **계층(중첩)을 만들지 않는다.**
- `statement`: 한 문장 규범. 조건은 문장 안에 자연어로 담는다.
- `description`(선택): 근거/맥락 부연.
- `refs`(선택): 유사 컴포넌트와의 **vs 결정**만 연결한다(의사결정 트리의 간선). 예: action-button의 "선택 표현엔 Chip" → `G-C-chip-...`.
- `detectable: true`: 코드에서 **정적으로 감지 가능한** 규칙에만 단다(예: icon-only일 때 aria 누락, 앞뒤 아이콘 동시 사용). 맥락 판단이 필요하면 달지 않는다.
- **`figmaId`는 넣지 않는다.** 이미지는 문서 렌더링 메타데이터이므로 MDX의 `<GuidelineRef id figmaId>`에서만 연결한다. YAML은 텍스트 SSOT를 유지한다.

### 품질 기준 (작성·리뷰 시 강제)

가이드라인은 **규범적 진술**만 담는다. "무엇인가"를 설명하는 내용(아나토미·프로퍼티)은 여기 넣지 말고 컴포넌트 문서의 `## Anatomy`/`## Properties`로 보낸다.

1. **잣대가 있어야 한다**: 규칙을 적용할 기준을 문장이 담는다. 적용에 _판단_ 이 드는 건 괜찮다(예: "연결 액션에 Brand Solid" — 무엇이 '연결 액션'인지는 맥락 판단). 하지만 판단을 걸 **기준 자체가 없으면**("무분별하게 / 적절히 / 필요시") 안 된다.
2. **행동가능**: `dont`에는 대응하는 `do`가 붙거나 문장에 함의돼야 한다("대신 X하세요").
3. **1규칙 1진술**.

나쁜 예 → 좋은 예:

- ❌ `dont: 아이콘을 무분별하게 사용하지 마세요` (기준 없음, 대안 없음)
- ✅ `do: 아이콘은 액션의 의미를 보조하거나 동작을 안내할 때만 사용하세요` (기준 + 대응 행동)

### 문서 연결

- docs에서 단일 인용은 `<GuidelineRef id="..." figmaId?="..." />`, 묶음 렌더는 `<Guidelines target group? type? />`를 쓴다.
- 가이드라인을 추가/수정하면 해당 컴포넌트 MDX에서 같은 내용을 prose로 중복 기술하지 말고 `<GuidelineRef>`로 인용한다.
