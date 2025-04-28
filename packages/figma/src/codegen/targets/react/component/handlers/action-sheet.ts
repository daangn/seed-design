import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { camelCase } from "change-case";
import { match } from "ts-pattern";
import type { ComponentHandlerDeps } from "../deps.interface";
import type {
  ActionSheetItemProperties,
  ActionSheetProperties,
} from "@/codegen/component-properties";

const ACTION_SHEET_ITEM_KEY = "c3cafd3a3fdcd45fecb6971019d88eaf39a2e381";
const createActionSheetItemHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ActionSheetItemProperties>(
    ACTION_SHEET_ITEM_KEY,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const commonProps = {
        label: props["Label#15420:4"].value,
        tone: camelCase(props.Tone.value),
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
      };

      return createElement("ActionSheetItem", commonProps);
    },
  );

export const createActionSheetHandler = (ctx: ComponentHandlerDeps) => {
  const actionSheetItemHandler = createActionSheetItemHandler(ctx);

  return defineComponentHandler<ActionSheetProperties>(metadata.actionSheet.key, (node) => {
    const { componentProperties: props } = node;

    const contentProps = match(props.Header.value)
      .with("None", () => ({
        title: undefined,
        description: undefined,
      }))
      .with("Title Only", () => ({
        title: props["Title#15641:37"].value,
        description: undefined,
      }))
      .with("Description Only", () => ({
        title: undefined,
        description: props["Description#15641:70"].value,
      }))
      .with("Title With Description", () => ({
        title: props["Title#15641:37"].value,
        description: props["Description#15641:70"].value,
      }))
      .exhaustive();

    const items = findAllInstances<ActionSheetItemProperties>({
      node,
      key: actionSheetItemHandler.key,
    });

    const contentChildren = items.map(actionSheetItemHandler.transform);

    const content = createElement(
      "ActionSheetContent",
      contentProps,
      contentChildren,
      contentProps.title
        ? ""
        : "title을 제공하지 않는 경우 aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
    );

    const trigger = createElement(
      "ActionSheetTrigger",
      { asChild: true },
      createElement("ActionButton", undefined, "열기", "ActionSheet을 여는 요소를 제공해주세요."),
    );

    return createElement("ActionSheet", undefined, [trigger, content]);
  });
};
