import type {
  LegacySelectBoxGroupProperties,
  LegacySelectBoxProperties,
} from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import { findAllInstances } from "@/utils/figma-node";
import { match } from "ts-pattern";
import { createLocalSnippetHelper, createSeedReactElement } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("select-box");

const LEGACY_SELECT_BOX_KEY = "38722ffeb4c966256a709155e8ddac50c93d7c60";
const LEGACY_SELECT_BOX_GROUP_KEY = "a3d58bb8540600878742cdcf2608a4b3851667ec";

export const createLegacySelectBoxHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<LegacySelectBoxProperties>(
    LEGACY_SELECT_BOX_KEY,
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

      return createLocalSnippetElement(tag, commonProps, undefined, {
        comment:
          "이 Figma 컴포넌트는 @seed-design/react@1.2보다 낮은 버전의 SelectBox입니다. 신규 컴포넌트로 교체할 수 있습니다.",
      });
    },
  );

export const createLegacySelectBoxGroupHandler = (ctx: ComponentHandlerDeps) => {
  const selectBoxHandler = createLegacySelectBoxHandler(ctx);

  return defineComponentHandler<LegacySelectBoxGroupProperties>(
    LEGACY_SELECT_BOX_GROUP_KEY,
    (node, traverse) => {
      const props = node.componentProperties;

      const tag = match(props.Control.value)
        .with("Checkbox", () => "CheckSelectBoxGroup")
        .with("Radio", () => "RadioSelectBoxRoot")
        .exhaustive();

      const selectBoxes = findAllInstances<LegacySelectBoxProperties>({
        node,
        key: selectBoxHandler.key,
      });

      const selectedSelectBox = selectBoxes.find(
        (selectBox) => selectBox.componentProperties.Selected.value === "True",
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

      return createLocalSnippetElement(tag, commonProps, stack, {
        comment:
          "이 Figma 컴포넌트는 @seed-design/react@1.2보다 낮은 버전의 SelectBox입니다. 신규 컴포넌트로 교체할 수 있습니다.",
      });
    },
  );
};
