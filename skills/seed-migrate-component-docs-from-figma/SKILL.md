---
name: seed-migrate-component-docs-from-figma
description: Figma 문서 레이어에서 SEED 컴포넌트 가이드 MDX와 이미지를 만들거나 갱신할 때 사용한다.
---
# Figma에서 컴포넌트 문서 이관

Figma 문서 레이어의 내용과 이미지를 근거로 SEED Design 컴포넌트 가이드 MDX를 작성하거나 갱신한다.

## 입력과 범위

- **Figma 노드 URL**은 필요하다. 제공되지 않았고 다른 도구·문맥에서 확인할 수 없으면 이 값만 사용자에게 요청한다.
- **파일명**은 사용자가 준 이름, 대상 MDX 경로, 기존 컴포넌트 ID에서 확정할 수 있으면 추론한다. 여전히 모호할 때만 요청한다.
- 대상 파일은 `docs/content/components/{file-name}.mdx`다. 기존 파일의 국소 수정이면 대상 섹션과 필요한 Figma 노드만 읽고, 전체 문서를 다시 추출하지 않는다.

## 1. Figma 내용 추출

제공된 각 노드 URL에 `get_node_info`를 사용한다. URL을 직접 받는 도구이므로 별도 `fileKey`·`nodeIds`가 필요한 `get_nodes_info`는 사용하지 않는다.

여러 URL이 서로 독립적이고 결과를 합치는 작업이 충분할 때만 병렬로 추출한다. 그렇지 않으면 순서대로 추출해 heading, 본문, 표, Do/Don't, 이미지 위치를 구조화한다.

## 2. MDX 작성

새 문서·새 섹션에는 `references/patterns.md`에서 사용할 MDX 컴포넌트 규칙만 읽는다. 기존 문서의 국소 수정에는 해당 컴포넌트와 인접한 기존 패턴만 따른다.

- Figma에 있는 본문 내용만 사용한다. 설명·가이드·표 항목을 임의로 보태거나 의미를 바꾸지 않는다.
- Figma의 굵은 글자는 `**bold**`, 표 형식에 맞는 내용은 Markdown table로 옮긴다.
- 실제 다른 컴포넌트를 언급하면 해당 컴포넌트 페이지로 링크한다.
- `FigmaImage`는 제목 바로 아래가 아니라 본문 뒤에 둔다.
- Anatomy → Properties → Guidelines → Comparison → V3 Changes → Specification 순서는 해당 섹션이 Figma에 있을 때만 따른다.
- 한국어 존댓말을 쓰고 컴포넌트명·기술 용어는 공식 English 표기를 유지한다.

이미지 ID는 이 단계에서 빈 placeholder로 두고 다음 단계에서 매핑한다.

## 3. 이미지 ID 매핑

부모 레이어에서 다음처럼 `Document / Image` 자식을 찾는다.

```
find_nodes(name: "Document / Image", nodeId: "{parent layer ID}")
```

문서 흐름과 부모 관계로 순서가 명확할 때만 `id=""`·`figmaId=""` placeholder에 순서대로 넣는다. 개수 불일치나 여러 합리적 대응으로 매핑이 모호하면 임의로 배정하지 말고, 확인 가능한 부모·순서를 더 조사한 뒤에도 남는 선택만 사용자에게 질문한다.

## 4. 대상 범위 검토

변경한 MDX와 새·변경된 요소에만 다음을 확인한다.

- `PlatformStatusTable`은 컴포넌트 가이드라면 frontmatter 바로 뒤에, `ComponentSpecBlock`은 실제 관련 Rootage spec이 있을 때만 Specification 아래에 있다.
- Markdown 문법, 공식 English 컴포넌트명, 문장·컴포넌트 혼동, 중복 내용을 확인한다.
- 새·변경된 컴포넌트 링크와 token 링크만 실제 대상 페이지에서 확인한다.
- Figma가 Web/React, iOS, Android처럼 플랫폼별 내용을 언급하면 발견 사실과 문서 반영 범위를 사용자에게 알린다.

## 참고

`docs/content/components/radio.mdx`의 Do/Don't·Grid·Card와 `docs/content/components/action-button.mdx`의 Properties·Guidelines·Comparison은 해당 패턴이 필요한 경우에만 참고한다.
