import type { HelpBubbleProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("help-bubble");
const { createLocalSnippetElement: createLocalSnippetElementTrigger } =
  createLocalSnippetHelper("action-button");

export const createHelpBubbleHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<HelpBubbleProperties>(
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
        defaultOpen: true,
        showCloseButton: props["Show Close Button#40538:0"].value,
        placement,
      };

      return createLocalSnippetElement(
        "HelpBubbleTrigger",
        commonProps,
        createLocalSnippetElementTrigger("ActionButton", {}, "HelpBubble 열기"),
        { comment: "필요에 따라 HelpBubbleAnchor로 변경하여 사용하세요." },
      );
    },
  );
