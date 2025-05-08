import type { SelectBoxGroupProperties, SelectBoxProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { match } from "ts-pattern";
import { createLocalSnippetHelper, createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("select-box");

export const createSelectBoxHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<SelectBoxProperties>(
    metadata.selectBox.key,
    ({ componentProperties: props }) => {
      const tag = match(props.Control.value)
        .with("Checkbox", () => "CheckSelectBox")
        .with("Radio", () => "RadioSelectBox")
        .exhaustive();

      const states = props.State.value.split("-");

      const commonProps = {
        label: props["Label#3635:0"].value,
        ...(props["Show Description#3033:0"].value && {
          description: props["Description #3033:5"].value,
        }),
        ...(tag === "RadioSelectBox" && {
          value: props["Label#3635:0"].value,
        }),
        ...(tag === "CheckSelectBox" &&
          states.includes("Selected") && {
            defaultChecked: true,
          }),
      };

      return createLocalSnippetElement(tag, commonProps);
    },
  );

export const createSelectBoxGroupHandler = (ctx: ComponentHandlerDeps) => {
  const selectBoxHandler = createSelectBoxHandler(ctx);

  return defineComponentHandler<SelectBoxGroupProperties>(
    metadata.templateSelectBoxGroup.key,
    (node) => {
      const props = node.componentProperties;

      const tag = match(props.Control.value)
        .with("Checkbox", () => "CheckSelectBoxGroup")
        .with("Radio", () => "RadioSelectBoxGroup")
        .exhaustive();

      const selectBoxes = findAllInstances<SelectBoxProperties>({
        node,
        key: selectBoxHandler.key,
      });

      const selectedSelectBox = selectBoxes.find((selectBox) =>
        selectBox.componentProperties.State.value.split("-").includes("Selected"),
      );

      const stack = createSeedReactElement(
        "Stack",
        { gap: "spacingY.componentDefault" },
        selectBoxes.map(selectBoxHandler.transform),
      );

      const commonProps = {
        ...(tag === "RadioSelectBoxGroup" && {
          defaultValue: selectedSelectBox?.componentProperties["Label#3635:0"].value,
        }),
      };

      return createLocalSnippetElement(tag, commonProps, stack);
    },
  );
};
