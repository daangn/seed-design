import { camelCase } from "change-case";
import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import { handleSize } from "../properties";
import type { BadgeProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const badgeHandler: ComponentHandler<BadgeProperties> = {
  key: metadata.badge.key,
  codegen: async ({ componentProperties: props }) => {
    const commonProps = {
      size: handleSize(props.Size.value),
      tone: camelCase(props.Tone.value),
      variant: camelCase(props.Variant.value),
      shape: camelCase(props.Shape.value),
    };

    return createElement("Badge", commonProps, props["Label#1584:0"].value);
  },
};
