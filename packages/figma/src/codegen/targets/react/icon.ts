import type { IconService } from "@/entities";
import { pascalCase } from "change-case";
import { type ElementNode, createElement } from "../../core";
import { createMonochromeIconElement, createMulticolorIconElement } from "./element-factories";

export interface IconHandler {
  isIconInstance: (node: { componentKey: string }) => boolean;
  transform: (node: { componentKey: string }) => ElementNode;
}

export interface IconHandlerDeps {
  iconService: IconService;
  iconNameFormatter?: (props: { name: string; weight?: string }) => string;
}

const defaultIconNameFormatter = ({ name, weight }: { name: string; weight?: string }) =>
  pascalCase(`${name}${weight ? weight : ""}`);

export function createIconHandler({
  iconService,
  iconNameFormatter = defaultIconNameFormatter,
}: IconHandlerDeps): IconHandler {
  function isIconInstance(node: { componentKey: string }): boolean {
    const key = node.componentKey;

    if (!key) {
      return false;
    }

    return iconService.isAvailable(key);
  }

  function transform(node: { componentKey: string }): ElementNode {
    const key = node.componentKey;
    const iconData = iconService.getOne(key);
    if (!iconData) {
      return createElement("UnknownIcon");
    }

    const { name, weight, type } = iconData;

    const tagName = iconNameFormatter({ name, weight });

    if (type === "multicolor") {
      return createMulticolorIconElement(tagName);
    }

    return createMonochromeIconElement(tagName);
  }

  return {
    isIconInstance,
    transform,
  };
}
