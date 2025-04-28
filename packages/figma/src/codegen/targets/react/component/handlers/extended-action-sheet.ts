import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { camelCase } from "change-case";
import type { SeedComponentHandlerDeps } from "../deps.interface";
import type {
  ExtendedActionSheetGroupProperties,
  ExtendedActionSheetItemProperties,
  ExtendedActionSheetProperties,
} from "@/codegen/component-properties";

const EXTENDED_ACTION_SHEET_ITEM_KEY = "057083e95466da59051119eec0b41d4ad5a07f8f";
const createExtendedActionSheetItemHandler = (ctx: SeedComponentHandlerDeps) =>
  defineComponentHandler<ExtendedActionSheetItemProperties>(
    EXTENDED_ACTION_SHEET_ITEM_KEY,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const commonProps = {
        tone: camelCase(props.Tone.value),
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
      };

      return createElement("ExtendedActionSheetItem", commonProps, [
        props["Show Prefix Icon#17043:5"].value
          ? createElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Prefix Icon#55948:0"]),
            })
          : undefined,
        props["Label#55905:8"].value,
      ]);
    },
  );

const EXTENDED_ACTION_SHEET_GROUP_KEY = "2a504a1c6b7810d5e652862dcba2cb7048f9eb16";
const createExtendedActionSheetGroupHandler = (ctx: SeedComponentHandlerDeps) => {
  const extendedActionSheetItemHandler = createExtendedActionSheetItemHandler(ctx);

  return defineComponentHandler<ExtendedActionSheetGroupProperties>(
    EXTENDED_ACTION_SHEET_GROUP_KEY,
    (node) => {
      const items = findAllInstances<ExtendedActionSheetItemProperties>({
        node,
        key: extendedActionSheetItemHandler.key,
      });

      const contentChildren = items.map(extendedActionSheetItemHandler.transform);

      return createElement("ExtendedActionSheetGroup", undefined, contentChildren);
    },
  );
};

export const createExtendedActionSheetHandler = (ctx: SeedComponentHandlerDeps) => {
  const extendedActionSheetGroupHandler = createExtendedActionSheetGroupHandler(ctx);

  return defineComponentHandler<ExtendedActionSheetProperties>(
    metadata.extendedActionSheet.key,
    (node) => {
      const { componentProperties: props } = node;

      const groups = findAllInstances<ExtendedActionSheetGroupProperties>({
        node,
        key: extendedActionSheetGroupHandler.key,
      });

      const contentChildren = groups.map(extendedActionSheetGroupHandler.transform);

      const title = props["Show Title#17043:12"].value ? props["Title#14599:0"].value : undefined;

      const content = createElement(
        "ExtendedActionSheetContent",
        { title },
        contentChildren,
        title
          ? undefined
          : "title을 제공하지 않는 경우 aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
      );

      const trigger = createElement(
        "ExtendedActionSheetTrigger",
        { asChild: true },
        createElement(
          "ActionButton",
          undefined,
          "열기",
          "ExtendedActionSheet을 여는 요소를 제공해주세요.",
        ),
      );

      return createElement("ExtendedActionSheet", undefined, [trigger, content]);
    },
  );
};
