import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import type { SeedComponentHandlerDeps } from "../deps.interface";
import type { SkeletonProperties } from "@/codegen/component-properties";

export const createSkeletonHandler = (ctx: SeedComponentHandlerDeps) =>
  defineComponentHandler<SkeletonProperties>(
    metadata.skeleton.key,
    ({
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
              if (variableId) return ctx.variableService.getVariableName(variableId);

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
              if (variableId) return ctx.variableService.getVariableName(variableId);

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
  );
