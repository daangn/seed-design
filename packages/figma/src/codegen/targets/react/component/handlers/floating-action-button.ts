import type {
  FloatingActionButtonButtonItemProperties,
  FloatingActionButtonMenuItemProperties,
  FloatingActionButtonProperties,
} from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { findAllInstances } from "@/utils/figma-node";

const { createLocalSnippetElement } = createLocalSnippetHelper("floating-action-button");

export const createFloatingActionButtonHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<FloatingActionButtonProperties>(
    metadata.componentFloatingActionButton.key,
    (node) => {
      const [button] = findAllInstances<FloatingActionButtonButtonItemProperties>({
        node,
        key: metadata.privateComponentItemButtonType.key,
      });
      const [menu] = findAllInstances<FloatingActionButtonMenuItemProperties>({
        node,
        key: metadata.privateComponentItemMenuType.key,
      });

      const commonProps = (() => {
        if (button)
          return {
            icon: ctx.iconHandler.transform(button.componentProperties["Icon#29766:18"]),
            extended: button.componentProperties.Extended.value === "True",
            label: button.componentProperties["Label#29808:0"].value,
          };

        if (menu)
          return {
            icon: ctx.iconHandler.transform(menu.componentProperties["Icon#29766:0"]),
            extended: menu.componentProperties.Extended.value === "True",
            label: menu.componentProperties["Label#29766:9"].value,
          };
      })();

      return createLocalSnippetElement("FloatingActionButton", commonProps);
    },
  );
