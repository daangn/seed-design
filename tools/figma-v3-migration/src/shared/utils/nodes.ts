import {
  CORNER_RADIUS_VARIABLE_BINDABLE_NODE_FIELDS,
  LAYOUT_VARIABLE_BINDABLE_NODE_FIELDS,
  SIZING_VARIABLE_BINDABLE_NODE_FIELDS,
  STROKE_WEIGHT_VARIABLE_BINDABLE_NODE_FIELDS,
} from "../constants";
import type { SerializedInstanceNode, SerializedBaseNode, SerializedTextNode } from "../types";
import { traverseNode } from "./traverse";

/**
 * 자체 속성 혹은 부모 노드의 속성을 통해 숨겨진 노드인지 확인합니다.
 */
export const isHidden = (node: SceneNode): boolean => {
  if (node.visible === false) return true;

  const parentNode = node.parent;

  if (parentNode === null || parentNode.type === "DOCUMENT" || parentNode.type === "PAGE")
    return false;

  return isHidden(parentNode);
};

/**
 * node가 디자인시스템 컴포넌트 내에 있는지 확인합니다.
 * 디자인시스템 컴포넌트가 발견될 때까지 가장 가까운 인스턴스에 대해 `getTopmostComponent를` 수행합니다.
 * 컴포넌트의 key가 KEYS_TO_EXCLUDE에 포함되어 있는 경우 true를 반환합니다.
 * 포함되어 있지 않으면 다음으로 가까운 인스턴스에 대해 getTopmostComponent를 호출하며 parent 노드가 없을 때까지 반복합니다.
 * 페이지 노드에 도달할 때까지 디자인시스템 컴포넌트의 인스턴스가 발견되지 않으면 false를 반환합니다.
 * @param param.excludeMonochromeIcons - true일 경우 모노크롬 아이콘 컴포넌트에 대해 false를 반환합니다.
 */
export async function isNodeWithinSystemComponents({
  node,
  excludeMonochromeIcons,
  systemComponentKeys,
}: {
  node: SceneNode;
  excludeMonochromeIcons?: boolean;
  systemComponentKeys: string[];
}): Promise<boolean> {
  let nodeToInspect: SceneNode | PageNode = node as SceneNode | PageNode;

  while (nodeToInspect.type !== "PAGE") {
    if (nodeToInspect.type === "INSTANCE") {
      const component = await getTopmostComponent(nodeToInspect);

      if (component && systemComponentKeys.includes(component.key)) {
        if (excludeMonochromeIcons && isSystemComponentMonochromeIcon(component)) return false;

        return true;
      }
    }

    if (
      nodeToInspect.parent === null ||
      nodeToInspect.parent.type === "PAGE" ||
      nodeToInspect.parent.type === "DOCUMENT"
    )
      break;

    nodeToInspect = nodeToInspect.parent;
  }

  return false;
}

export function isSystemComponentMonochromeIcon(componentNode: ComponentNode | ComponentSetNode) {
  if (
    "Weight" in componentNode.componentPropertyDefinitions &&
    componentNode.componentPropertyDefinitions.Weight.type === "VARIANT" &&
    componentNode.componentPropertyDefinitions.Weight.variantOptions?.length === 2
  )
    return true;

  return false;
}

/**
 * sceneNode가 referenceSceneNode 내에 있으면 true를 반환합니다.
 */
export function isSceneNodeWithinReferenceSceneNode(
  sceneNode: SceneNode,
  referenceSceneNode: SceneNode,
): boolean {
  if (sceneNode.id === referenceSceneNode.id) return true;

  const parent = sceneNode.parent;

  if (parent === null || parent.type === "DOCUMENT" || parent.type === "PAGE") return false;

  return isSceneNodeWithinReferenceSceneNode(parent, referenceSceneNode);
}

/**
 * sceneNodes 중 하나라도 referenceSceneNodes 내에 있으면 true를 반환합니다.
 */
export function areSceneNodesWithinReferenceSceneNodes(
  sceneNodes: SceneNode[],
  referenceSceneNodes: SceneNode[],
): boolean {
  return sceneNodes.some((sceneNode) =>
    referenceSceneNodes.some((referenceSceneNode) =>
      isSceneNodeWithinReferenceSceneNode(sceneNode, referenceSceneNode),
    ),
  );
}

/**
 * SceneNode가 속한 가장 가까운 InstanceNode를 찾아 반환합니다.
 */
export function getClosestInstanceNode(node: SceneNode): InstanceNode | null {
  const parentNode = node.parent;

  if (parentNode === null || parentNode.type === "DOCUMENT" || parentNode.type === "PAGE")
    return null;

  if (parentNode.type === "INSTANCE") return parentNode;

  return getClosestInstanceNode(parentNode);
}

/**
 * sceneNode[]에서 모든 TextNode를 찾아 반환합니다.
 */
export function getAllTextNodesInSceneNodes(sceneNodes: SceneNode[], includeHidden = false) {
  const textNodes: TextNode[] = [];

  for (const sceneNode of sceneNodes) {
    if ("findAllWithCriteria" in sceneNode) {
      const found = sceneNode
        .findAllWithCriteria({ types: ["TEXT"] })
        .filter((node) => !includeHidden || !isHidden(node));

      textNodes.push(...found);

      continue;
    }

    traverseNode(sceneNode, (node) => {
      if (node.type !== "TEXT") return;
      if (!includeHidden && isHidden(node)) return;

      textNodes.push(node);
    });
  }

  return textNodes;
}

const COLOR_VARIABLE_BINDABLE_NODE_TYPES = [
  "BOOLEAN_OPERATION",
  "COMPONENT",
  "COMPONENT_SET",
  "CONNECTOR",
  "ELLIPSE",
  "FRAME",
  "GROUP",
  "HIGHLIGHT",
  "INSTANCE",
  "LINE",
  "POLYGON",
  "RECTANGLE",
  "SECTION",
  "SHAPE_WITH_TEXT",
  "STAMP",
  "STAR",
  "STICKY",
  "TABLE",
  "TEXT",
  "VECTOR",
  "WASHI_TAPE",
] as const satisfies SceneNode["type"][];

/**
 * sceneNode[]에서 색상 Variable을 사용할 수 있는 프로퍼티(fills, strokes, effects)가 적어도 하나 있는 모든 노드를 찾아 반환합니다.
 */
export function getAllColorVariableBindableNodesInSceneNodes(
  sceneNodes: SceneNode[],
  includeHidden = false,
) {
  const variableColorableNodes: SceneNode[] = [];

  for (const sceneNode of sceneNodes) {
    if ("findAllWithCriteria" in sceneNode) {
      const found = sceneNode
        .findAllWithCriteria({
          types: COLOR_VARIABLE_BINDABLE_NODE_TYPES,
        })
        .filter((node) => {
          if (!includeHidden && isHidden(node)) return false;

          if (node.type === "VECTOR" && node.parent?.type === "BOOLEAN_OPERATION") return false;

          return true;
        });

      variableColorableNodes.push(...found);

      if (COLOR_VARIABLE_BINDABLE_NODE_TYPES.includes(sceneNode.type as any)) {
        variableColorableNodes.push(sceneNode);
      }

      continue;
    }

    traverseNode(sceneNode, (node) => {
      if ("fills" in node || "strokes" in node || "effects" in node) {
        if (!includeHidden && isHidden(node)) return;

        // 벡터인데, 부모에서 묶어준 경우는 제외. 부모에서 색상 지정하는 것을 권장
        if (node.type === "VECTOR" && node.parent?.type === "BOOLEAN_OPERATION") return;

        variableColorableNodes.push(node);
      }
    });
  }

  return variableColorableNodes;
}

/**
 * sceneNode[]에서 unit variable을 사용할 수 있는 sizing 프로퍼티(width, height, minWidth, ...)가 적어도 하나 있는 모든 노드를 찾아 반환합니다.
 */
export function getAllSizingVariableBindableNodesInSceneNodes(
  sceneNodes: SceneNode[],
  includeHidden = false,
) {
  const sizingVariableBindableNodes: SceneNode[] = [];

  for (const sceneNode of sceneNodes) {
    traverseNode(sceneNode, (node) => {
      if (SIZING_VARIABLE_BINDABLE_NODE_FIELDS.some((field) => field in node)) {
        if (!includeHidden && isHidden(node)) return;

        sizingVariableBindableNodes.push(node);
      }
    });
  }

  return sizingVariableBindableNodes;
}

/**
 * sceneNode[]에서 unit variable을 사용할 수 있는 layout 프로퍼티(paddingLeft, itemSpacing, ...)가 적어도 하나 있는 모든 노드를 찾아 반환합니다.
 */
export function getAllLayoutVariableBindableNodesInSceneNodes(
  sceneNodes: SceneNode[],
  includeHidden = false,
) {
  const layoutVariableBindableNodes: SceneNode[] = [];

  for (const sceneNode of sceneNodes) {
    traverseNode(sceneNode, (node) => {
      if (LAYOUT_VARIABLE_BINDABLE_NODE_FIELDS.some((field) => field in node)) {
        if (!includeHidden && isHidden(node)) return;

        layoutVariableBindableNodes.push(node);
      }
    });
  }

  return layoutVariableBindableNodes;
}

/**
 * sceneNode[]에서
 * - stroke width variable을 사용할 수 있는 stroke 프로퍼티(strokeLeftWeight, ...)가 적어도 하나 있는 모든 노드와
 * - corner radius variable을 사용할 수 있는 cornerRadius 프로퍼티 (topLeftRadius, ...)가 적어도 하나 있는 모든 노드를 찾아 반환합니다.
 */
export function getAllStrokeWeightOrCornerRadiusVariableBindableNodesInSceneNodes(
  sceneNodes: SceneNode[],
  includeHidden = false,
) {
  const strokeWeightOrCornerRadiusVariableBindableNodes: SceneNode[] = [];
  const fields = [
    ...STROKE_WEIGHT_VARIABLE_BINDABLE_NODE_FIELDS,
    ...CORNER_RADIUS_VARIABLE_BINDABLE_NODE_FIELDS,
  ];

  for (const sceneNode of sceneNodes) {
    traverseNode(sceneNode, (node) => {
      if (fields.some((field) => field in node)) {
        if (!includeHidden && isHidden(node)) return;

        strokeWeightOrCornerRadiusVariableBindableNodes.push(node);
      }
    });
  }

  return strokeWeightOrCornerRadiusVariableBindableNodes;
}

/**
 * instance의 원본 컴포넌트를 가져옵니다. ComponentSet에 속한 경우 ComponentSet을 반환합니다.
 */
export async function getTopmostComponent(instance: InstanceNode) {
  const component = await instance.getMainComponentAsync();

  if (component === null) return;

  let topmostComponent: ComponentSetNode | ComponentNode = component;

  // variant가 있는 경우 component set을 줘야 함
  if (component.parent && component.parent.type === "COMPONENT_SET") {
    topmostComponent = component.parent;
  }

  return topmostComponent;
}

export function serializeTextNode({
  id,
  name,
  characters,
  fontSize,
  fontWeight,
  lineHeight,
}: TextNode): SerializedTextNode {
  return {
    id,
    name,
    characters,
    fontSize: fontSize === figma.mixed ? null : fontSize,
    fontWeight: fontWeight === figma.mixed ? null : fontWeight,
    lineHeight: lineHeight === figma.mixed ? null : lineHeight,
  };
}

export function serializeInstanceNode({ id, name }: InstanceNode): SerializedInstanceNode {
  return { id, name };
}

export function serializeBaseNode(node: BaseNode): SerializedBaseNode {
  const { id, name, type } = node;

  return {
    id,
    name,
    type,
    ...(type === "TEXT" && { characters: node.characters }),
  };
}
