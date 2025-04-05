import { defineComponentTransformer } from "@/codegen/core";
import * as metadata from "../../../data/__generated__/component-sets";
import { createElement } from "../../../core/jsx";
import type { HelpBubbleProperties } from "../properties.type";
import type { SeedComponentTransformerDeps } from "../deps.interface";

export const createHelpBubbleTransformer = (_ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<HelpBubbleProperties>(
    metadata.helpBubble.key,
    ({ componentProperties: props }) => {
      const placement:
        | "top"
        | "right"
        | "bottom"
        | "left"
        | "top-end"
        | "top-start"
        | "right-end"
        | "right-start"
        | "bottom-end"
        | "bottom-start"
        | "left-end"
        | "left-start" = (() => {
        switch (props.Placement.value) {
          case "Bottom-Left":
            return "top-start";
          case "Bottom-Center":
            return "top";
          case "Bottom-Right":
            return "top-end";
          case "Left-Top":
            return "right-start";
          case "Left-Center":
            return "right";
          case "Left-Bottom":
            return "right-end";
          case "Top-Left":
            return "bottom-start";
          case "Top-Center":
            return "bottom";
          case "Top-Right":
            return "bottom-end";
          case "Right-Top":
            return "left-start";
          case "Right-Center":
            return "left";
          case "Right-Bottom":
            return "left-end";
        }
      })();

      const commonProps = {
        title: props["Title#62535:0"].value,
        ...(props["Show Description#62499:0"].value && {
          description: props["Description#62535:98"].value,
        }),
        showCloseButton: props["Show Close Button"].value === "True",
        defaultOpen: true,
        placement,
      };

      return createElement(
        "HelpBubbleTrigger",
        commonProps,
        createElement("ActionButton", undefined, "열기", "HelpBubble을 여는 요소를 제공해주세요."),
      );
    },
  );
