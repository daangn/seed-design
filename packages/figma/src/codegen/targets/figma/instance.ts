import type { ComponentRepository } from "@/entities";
import type { NormalizedInstanceNode } from "@/normalizer";
import { findOne } from "@/utils/figma-node";
import { camelCase } from "change-case";
import { createElement, defineElementTransformer, type ElementTransformer } from "../../core";

export interface InstanceTransformerDeps {
  frameTransformer: ElementTransformer<NormalizedInstanceNode>;
  componentRepository?: ComponentRepository;
}

export function createInstanceTransformer({
  frameTransformer,
  componentRepository,
}: InstanceTransformerDeps): ElementTransformer<NormalizedInstanceNode> {
  const transform = defineElementTransformer((node: NormalizedInstanceNode, traverse) => {
    const component = componentRepository?.getOne(node.componentSetKey ?? node.componentKey);

    if (component) {
      const slotChildren = Object.entries(node.componentProperties)
        .filter(([_, prop]) => prop.type === "SLOT")
        .map(([key]) =>
          findOne(
            node,
            (child) =>
              child.type === "SLOT" && child.componentPropertyReferences?.slotContentId === key,
          ),
        )
        .filter((slot) => slot != null)
        .map((slot) => traverse(slot))
        .filter((el) => el != null);

      return createElement(
        "Instance",
        {
          componentName: component.name,
          ...Object.fromEntries(
            Object.entries(node.componentProperties)
              .filter(([_, props]) => props.type === "VARIANT" || props.type === "TEXT")
              .map(([key, props]) => [
                camelCase(key.split("#")[0]),
                camelCase(props.value as string),
              ]),
          ),
        },
        slotChildren,
      );
    }

    return frameTransformer(node, traverse);
  });

  return transform;
}
