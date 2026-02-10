import type { InstanceInfo, SwapResult } from "../../shared/types";
import { getTopmostComponent } from "../../shared/utils/nodes";
import * as newComponents from "../data/__generated__/v3-component-sets";
import componentMappings from "../mapping";
import type { ComponentMapping, ComponentMetadata } from "../mapping/types";
import { getComponentStructure } from "./get-selected-info";

interface VariantProperties {
  Size?: string;
  State?: string;
  Variant?: string;
  Layout?: string;
  [key: string]: string | undefined;
}

export type CapturedInstance = {
  // oldProperties: ComponentProperties;
  // newComponentName: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  newProperties: Record<string, any>;
};

export type ComponentInstances = {
  [newComponentName: string]: CapturedInstance[];
};

function findFirstImagePaintNode(node: SceneNode): SceneNode | null {
  if ("fills" in node && node.fills !== figma.mixed) {
    const fills = node.fills;
    if (fills.some((paint) => paint.type === "IMAGE")) {
      return node;
    }
  }

  if ("children" in node) {
    for (const child of node.children) {
      const found = findFirstImagePaintNode(child);
      if (found) return found;
    }
  }

  return null;
}

function getImagePaints(node: SceneNode): Paint[] | null {
  const imageNode = findFirstImagePaintNode(node);
  if (!imageNode || !("fills" in imageNode)) return null;

  const fills = imageNode.fills;
  if (fills === figma.mixed) return null;
  if (!fills.some((paint) => paint.type === "IMAGE")) return null;

  return fills.map((paint) => ({ ...paint }));
}

// 컴포넌트의 구조를 캡처
function captureInstances(
  node: SceneNode,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  childrenMappings: ComponentMapping<any, any>[],
): ComponentInstances {
  const instances: ComponentInstances = {};

  function traverse(currentNode: SceneNode) {
    if (currentNode.type === "INSTANCE") {
      const oldComponentName = currentNode.name;

      // 현재 인스턴스에 대한 매핑 전체 탐색
      const mappings = childrenMappings.filter((m) => m.oldComponent === oldComponentName);

      if (mappings.length > 0) {
        for (const mapping of mappings) {
          const newComponentName = mapping.newComponent;

          // 새로운 properties 미리 계산
          const newProperties = mapping.calculateProperties(currentNode.componentProperties);

          if (!instances[newComponentName]) {
            instances[newComponentName] = [];
          }

          instances[newComponentName].push({
            newProperties,
          });
        }
      }
    }

    if ("children" in currentNode) {
      currentNode.children.forEach(traverse);
    }
  }

  traverse(node);
  return instances;
}

/**
 * variant 문자열을 객체로 파싱
 */
function parseVariantString(variantString: string): VariantProperties {
  return variantString.split(", ").reduce((acc, curr) => {
    const [key, value] = curr.split("=");
    acc[key] = value;
    return acc;
  }, {} as VariantProperties);
}

/**
 * 두 variant가 동일한지 비교
 */
function compareVariants(variant1: string, variant2: string): boolean {
  const props1 = parseVariantString(variant1);
  const props2 = parseVariantString(variant2);

  const keys = new Set([...Object.keys(props1), ...Object.keys(props2)]);

  return Array.from(keys).every((key) => props1[key] === props2[key]);
}

/**
 * variant 객체를 문자열로 변환
 */
function createVariantString(variants: VariantProperties): string {
  return Object.entries(variants)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join(", ");
}

// 새 구조를 순회하면서 인스턴스를 찾아 프로퍼티 마이그레이션
function migrateChildren(newInstance: SceneNode, capturedInstances: ComponentInstances): void {
  if (newInstance.type === "INSTANCE") {
    const componentName = newInstance.name;
    const captured = capturedInstances[componentName]?.shift();

    if (captured) {
      newInstance.setProperties(captured.newProperties);
    }
  }

  if ("children" in newInstance) {
    for (const child of newInstance.children) {
      migrateChildren(child, capturedInstances);
    }
  }
}

/**
 * variant 배열에서 매칭되는 variant 찾기
 */
function findMatchingVariant(
  targetVariant: string,
  availableVariants: string[],
): string | undefined {
  return availableVariants.find((variant) => compareVariants(targetVariant, variant));
}

/**
 * 자동 매핑된 variant와 수동 선택된 variant를 병합
 */
function mergeVariants(
  baseVariants: Record<string, string>,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  mapping: ComponentMapping<any, any>,
  instanceId: string,
  selectedVariants: Record<string, string>,
  oldInstance: InstanceNode,
  newComponentInfo: ComponentMetadata,
): Record<string, string> {
  // 1. variantMap으로부터의 기본 variants
  const mergedVariants = { ...baseVariants };

  // 2. calculateProperties에서 계산된 variants
  const oldComponentStructure = getComponentStructure(oldInstance);
  const calculatedProperties = mapping.calculateProperties(
    oldInstance.componentProperties,
    oldComponentStructure,
  );

  // calculateProperties 결과에서 VARIANT 타입 프로퍼티 추출
  for (const [key, value] of Object.entries(calculatedProperties)) {
    if (newComponentInfo.componentPropertyDefinitions[key]?.type === "VARIANT") {
      mergedVariants[key] = value as string;
    }
  }

  // 3. 수동 선택된 variants
  if (mapping.swappableVariants) {
    for (const swappable of mapping.swappableVariants) {
      const selectedVariantKey = `${instanceId}:${swappable.oldVariant}`;
      const selectedNewVariant = selectedVariants[selectedVariantKey];

      if (selectedNewVariant) {
        const [propKey, propValue] = selectedNewVariant.split(":");
        mergedVariants[propKey] = propValue;
      }
    }
  }

  return mergedVariants;
}

export async function swapComponent(
  instanceNode: InstanceInfo,
  selectedVariants: Record<string, string> = {},
): Promise<SwapResult> {
  try {
    // 현재 인스턴스 노드 가져오기
    const oldInstance = (await figma.getNodeByIdAsync(instanceNode.id)) as InstanceNode;
    if (!oldInstance) {
      return {
        [instanceNode.id]: {
          ok: false,
          errorMessage: "인스턴스 노드를 찾을 수 없어요.",
        },
      };
    }

    // 최상위 컴포넌트 찾기
    const topmostOldComponent = await getTopmostComponent(oldInstance);
    if (!topmostOldComponent) {
      return {
        [instanceNode.id]: {
          ok: false,
          errorMessage: "상위 컴포넌트를 찾을 수 없어요.",
          metadata: {
            oldInstanceId: oldInstance.id,
            oldInstanceName: oldInstance.name,
          },
        },
      };
    }

    // 매핑 정보 찾기
    const mapping = componentMappings.find((m) => m.oldComponent === topmostOldComponent.name);
    if (!mapping) {
      return {
        [instanceNode.id]: {
          ok: false,
          errorMessage: `맵핑이 없어요: ${topmostOldComponent.name}`,
          metadata: {
            oldInstanceName: oldInstance.name,
            oldInstanceId: oldInstance.id,
            oldComponentName: topmostOldComponent.name,
          },
        },
      };
    }

    const capturedInstances = captureInstances(oldInstance, mapping.childrenMappings ?? []);
    const oldImagePaints =
      mapping.newComponent === "Image Frame" ? getImagePaints(oldInstance) : null;

    // 새 컴포넌트 정보 찾기
    const newComponentInfo = Object.values(newComponents).find(
      (c) => c.name === mapping.newComponent,
    );
    if (!newComponentInfo) {
      return {
        [instanceNode.id]: {
          ok: false,
          errorMessage: "새 컴포넌트 정보를 찾을 수 없어요.",
          metadata: {
            oldInstanceId: oldInstance.id,
            oldInstanceName: oldInstance.name,
            oldComponentName: topmostOldComponent.name,
            oldComponentId: topmostOldComponent.id,
          },
        },
      };
    }

    // 새 컴포넌트 세트 가져오기
    const newComponentSet = await figma.importComponentSetByKeyAsync(newComponentInfo.key);
    if (!newComponentSet) {
      return {
        [instanceNode.id]: {
          ok: false,
          errorMessage: "새 ComponentSet을 가져올 수 없어요.",
          metadata: {
            oldInstanceId: oldInstance.id,
            oldInstanceName: oldInstance.name,
            oldComponentName: topmostOldComponent.name,
            oldComponentId: topmostOldComponent.id,
            newComponentName: newComponentInfo.name,
            newComponentKey: newComponentInfo.key,
          },
        },
      };
    }

    // 현재 variant 속성을 변환
    const oldVariants = oldInstance.variantProperties ?? {};
    const baseVariants = convertVariants(oldVariants, mapping);
    const newVariants = mergeVariants(
      baseVariants,
      mapping,
      instanceNode.id,
      selectedVariants,
      oldInstance,
      newComponentInfo,
    );

    // variant 문자열 생성
    const targetVariantString = createVariantString(newVariants);

    // 사용 가능한 variant 목록 가져오기
    const availableVariants = newComponentSet.children.map((child) => child.name);

    // 매칭되는 variant 찾기
    const matchingVariant = findMatchingVariant(targetVariantString, availableVariants);
    if (!matchingVariant) {
      return {
        [instanceNode.id]: {
          ok: false,
          errorMessage: `매칭되는 variant를 찾을 수 없어요: ${targetVariantString}`,
          metadata: {
            oldInstanceId: oldInstance.id,
            oldInstanceName: oldInstance.name,
            oldComponentName: topmostOldComponent.name,
            oldComponentId: topmostOldComponent.id,
            newComponentName: newComponentSet.name,
            newComponentKey: newComponentInfo.key,
            oldVariants: targetVariantString,
            newVariants: matchingVariant,
            oldProperties: oldInstance.componentProperties,
          },
        },
      };
    }

    // 새 컴포넌트 찾기
    const newComponent = newComponentSet.findChild(
      (node) => node.name === matchingVariant,
    ) as ComponentNode;
    if (!newComponent) {
      return {
        [instanceNode.id]: {
          ok: false,
          errorMessage: "해당하는 variant의 컴포넌트를 찾을 수 없어요.",
          metadata: {
            oldInstanceId: oldInstance.id,
            oldInstanceName: oldInstance.name,
            oldComponentName: topmostOldComponent.name,
            oldComponentId: topmostOldComponent.id,
            newComponentName: newComponentSet.name,
            newComponentKey: newComponentInfo.key,
            oldVariants: targetVariantString,
            newVariants: matchingVariant,
            oldProperties: oldInstance.componentProperties,
          },
        },
      };
    }

    const oldComponentStructure = getComponentStructure(oldInstance);

    // 새로운 프로퍼티 계산
    const newProperties = mapping.calculateProperties(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      oldInstance.componentProperties as any,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      oldComponentStructure as any,
    );

    // 컴포넌트 교체 및 프로퍼티 적용
    oldInstance.swapComponent(newComponent);
    oldInstance.setProperties(newProperties);

    if (oldImagePaints) {
      const newImageNode = findFirstImagePaintNode(oldInstance);
      if (newImageNode && "fills" in newImageNode && newImageNode.fills !== figma.mixed) {
        newImageNode.fills = oldImagePaints;
      }
    }

    const childrenMappings = mapping.childrenMappings;
    if (childrenMappings) {
      migrateChildren(oldInstance, capturedInstances);
    }

    return {
      [instanceNode.id]: {
        ok: true,
        metadata: {
          oldComponentName: topmostOldComponent.name,
          oldComponentId: oldInstance.id,
          newComponentName: newComponentSet.name,
          newComponentId: newComponent.id,
          oldVariants: targetVariantString,
          newVariants: matchingVariant,
        },
      },
    };
  } catch (error) {
    console.error("Component swap error:", error);
    return {
      [instanceNode.id]: {
        ok: false,
        errorMessage: (error as Error).message,
        metadata: {
          instanceId: instanceNode.id,
          instanceName: instanceNode.name,
        },
      },
    };
  }
}

// 컴포넌트의 기본 variant 값을 추출하는 헬퍼 함수
function getDefaultVariants(componentName: string): Record<string, string> {
  const component = Object.values(newComponents).find((c) => c.name === componentName);
  if (!component) return {};

  return Object.entries(component.componentPropertyDefinitions)
    .filter(([_, def]) => def.type === "VARIANT")
    .reduce(
      (acc, [key, def]) => {
        acc[key] = def.defaultValue;
        return acc;
      },
      {} as Record<string, string>,
    );
}

function convertVariants(
  oldVariants: Record<string, string>,
  mapping: (typeof componentMappings)[number],
): Record<string, string> {
  // 1. 기본값으로 시작
  const newVariants = getDefaultVariants(mapping.newComponent);

  // 2. 매핑된 variant 적용
  for (const [key, value] of Object.entries(oldVariants)) {
    const oldKey = `${key}:${value}`;
    if (!mapping.variantMap) continue;
    const newKey = mapping.variantMap[oldKey as keyof typeof mapping.variantMap] as string;

    if (newKey) {
      const [propKey, propValue] = newKey.split(":");
      newVariants[propKey as keyof typeof newVariants] = propValue as never;
    }
  }
  return newVariants;
}
