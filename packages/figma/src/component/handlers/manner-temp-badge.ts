import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import type { MannerTempBadgeProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const mannerTempBadgeHandler: ComponentHandler<MannerTempBadgeProperties> = {
  key: metadata.mannerTempBadge.key,
  codegen: async ({ children }) => {
    const textNode = children.find((child) => child.type === "TEXT");

    const commonProps = {
      temperature: Number(textNode?.characters.replace(/[^\d.-]/g, "") ?? "-1"),
    };

    return createElement("MannerTempBadge", commonProps);
  },
};
