import type { IconService } from "@/entities";
import { pascalCase } from "change-case";
import { type ElementNode, createElement } from "../../core";

export interface IconHandler {
  isIconInstance: (node: { componentKey?: string }) => boolean;
  transform: (node: { componentKey?: string }) => ElementNode;
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
  function isIconInstance(node: { componentKey?: string }) {
    const key = node.componentKey;

    if (!key) {
      return false;
    }

    return iconService.isAvailable(key);
  }

  function transform(node: { componentKey?: string }) {
    const key = node.componentKey;

    if (!key) {
      return createElement("UnknownIcon");
    }

    const iconData = iconService.getOne(key);
    if (!iconData) {
      return createElement("UnknownIcon");
    }

    const { name, weight } = iconData;

    const tagName = iconNameFormatter({ name, weight });

    return createElement(tagName);
  }

  return {
    isIconInstance,
    transform,
  };
}
