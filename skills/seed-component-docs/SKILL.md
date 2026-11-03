---
name: seed-component-docs
description: SEED 컴포넌트 문서를 새로 쓰거나 고칠 때 사용한다. 공통 가이드 MDX(`docs/content/components/`), Figma SEED-Docs 페이지, React·Lynx 플랫폼 문서(`docs/content/{react,lynx}/components/`)의 내용·구조·문체를 맡고, Figma 문서 페이지에서 가이드 MDX로 이관할 때도 사용한다.
---

# SEED 컴포넌트 문서

컴포넌트 하나를 설명하는 문서는 세 겹이다. 공통 가이드와 Figma 페이지는 같은 내용을 두 매체로 담고, 플랫폼 문서는 그 내용을 코드 계약으로 옮긴다. 요청이 어느 겹을 바꾸는지 고르고 그 reference만 읽는다.

| 결과물 | 읽을 reference | 입력 |
| --- | --- | --- |
| 공통 가이드 MDX `docs/content/components/<id>.mdx` | [guide-doc.md](references/guide-doc.md) | 컴포넌트 역할·부품·속성·사용 규칙의 근거(Figma 페이지, 구현, PRD, 사용자 설명) |
| Figma SEED-Docs 페이지 | [figma-doc.md](references/figma-doc.md) | 가이드 MDX 또는 같은 내용의 초안, 대상 파일·페이지 |
| 기존 Figma 페이지 → 가이드 MDX 이관 | [figma-migration.md](references/figma-migration.md) + [guide-doc.md](references/guide-doc.md) | Figma 노드 URL |
| React·Lynx 문서 `docs/content/{react,lynx}/components/<name>.mdx` | [platform-doc.md](references/platform-doc.md) | 구현 소스, Registry snippet, 예제 파일 |

가이드와 Figma를 함께 요청받으면 가이드 MDX 본문을 먼저 확정하고 그 텍스트를 Figma에 옮긴다. 두 매체의 문장을 따로 쓰지 않는다.

## 경계

- 문서 작업은 컴포넌트 구현·Recipe·Registry를 바꾸지 않는다. 문서를 쓰다 API·동작 문제를 발견하면 문서용 우회를 쓰지 않고 [`seed-component`](../seed-component/SKILL.md)의 기존 구현 변경으로 분리한다.
- 예제 파일 작성·실행, Registry 배포 경로, Lynx 호환성 frontmatter와 기기 검증은 `seed-component`의 [lynx-docs.md](../seed-component/references/lynx-docs.md)·[lynx-docs-authoring.md](../seed-component/references/lynx-docs-authoring.md)·[implementation-steps.md](../seed-component/references/implementation-steps.md)가 맡는다. platform-doc.md는 문장과 구조만 정한다.
- Figma 원본 파일(SEED-Docs)의 기존 페이지는 사용자가 지정한 페이지·브랜치에서만 수정한다. `use_figma`를 부르기 전에 `figma-use` Skill을 읽는다.
- 문서 변경의 검증은 내용·링크·형식 검토다. `docs/` 빌드 검사는 `docs/AGENTS.md`「검증」을 따른다.
