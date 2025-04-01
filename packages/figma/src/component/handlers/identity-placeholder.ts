import { camelCase } from "change-case";
import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import type { ComponentHandler } from "../type-helper";
import type { IdentityPlaceholderProperties } from "../type";

export const identityPlaceholderHandler: ComponentHandler<IdentityPlaceholderProperties> = {
  key: metadata.identityPlaceholder.key,
  codegen: async ({ componentProperties: props }) => {
    const commonProps = {
      identity: camelCase(props.Identity.value),
    };

    return createElement("IdentityPlaceholder", commonProps);
  },
};
