export const createFigmaLink = ({
  fileKey,
  rootName,
  nodeId,
}: {
  fileKey: string;
  rootName: string;
  nodeId: string;
}) => {
  return `https://www.figma.com/design/${fileKey}/${rootName}?node-id=${nodeId}`;
};
