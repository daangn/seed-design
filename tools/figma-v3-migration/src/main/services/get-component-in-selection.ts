import * as oldComponents from "../data/__generated__/v2-component-sets";
import * as newComponents from "../data/__generated__/v3-component-sets";
import * as oldCompatComponents from "../data/__generated__/v2-compat-component-sets";
import { getTopmostComponent } from "../../shared/utils/nodes";
import type { InstanceInfo } from "../../shared/types";

const oldComponentKeys = Object.values(oldComponents).map((component) => component.key) as string[];
const newComponentKeys = Object.values(newComponents).map((component) => component.key) as string[];
const oldCompatComponentKeys = Object.values(oldCompatComponents).map(
  (component) => component.key,
) as string[];

interface GetComponentInSceneNodesOptions {
  nodeIds: SceneNode["id"][];
}

export async function getComponentInSelection({ nodeIds }: GetComponentInSceneNodesOptions) {
  const promises = nodeIds.map((nodeId) => figma.getNodeByIdAsync(nodeId));

  const nodes = (await Promise.all(promises)).filter(
    (node) => node !== null && node.type !== "DOCUMENT",
  ) as SceneNode[];

  const instanceNodes: InstanceNode[] = [];
  for (const sceneNode of nodes) {
    const nodes = getTopLevelInstanceNodes(sceneNode);
    instanceNodes.push(...nodes);
  }

  const filteredInstanceInfos: InstanceInfo[] = [];
  for (const instanceNode of instanceNodes) {
    const mainComponent = await getTopmostComponent(instanceNode);
    if (!mainComponent) {
      continue;
    }
    const key = mainComponent?.key;
    if (oldComponentKeys.includes(key)) {
      const node: InstanceInfo = {
        id: instanceNode.id,
        name: instanceNode.name,
        key,
        componentProperties: instanceNode.componentProperties,
        version: "v2",
      };
      filteredInstanceInfos.push(node);
    } else if (newComponentKeys.includes(key)) {
      const node: InstanceInfo = {
        id: instanceNode.id,
        name: instanceNode.name,
        key,
        componentProperties: instanceNode.componentProperties,
        version: "v3",
      };
      filteredInstanceInfos.push(node);
    } else if (oldCompatComponentKeys.includes(key)) {
      const node: InstanceInfo = {
        id: instanceNode.id,
        name: instanceNode.name,
        key,
        componentProperties: instanceNode.componentProperties,
        version: "v2",
      };
      filteredInstanceInfos.push(node);
    }
  }

  return filteredInstanceInfos;
}

function getTopLevelInstanceNodes(sceneNode: SceneNode) {
  // 현재 노드가 INSTANCE이면서 부모가 INSTANCE가 아닌 경우 바로 반환
  if (sceneNode.type === "INSTANCE") {
    return [sceneNode];
  }

  // FRAME, GROUP 등 자식을 가질 수 있는 노드인 경우
  if ("children" in sceneNode) {
    const instanceNodes: InstanceNode[] = [];
    for (const child of sceneNode.children) {
      instanceNodes.push(...getTopLevelInstanceNodes(child));
    }
    return instanceNodes;
  }

  return [];
}
