import type { SerializedPaintStyle, SerializedTextStyle } from "../types";
import { getAllTextNodesInSceneNodes } from "../utils/nodes";

export function serializeTextStyle({
  id,
  name,
  fontSize,
  fontName,
  lineHeight,
}: TextStyle): SerializedTextStyle {
  return { id, name, fontSize, fontNameStyle: fontName.style, lineHeight };
}

export function serializePaintStyle({ id, name }: PaintStyle): SerializedPaintStyle {
  return { id, name };
}

/**
 * sceneNode 안의 모든 TextNode의 textStyleId가 availableStyles의 ID들 중 하나로 설정되어 있는지 확인합니다.
 */
export const isAllTextNodesLinkedToTextStyle = (
  sceneNode: SceneNode,
  availableStyles: TextStyle[],
): boolean => {
  // SceneNode
  return getAllTextNodesInSceneNodes([sceneNode]).every((sceneNode) =>
    isTextNodeLinkedToNewTextStyle(sceneNode, availableStyles),
  );
};

const isTextNodeLinkedToNewTextStyle = (textNode: TextNode, availableTextStyles: TextStyle[]) =>
  availableTextStyles.some((style) => style.id === textNode.textStyleId);
