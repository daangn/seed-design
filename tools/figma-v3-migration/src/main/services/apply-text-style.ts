import type { SerializedTextNode, SerializedTextStyle } from "../../shared/types";

export async function applyTextStyles(
  textNodeIds: SerializedTextNode["id"][],
  textStyleId: SerializedTextStyle["id"],
) {
  const promises = textNodeIds.map((textNodeId) => figma.getNodeByIdAsync(textNodeId));

  const nodes = (await Promise.all(promises)).filter(
    (node) => node !== null && node.type === "TEXT",
  );

  for await (const node of nodes) {
    await node.setTextStyleIdAsync(textStyleId);
  }
}
