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
        .with("Radio", () => "RadioSelectBoxItem")
        .exhaustive();

      const commonProps = {
        label: props["Label#3635:0"].value,
        ...(props["Show Description#3033:0"].value && {
          description: props["Description #3033:5"].value,
        }),
        ...(tag === "RadioSelectBoxItem" && {
          value: props["Label#3635:0"].value,
        }),
        ...(tag === "CheckSelectBox" &&
          props.Selected.value === "True" && {
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
    (node, traverse) => {
      const props = node.componentProperties;

      const tag = match(props.Control.value)
        .with("Checkbox", () => "CheckSelectBoxGroup")
        .with("Radio", () => "RadioSelectBoxRoot")
        .exhaustive();

      const selectBoxes = findAllInstances<SelectBoxProperties>({
        node,
        key: selectBoxHandler.key,
      });

      const selectedSelectBox = selectBoxes.find((selectBox) =>
        selectBox.componentProperties.Selected.value === "True",
      );

      // traverse the container like it's a frame
      const vStackProps = traverse({ ...node, type: "FRAME" })?.props;

      const stack = createSeedReactElement(
        "VStack",
        vStackProps,
        selectBoxes.map((box) => selectBoxHandler.transform(box, traverse)),
      );

      const commonProps = {
        ...(tag === "RadioSelectBoxRoot" && {
          defaultValue: selectedSelectBox?.componentProperties["Label#3635:0"].value,
        }),
      };

      return createLocalSnippetElement(tag, commonProps, stack);
    },
  );
};
