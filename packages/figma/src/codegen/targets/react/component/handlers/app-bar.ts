import type { AppBarProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { NormalizedInstanceNode, NormalizedTextNode } from "@/normalizer";
import { findAll, findAllInstances, findOne } from "@/utils/figma-node";
import { match } from "ts-pattern";
import { createLocalSnippetHelper, createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("app-bar");

const LEFT_NODE_NAME = "LeftWrapper";
const TITLE_NODE_NAME = "Title";
const RIGHT_NODE_NAME = "RightSlot";

export const createAppBarHandler = (ctx: ComponentHandlerDeps) => {
  return defineComponentHandler<AppBarProperties>(metadata.topNavigation.key, (node) => {
    const props = node.componentProperties;

    const theme = (() => {
      switch (props["OS (Figma Only)"].value) {
        case "Android":
          return "android";
        case "iOS":
          return "cupertino";
      }
    })();

    const tone = (() => {
      switch (props.Variant.value) {
        case "Layer Default":
          return "layer";
        case "Transparent":
          return "transparent";
      }
    })();

    const titleNode = findOne(node, (n) => n.type === "TEXT" && n.name === TITLE_NODE_NAME) as
      | NormalizedTextNode
      | undefined;

    const main = titleNode
      ? createLocalSnippetElement("AppBarMain", { title: titleNode.characters })
      : undefined;

    const left = (() => {
      switch (props["Left"].value) {
        case "Back":
          return createLocalSnippetElement("AppBarBackButton");
        case "Close":
          return createLocalSnippetElement("AppBarCloseButton");
        case "Custom": {
          const container = findOne(node, (n) => n.type === "FRAME" && n.name === LEFT_NODE_NAME);
          
          if (container) {
            // Find icon instances within the container
            const iconInstances = findAllInstances(container);
            
            if (iconInstances.length > 0) {
              // Get the first icon instance
              const iconInstance = iconInstances[0];
              return createLocalSnippetElement("AppBarIconButton", {
                icon: iconInstance.name,
              });
            }
          }
          
          return undefined;
        }
        case "None":
          return undefined;
      }
    })();

    const right = (() => {
      switch (props["Right"].value) {
        case "1 Icon Button":
        case "2 Icon Button":
        case "3 Icon Button": {
          const rightContainer = findOne(node, (n) => n.type === "FRAME" && n.name === RIGHT_NODE_NAME);
          
          if (rightContainer) {
            const iconInstances = findAllInstances(rightContainer);
            const iconButtons = iconInstances.map((iconInstance) =>
              createLocalSnippetElement("AppBarIconButton", {
                icon: iconInstance.name,
              })
            );
            
            return iconButtons.length > 0
              ? createLocalSnippetElement("AppBarRight", {}, iconButtons)
              : undefined;
          }
          
          return undefined;
        }
        case "Text Button": {
          const rightContainer = findOne(node, (n) => n.type === "FRAME" && n.name === RIGHT_NODE_NAME);
          
          if (rightContainer) {
            const textNode = findOne(rightContainer, (n) => n.type === "TEXT") as NormalizedTextNode | undefined;
            
            if (textNode) {
              return createLocalSnippetElement("AppBarRight", {}, [
                createLocalSnippetElement("AppBarTextButton", {}, textNode.characters)
              ]);
            }
          }
          
          return undefined;
        }
        case "None":
          return undefined;
      }
    })();

    return createLocalSnippetElement(
      "AppBar",
      { theme, tone },
      [left, main, right].filter(Boolean),
      {
        comment:
          tone === "transparent"
            ? '<AppScreen layerOffsetTop="none">으로 상단 패딩을 제거할 수 있습니다.'
            : undefined,
      },
    );
  });
};
