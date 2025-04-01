import type { JSCodeshift, Collection, ASTNode, ASTPath } from "jscodeshift";

/**
 * 삼항 연산자 컨텍스트 인터페이스
 */
export interface TernaryContext {
  /** 중첩 깊이 (1부터 시작) */
  depth: number;
  /** 삼항 연산자가 할당되는 속성 이름 (있는 경우) */
  parentPropertyName?: string;
  /** 삼항 연산자 내에서의 경로 ('root', 'consequent', 'alternate') */
  path: string;
}

/**
 * 패턴 필터링을 위한 인터페이스
 */
export interface PatternFilter {
  type: any;
  filter: Record<string, any>;
}

/**
 * 노드 타입
 */
type AnyNode = ASTNode & Record<string, any>;
type NodePath = ASTPath<AnyNode>;

/**
 * Collection인지 NodePath인지 확인하는 타입 가드
 */
function isNodePath(obj: NodePath | Collection<any>): obj is NodePath {
  return "node" in obj;
}

/**
 * 안전하게 노드에 접근하는 유틸리티 함수
 */
function getNodeFromPath(path: NodePath | Collection<any>): AnyNode | null {
  if (isNodePath(path)) {
    return path.node;
  }
  // Collection의 경우 첫 번째 요소의 노드를 가져옵니다
  if (path.length > 0) {
    const firstPath = path.get(0);
    return isNodePath(firstPath) ? firstPath.node : null;
  }
  return null;
}

/**
 * 삼항 연산자의 중첩 깊이를 계산하는 함수
 * @param j JSCodeshift 인스턴스
 * @param ternaryPath 검사할 삼항 연산자 경로
 * @returns 중첩 깊이 (1부터 시작, 중첩이 없으면 1)
 */
export function calculateTernaryDepth(
  j: JSCodeshift,
  ternaryPath: NodePath | Collection<any>,
): number {
  let depth = 1;
  const node = getNodeFromPath(ternaryPath);
  if (!node) return depth;

  // 중첩된 삼항 연산자 검색
  // consequent(참일 경우 결과)에 중첩된 삼항 연산자가 있는지 확인
  if (node.consequent && node.consequent.type === "ConditionalExpression") {
    const consequentDepth = calculateTernaryDepth(j, j(node.consequent)) + 1;
    depth = Math.max(depth, consequentDepth);
  }

  // alternate(거짓일 경우 결과)에 중첩된 삼항 연산자가 있는지 확인
  if (node.alternate && node.alternate.type === "ConditionalExpression") {
    const alternateDepth = calculateTernaryDepth(j, j(node.alternate)) + 1;
    depth = Math.max(depth, alternateDepth);
  }

  return depth;
}

/**
 * 삼항 연산자 내에서 패턴과 일치하는 모든 경로를 찾는 함수
 * @param j JSCodeshift 인스턴스
 * @param ternaryPath 처리할 삼항 연산자 경로
 * @param pattern 검색할 패턴
 * @param processPath 각 발견된 경로에 대해 실행할 콜백 함수
 * @param options 처리 옵션
 */
export function processTernaryExpressions(
  j: JSCodeshift,
  ternaryPath: NodePath | Collection<any>,
  pattern: PatternFilter,
  processPath: (path: NodePath, context: TernaryContext) => void,
  options: {
    processNestedTernaries?: boolean;
    maxDepth?: number;
  } = {},
): void {
  const { processNestedTernaries = true, maxDepth = Number.POSITIVE_INFINITY } = options;

  const node = getNodeFromPath(ternaryPath);

  // 노드가 없거나 ConditionalExpression 타입이 아닌 경우 종료
  if (!node || node.type !== "ConditionalExpression") {
    return;
  }

  // 현재 삼항 연산자의 컨텍스트 정보 생성
  const rootContext: TernaryContext = {
    depth: 1,
    parentPropertyName: getParentPropertyName(ternaryPath),
    path: "root",
  };

  // 삼항 연산자 내의 consequent(참일 경우 결과) 처리
  if (node.consequent) {
    processTernaryBranch(j, node.consequent, pattern, processPath, {
      ...rootContext,
      path: "consequent",
    });
  }

  // 삼항 연산자 내의 alternate(거짓일 경우 결과) 처리
  if (node.alternate) {
    processTernaryBranch(j, node.alternate, pattern, processPath, {
      ...rootContext,
      path: "alternate",
    });
  }

  // 중첩된 삼항 연산자를 처리하는 옵션이 활성화된 경우
  if (processNestedTernaries) {
    // consequent(참일 경우 결과)에 중첩된 삼항 연산자가 있다면 재귀적으로 처리
    if (
      node.consequent &&
      node.consequent.type === "ConditionalExpression" &&
      rootContext.depth < maxDepth
    ) {
      processTernaryExpressions(j, j(node.consequent), pattern, processPath, {
        ...options,
        processNestedTernaries: true,
      });
    }

    // alternate(거짓일 경우 결과)에 중첩된 삼항 연산자가 있다면 재귀적으로 처리
    if (
      node.alternate &&
      node.alternate.type === "ConditionalExpression" &&
      rootContext.depth < maxDepth
    ) {
      processTernaryExpressions(j, j(node.alternate), pattern, processPath, {
        ...options,
        processNestedTernaries: true,
      });
    }
  }
}

/**
 * 삼항 연산자의 특정 분기(branch)에서 패턴과 일치하는 노드들을 처리하는 함수
 */
function processTernaryBranch(
  j: JSCodeshift,
  branchNode: AnyNode,
  pattern: PatternFilter,
  processPath: (path: NodePath, context: TernaryContext) => void,
  context: TernaryContext,
): void {
  if (!branchNode) return;

  // 분기 내에서 패턴과 일치하는 모든 노드 찾기
  j(branchNode)
    .find(pattern.type, pattern.filter)
    .forEach((path: NodePath) => {
      processPath(path, context);
    });
}

/**
 * 상위 노드에서 속성 이름을 추출하는 함수 (예: style={{ backgroundColor: 조건 ? A : B }})
 */
export function getParentPropertyName(path: NodePath | Collection<any>): string | undefined {
  // NodePath 기준으로 parent 접근
  let parentNode = null;
  let parentParentNode = null;

  if (isNodePath(path)) {
    if (!path.parent?.node) return undefined;
    parentNode = path.parent.node;
    parentParentNode = path.parent.parent?.node;
  } else if (path.length > 0) {
    const firstPath = path.get(0);
    if (isNodePath(firstPath) && firstPath.parent?.node) {
      parentNode = firstPath.parent.node;
      parentParentNode = firstPath.parent.parent?.node;
    }
  }

  if (!parentNode) return undefined;

  // 객체 속성에 할당된 경우 (property.key.name)
  if (parentNode.type === "Property" && parentNode.key) {
    if (parentNode.key.type === "Identifier") {
      return parentNode.key.name;
    }
    if (parentNode.key.type === "StringLiteral") {
      return parentNode.key.value;
    }
  }

  // JSX 속성인 경우 (jsxAttribute.name.name)
  if (parentNode.type === "JSXAttribute" && parentNode.name) {
    return parentNode.name.name;
  }

  // Assignment이고 left가 MemberExpression인 경우 (예: obj.prop = 조건 ? A : B)
  if (
    parentNode.type === "AssignmentExpression" &&
    parentNode.left?.type === "MemberExpression" &&
    parentNode.left.property
  ) {
    const property = parentNode.left.property;
    if (property.type === "Identifier") {
      return property.name;
    }
    if (property.type === "StringLiteral") {
      return property.value;
    }
  }

  // 스타일 객체 내부의 속성인 경우 (style={{ backgroundColor: 조건 ? A : B }})
  if (parentParentNode?.type === "Property" && parentParentNode.key) {
    if (parentParentNode.key.type === "Identifier") {
      return parentParentNode.key.name;
    }
    if (parentParentNode.key.type === "StringLiteral") {
      return parentParentNode.key.value;
    }
  }

  // 여기까지 왔다면 속성 이름을 찾지 못한 것
  return undefined;
}
