import type {
  MenuSheetGroupProperties,
  MenuSheetItemProperties,
  MenuSheetProperties,
} from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("menu-sheet");
const { createLocalSnippetElement: createLocalSnippetElementTrigger } =
  createLocalSnippetHelper("action-button");

const createMenuSheetItemHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<MenuSheetItemProperties>(
    metadata.privateComponentMenuSheetMenuItem.key,
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

const createMenuSheetGroupHandler = (ctx: ComponentHandlerDeps) => {
  const menuSheetItemHandler = createMenuSheetItemHandler(ctx);

  return defineComponentHandler<MenuSheetGroupProperties>(
    metadata.privateComponentMenuSheetMenuGroup.key,
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

  return defineComponentHandler<MenuSheetProperties>(
    metadata.componentMenuSheet.key,
    (node, traverse) => {
      const { componentProperties: props } = node;

      const groups = findAllInstances<MenuSheetGroupProperties>({
        node,
        key: menuSheetGroupHandler.key,
      });

      const contentChildren = groups.map((group) =>
        menuSheetGroupHandler.transform(group, traverse),
      );

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
    },
  );
};
