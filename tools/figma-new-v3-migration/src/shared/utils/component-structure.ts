interface NodeWithChildren {
  type?: string;
  value?: string;
  children?: Record<string, NodeWithChildren>;
}

/**
 * 컴포넌트 구조에서 가장 가까운 텍스트 값을 찾는 함수
 */
export function findNearestTextValue(
  structure: NodeWithChildren | undefined,
  maxDepth = 5, // 무한 재귀 방지를 위한 최대 깊이
): string | undefined {
  if (!structure || maxDepth <= 0) return undefined;

  // 현재 노드가 TEXT 타입이고 value가 있으면 반환
  if (structure.type === "TEXT" && structure.value) {
    return structure.value;
  }

  // children이 있으면 DFS로 탐색
  if (structure.children) {
    for (const child of Object.values(structure.children)) {
      const found = findNearestTextValue(child, maxDepth - 1);
      if (found) return found;
    }
  }

  return undefined;
}
