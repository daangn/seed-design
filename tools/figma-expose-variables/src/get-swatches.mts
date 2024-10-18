interface GetSwatchesParams {
  inputFrameNames: {
    default?: FrameNode["name"];
    dark?: FrameNode["name"];
  };
}

export function getSwatches({ inputFrameNames }: GetSwatchesParams) {
  const inputFrames = {
    default: figma.currentPage.findOne(
      (node) => node.name === inputFrameNames.default && node.type === "FRAME",
    ) as FrameNode,
    dark: figma.currentPage.findOne(
      (node) => node.name === inputFrameNames.dark && node.type === "FRAME",
    ) as FrameNode,
  };

  return {
    default: inputFrames.default?.children.filter(isValidSwatch) ?? [],
    dark: inputFrames.dark?.children.filter(isValidSwatch) ?? [],
  };
}

function isValidSwatch(node: SceneNode): node is FrameNode {
  return (
    node.type === "FRAME" &&
    node.fills !== figma.mixed &&
    node.fills.every(
      (fill) => fill.type === "SOLID" && fill.boundVariables && fill.boundVariables.color,
    ) &&
    node.children.length === 1 &&
    node.children[0].type === "TEXT"
  );
}
