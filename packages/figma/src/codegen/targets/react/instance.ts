import type { NormalizedInstanceNode } from "@/normalizer";
import {
  defineElementTransformer,
  type ComponentHandler,
  type ElementTransformer,
} from "../../core";
import { createSeedReactElement } from "./element-factories";
import type { IconHandler } from "./icon";
import type { PropsConverters } from "./props";

const OVERRIDE_ACCEPTABLE_PROPERTIES: Set<NodeChangeProperty> = new Set([
  "characters",
  "parent",
  "locked",
  "visible",
  "name",
  "x",
  "y",
  "componentProperties",
  "componentPropertyDefinitions",
  "componentPropertyReferences",
] satisfies NodeChangeProperty[]);

export interface InstanceTransformerDeps {
  iconHandler?: IconHandler;
  propsConverters: PropsConverters;
  componentHandlers: Record<string, ComponentHandler>;
  frameTransformer: ElementTransformer<NormalizedInstanceNode>;
}

export function createInstanceTransformer({
  iconHandler,
  propsConverters,
  componentHandlers,
  frameTransformer,
}: InstanceTransformerDeps): ElementTransformer<NormalizedInstanceNode> {
  const transform = defineElementTransformer((node: NormalizedInstanceNode, traverse) => {
    const { componentKey, componentSetKey } = node;

    if (iconHandler?.isIconInstance(node)) {
      const props = {
        ...propsConverters.iconSelfLayout(node),
        ...propsConverters.vectorChildrenFill(node),
      };
      return createSeedReactElement("Icon", { svg: iconHandler.transform(node), ...props });
    }

    const componentHandler = componentSetKey
      ? componentHandlers[componentSetKey]
      : componentHandlers[componentKey];

    if (componentHandler) {
      const handled = componentHandler.transform(node, traverse);

      if (node.overrides && node.overrides.length > 0) {
        const overriddenFields = node.overrides
          .flatMap(({ overriddenFields }) => overriddenFields)
          .filter(
            (field) => OVERRIDE_ACCEPTABLE_PROPERTIES.has(field as NodeChangeProperty) === false,
          );

        if (overriddenFields.length === 0) {
          return handled;
        }

        return {
          ...handled,
          meta: {
            ...handled.meta,
            comment: `${handled.meta.comment ? `${handled.meta.comment} ` : ""}오버라이드된 필드: ${Array.from(new Set(overriddenFields)).join(", ")}`,
          },
        };
      }

      return handled;
    }

    return frameTransformer(node, traverse);
  });

  return transform;
}
