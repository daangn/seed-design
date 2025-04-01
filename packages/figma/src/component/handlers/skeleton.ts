import { camelCase } from "change-case";
import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import { getLayoutVariableName } from "../../props/variable";
import type { SkeletonProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const skeletonHandler: ComponentHandler<SkeletonProperties> = {
  key: metadata.skeleton.key,
  codegen: async ({
    componentProperties: props,
    absoluteBoundingBox,
    layoutSizingHorizontal,
    layoutSizingVertical,
    boundVariables,
  }) => {
    const commonProps = {
      radius: camelCase(props.Radius.value),
      width: (() => {
        switch (layoutSizingHorizontal) {
          case "FIXED": {
            const variableId = boundVariables?.size?.x?.id;
            if (variableId) return getLayoutVariableName(variableId);

            return `${absoluteBoundingBox?.width}px`;
          }
          case "FILL":
            return "full";
          default:
            return "full";
        }
      })(),
      height: (() => {
        switch (layoutSizingVertical) {
          case "FIXED": {
            const variableId = boundVariables?.size?.y?.id;
            if (variableId) return getLayoutVariableName(variableId);

            return `${absoluteBoundingBox?.height}px`;
          }
          case "FILL":
            return "full";
          default:
            return "full";
        }
      })(),
    };

    return createElement("Skeleton", commonProps);
  },
};
