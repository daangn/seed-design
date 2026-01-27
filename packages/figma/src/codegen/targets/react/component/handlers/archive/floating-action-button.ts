import type {
  FloatingActionButtonButtonItemProperties,
  FloatingActionButtonMenuItemProperties,
  FloatingActionButtonProperties,
} from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { findAllInstances } from "@/utils/figma-node";

const { createLocalSnippetElement } = createLocalSnippetHelper("floating-action-button");

const BUTTON_TYPE_KEY = "8cecc85275115d653579d4c3156567ebf19f7b27";
const MENU_TYPE_KEY = "400124347392c15473f9cd2d8a6aedb64f3baf36";

export const createFloatingActionButtonHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<FloatingActionButtonProperties>(
    metadata.floatingActionButton.key,
    (node) => {
      const [button] = findAllInstances<FloatingActionButtonButtonItemProperties>({
        node,
        key: BUTTON_TYPE_KEY,
      });
      const [menu] = findAllInstances<FloatingActionButtonMenuItemProperties>({
        node,
        key: MENU_TYPE_KEY,
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
