import { traverseNode } from "@create-figma-plugin/utilities";
import * as changeCase from "change-case";
import { stripBeforeIcon } from "../../shared/utils/string";
import type { ComponentStructure, NodeStructure } from "../mapping/types";

export function getComponentStructure(component: ComponentNode | InstanceNode): ComponentStructure {
  const structure: ComponentStructure = {
    children: {},
  };

  function traverse(node: SceneNode, parentStructure: { [key: string]: NodeStructure }) {
    if (!parentStructure[node.name]) {
      parentStructure[node.name] = {
        type: node.type as NodeType,
      };
    }

    // Text 노드 처리
    if (node.type === "TEXT") {
      parentStructure[node.name] = {
        value: node.characters,
        type: "TEXT",
      };
    }

    // 자식 노드가 있는 경우
    if ("children" in node && node.children.length > 0) {
      parentStructure[node.name].children = {};

      for (const child of node.children) {
        traverse(child, parentStructure[node.name].children!);
      }
    }
  }

  // 최상위 컴포넌트의 자식들을 순회
  for (const child of component.children) {
    traverse(child, structure.children);
  }

  return structure;
}

export async function getComponentSetKey() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("선택된 레이어가 없습니다.", { timeout: 2000 });
    return;
  }

  // { [key: string]: string }
  const result: Record<string, string> = {};

  traverseNode(selection[0], (node) => {
    if (node.type === "COMPONENT_SET") {
      const strippedName = stripBeforeIcon(node.name);
      result[strippedName] = node.key;
    } else if (node.type === "COMPONENT") {
      const strippedName = stripBeforeIcon(node.name);
      result[strippedName] = node.key;
    }
  });

  return result;
}

function getComponentSetInfo(node: ComponentSetNode) {
  const metadata = {
    name: node.name,
    key: node.key,
    componentPropertyDefinitions: removePreferredValues(node.componentPropertyDefinitions),
  };

  // mjs 파일 내용 생성
  const mjsContent = `export const ${changeCase.camelCase(metadata.name)} = ${JSON.stringify(
    metadata,
    null,
    2,
  )};
  `;

  // d.ts 파일 내용 생성
  const dtsContent = `export declare const ${changeCase.camelCase(metadata.name)}: ${JSON.stringify(
    metadata,
    null,
    2,
  )};
  `;

  return {
    fileName: changeCase.kebabCase(metadata.name),
    mjs: mjsContent,
    dts: dtsContent,
  };
}

export async function getSelectedComponentInfo() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("선택된 레이어가 없습니다.", { timeout: 2000 });
    return;
  }
  const result = selection.map(async (node) => {
    const componentInfo = {
      name: node.name,
      key: "" as string,
      componentPropertyDefinitions: {} as ComponentPropertyDefinitions,
      componentProperties: null as ComponentProperties | null,
      oldComponentStructure: null as ComponentStructure | null,
    };

    // 컴포넌트인 경우
    if (node.type === "COMPONENT") {
      componentInfo.key = node.key;
      componentInfo.oldComponentStructure = getComponentStructure(node);
    }
    // 컴포넌트 인스턴스인 경우
    else if (node.type === "INSTANCE") {
      const mainComponent = await node.getMainComponentAsync();
      // componentInfo.componentProperties = node.componentProperties;
      // componentInfo.oldComponentStructure = getComponentStructure(node);
      componentInfo.componentPropertyDefinitions =
        mainComponent?.componentPropertyDefinitions || {};
      componentInfo.key = mainComponent?.key || "";
    } else if (node.type === "COMPONENT_SET") {
      return getComponentSetInfo(node);
    }

    const filteredComponentInfo = removeNullProperties(componentInfo);
    return filteredComponentInfo;
  });

  return await Promise.all(result);
}

function removePreferredValues(obj: Record<string, unknown>) {
  // 배열인 경우 각 요소에 대해 재귀적으로 처리
  if (Array.isArray(obj)) {
    return obj as ComponentPropertyDefinitions;
  }

  // 객체가 아니거나 null인 경우 그대로 반환
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const newObj = { ...obj };

  // preferredValues 키가 있다면 제거
  if ("preferredValues" in newObj) {
    // biome-ignore lint/performance/noDelete: <explanation>
    delete newObj.preferredValues;
  }

  // 객체의 다른 속성들에 대해서도 재귀적으로 처리
  for (const key in newObj) {
    if (typeof newObj[key] === "object" && newObj[key] !== null) {
      newObj[key] = removePreferredValues(newObj[key] as Record<string, unknown>);
    }
  }

  return newObj as ComponentPropertyDefinitions;
}

function removeNullProperties(obj: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== null));
}
