import type {
  Component,
  ComponentSet,
  ComponentSetNode,
  ComponentNode,
} from "@figma/rest-api-spec";
import { api } from "./client";
import { chunk } from "es-toolkit";

export type ComponentMetadataItem = ComponentNode & Partial<Component>;

export type ComponentSetMetadataItem = ComponentSetNode & Partial<ComponentSet>;

async function getComponentSetsInFile(fileKey: string) {
  const {
    meta: { component_sets },
  } = await api.getFileComponentSets({ file_key: fileKey });

  return component_sets;
}

async function getComponentsInFile(fileKey: string) {
  const {
    meta: { components },
  } = await api.getFileComponents({ file_key: fileKey });

  return components;
}

async function getNodesInFile({ fileKey, nodeIds }: { fileKey: string; nodeIds: string[] }) {
  const chunks = chunk(nodeIds, 500);

  if (chunks.length > 1) {
    console.warn(
      "500개 이상의 레이어의 정보를 찾고 있습니다. 요청을 나눠 보내기 때문에 시간이 오래 걸릴 수 있습니다.",
    );
  }

  const responses = await Promise.all(
    chunks.map((nodeIdsInChunk, index) => {
      console.log(`요청 중... (${index + 1}/${chunks.length})`);

      return api.getFileNodes({ file_key: fileKey }, { ids: nodeIdsInChunk.join(",") });
    }),
  );

  return responses.flatMap(({ nodes }) => Object.values(nodes));
}

export async function getComponentMetadataItemsInFile({
  fileKey,
}: { fileKey: string }): Promise<ComponentMetadataItem[]> {
  const componentsInFile = await getComponentsInFile(fileKey);
  const componentIds = componentsInFile.map(({ node_id }) => node_id);

  const nodes = await getNodesInFile({ fileKey, nodeIds: componentIds });

  const transformed = nodes.map(({ document, components }) => ({
    ...document,
    ...(components[document.id] ?? {}),
  }));

  return transformed.filter((node) => node.type === "COMPONENT");
}

export async function getComponentSetMetadataItemsInFile({
  fileKey,
}: { fileKey: string }): Promise<ComponentSetMetadataItem[]> {
  const componentSetsInFile = await getComponentSetsInFile(fileKey);
  const componentSetIds = componentSetsInFile.map(({ node_id }) => node_id);

  const nodes = await getNodesInFile({ fileKey, nodeIds: componentSetIds });

  const transformed = nodes.map(({ document, componentSets }) => ({
    ...document,
    ...(componentSets[document.id] ?? {}),
  }));

  return transformed.filter((node) => node.type === "COMPONENT_SET");
}
