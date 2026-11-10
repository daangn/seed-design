import { cloneElement, isValidElement, type ReactNode } from "@lynx-js/react";

export function toArray(children: ReactNode): ReactNode[] {
  if (children == null || typeof children === "boolean") {
    return [];
  }

  if (Array.isArray(children)) {
    return children.flatMap(toArray);
  }

  return [children];
}

/**
 * children element 트리를 새로 만든다. 상태를 가진 Provider가 `{children}` 대신 렌더링한다.
 *
 * @lynx-js/react 0.126 미만(Preact 10)은 같은 element를 다시 받으면 context가 바뀐 파트도 건너뛰고
 * 파트마다 따로 렌더링해, 갱신 한 번에 파트 수만큼 Main Thread patch(`callLepusMethod`)를 보낸다.
 * element를 새로 만들면 파트가 Provider와 같은 렌더링에서 함께 갱신된다.
 */
export function renewElements(node: ReactNode): ReactNode {
  if (Array.isArray(node)) return node.map(renewElements);
  if (!isValidElement(node)) return node;
  const { children } = node.props as { children?: ReactNode };
  return children === undefined
    ? cloneElement(node)
    : cloneElement(node, undefined, renewElements(children));
}
