import type {
  MenuSheetGroupProperties,
  MenuSheetItemProperties,
  MenuSheetProperties,
} from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("menu-sheet");
const { createLocalSnippetElement: createLocalSnippetElementTrigger } =
  createLocalSnippetHelper("action-button");

const MENU_SHEET_ITEM_KEY = "057083e95466da59051119eec0b41d4ad5a07f8f";
const createMenuSheetItemHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<MenuSheetItemProperties>(
    MENU_SHEET_ITEM_KEY,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");

      const commonProps = {
        tone: camelCase(props.Tone.value),
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
        ...(props["Show Prefix Icon#17043:5"].value && {
          prefixIcon: ctx.iconHandler.transform(props["Prefix Icon#55948:0"]),
        }),
        label: props["Label#55905:8"].value,
        ...(props["Show Item Description#51411:19"].value && {
          description: props["Sub Text#51411:0"].value,
        }),
      };

      return createLocalSnippetElement("MenuSheetItem", commonProps);
    },
  );

const MENU_SHEET_GROUP_KEY = "2a504a1c6b7810d5e652862dcba2cb7048f9eb16";
const createMenuSheetGroupHandler = (ctx: ComponentHandlerDeps) => {
  const menuSheetItemHandler = createMenuSheetItemHandler(ctx);

  return defineComponentHandler<MenuSheetGroupProperties>(
    MENU_SHEET_GROUP_KEY,
    (node, traverse) => {
      const items = findAllInstances<MenuSheetItemProperties>({
        node,
        key: menuSheetItemHandler.key,
      });

      const contentChildren = items.map((item) => menuSheetItemHandler.transform(item, traverse));

      return createLocalSnippetElement("MenuSheetGroup", undefined, contentChildren);
    },
  );
};

export const createMenuSheetHandler = (ctx: ComponentHandlerDeps) => {
  const menuSheetGroupHandler = createMenuSheetGroupHandler(ctx);

  return defineComponentHandler<MenuSheetProperties>(metadata.menuSheet.key, (node, traverse) => {
    const { componentProperties: props } = node;

    const groups = findAllInstances<MenuSheetGroupProperties>({
      node,
      key: menuSheetGroupHandler.key,
    });

    const contentChildren = groups.map((group) => menuSheetGroupHandler.transform(group, traverse));

    const title = props["Show Header#17043:12"].value
      ? props["Title Text#14599:0"].value
      : undefined;

    const description =
      props["Show Header#17043:12"].value && props["Show Header Description#32984:0"].value
        ? props["Description Text#21827:0"].value
        : undefined;

    const { labelAlign } = match(props.Layout.value)
      .with("Text with Icon", () => ({ labelAlign: "left" }))
      .with("Text Only", () => ({ labelAlign: "center" }))
      .exhaustive();

    const content = createLocalSnippetElement(
      "MenuSheetContent",
      { title, description, labelAlign },
      contentChildren,
      {
        comment: title
          ? undefined
          : "title을 제공하지 않는 경우 aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
      },
    );

    const trigger = createLocalSnippetElement(
      "MenuSheetTrigger",
      { asChild: true },
      createLocalSnippetElementTrigger("ActionButton", {}, "MenuSheet 열기"),
    );

    return createLocalSnippetElement("MenuSheet", undefined, [trigger, content]);
  });
};
