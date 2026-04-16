# Kontext Dashboard: Unified View Design

## Context

Kontext는 모노레포 내 파일 간 의존성을 `kontext.yaml`로 정의하고, `kontext serve`로 대시보드를 띄워 탐색/편집하는 도구다.

기존 대시보드는 Explorer(탐색)와 Editor(편집) 두 탭으로 나뉘어 있었다. Explorer는 3번의 반복(리스트 → React Flow 그래프 → 듀얼 파일 트리)을 거쳤지만, 모두 근본적인 문제가 있었다:
- 파일 트리 안에 화살표를 그리는 건 업계에서 성공 사례가 없음 (스파게티, 스크롤 컨텍스트 유실, 폴더 접힘 문제)
- Explorer와 Editor가 같은 파일 트리를 중복으로 보여줌
- 두 뷰가 분리되어 있어 "편집하면서 영향 범위 확인"이 불가

## Decision

Explorer를 제거하고, Editor에 의존성 시각화를 통합한 **단일 뷰**로 재작성한다.

## Layout

3패널 단일 뷰 (탭 없음):

```
┌──────────────┬──────────────────────────┬──────────────────┐
│ Left Panel   │ Center Panel             │ Right Panel      │
│ (resizable)  │ (flex-1)                 │ (resizable)      │
│              │                          │                  │
│ KONTEXTS [+] │ Relation editor          │ YAML PREVIEW     │
│ ✨ cli       │ (when/affects forms)     │ (live preview)   │
│ ✨ react     │                          │ [Save]           │
│              │ Each affects item shows  │                  │
│ ──────────── │ ✓/✗/? badge              │                  │
│ REPOSITORY   │                          │                  │
│              │ ignore patterns          │                  │
│ (File tree   │                          │                  │
│  with inline │                          │                  │
│  highlights) │                          │                  │
└──────────────┴──────────────────────────┴──────────────────┘
```

## Core Interactions

### 1. kontext.yaml 선택 → 트리 하이라이트

KONTEXTS 섹션에서 kontext.yaml을 클릭하면:
- 가운데 패널: when/affects 편집 폼 로드 (기존 동작)
- 왼쪽 트리: 해당 kontext.yaml에 정의된 **모든 when/affects 파일** 하이라이트
  - 🔵 blue dot: when 파일 (소스)
  - 🟢 green: affects 파일, exists
  - 🔴 red: affects 파일, missing
  - 🟡 yellow: affects 파일, optional
- 해당 파일이 있는 폴더 **자동 펼침** (loadDir 호출 후 expand)

하이라이트 데이터 흐름:
```
selectedPackage
  → config (kontext.yaml 내용)
  → relations[] (파싱된 when/affects)
  → highlightedPaths: Map<string, 'when' | 'exists' | 'missing' | 'optional'>
  → FileTree에 전달
```

### 2. 편집 패널 내 상태 표시

각 affects 항목에:
- `✓` / `✗` / `?` 아이콘 (graph.nodes에서 exists 체크)
- 클릭 시 왼쪽 트리에서 해당 파일로 스크롤 + 강조 깜빡임 (scrollIntoView + flash animation)

### 3. 파일 트리에서 역방향 탐색

트리에서 임의의 파일 클릭 시:
- 해당 파일이 어떤 kontext.yaml에 포함되어 있는지 graph.edges에서 검색
- 포함된 kontext.yaml이 있으면 → 자동으로 해당 패키지 선택 + 관련 relation 하이라이트

### 4. 기존 기능 유지

- when/affects 폼 편집, per-affect reason 입력
- 파일 트리에서 affects 영역으로 드래그앤드롭
- Undo/Redo (Cmd+Z / Cmd+Shift+Z)
- YAML 프리뷰 (실시간) + Save 버튼
- New kontext.yaml 생성 (+ 버튼)
- Cmd+K 검색
- Sonner 토스트 피드백

## Components

### New: `useHighlightedPaths` hook

```typescript
function useHighlightedPaths(
  relations: EditableRelation[],
  graph: KontextGraph,
): Map<string, 'when' | 'exists' | 'missing' | 'optional'>
```

relations 배열에서 모든 when/affects 경로를 추출하고, graph.nodes에서 exists 여부를 확인해서 상태별 색상 맵을 반환한다.

### Modified: `FileTree.tsx`

기존 `highlightedPaths: Set<string>` → `highlightedPaths: Map<string, HighlightType>`으로 변경해서 상태별 다른 색상 적용.

- `'when'`: blue dot + blue tint
- `'exists'`: green dot + green tint  
- `'missing'`: red dot + red tint
- `'optional'`: yellow dot + yellow tint

폴더 자동 펼침: `autoExpandPaths: string[]` prop 추가. 하이라이트된 파일의 부모 폴더를 자동으로 loadDir + expand.

### Modified: `App.tsx`

Explorer/Editor 탭 제거. 단일 KontextView 컴포넌트만 렌더링.

### New: `KontextView.tsx`

기존 Editor.tsx의 로직을 가져오되, highlightedPaths 통합. Explorer.tsx와 관련 파일(DependencyTree, ConnectionLines) 삭제.

## Files to Change

| File | Action |
|------|--------|
| `src/views/KontextView.tsx` | New: Editor + highlight 통합 단일 뷰 |
| `src/hooks/useHighlightedPaths.ts` | New: relations → highlight map 변환 |
| `src/components/FileTree.tsx` | Modify: Set→Map, 상태별 색상, autoExpandPaths |
| `src/App.tsx` | Modify: 탭 제거, KontextView만 렌더링 |
| `src/views/Explorer.tsx` | Delete |
| `src/components/DependencyTree.tsx` | Delete |
| `src/components/ConnectionLines.tsx` | Delete |

## Verification

1. `bun vite build` 성공
2. `kontext serve` → 단일 뷰 로드
3. KONTEXTS에서 `cli` 클릭 → 편집 패널 + 트리 하이라이트 동시 동작
4. affects 파일에 ✓/✗/? 배지 표시
5. affects 항목 클릭 → 트리에서 해당 파일로 스크롤
6. 파일 편집 (when/affects 추가/삭제) + Undo/Redo 동작
7. Save → YAML 저장 성공
8. 드래그앤드롭 동작
9. Cmd+K 검색 동작
