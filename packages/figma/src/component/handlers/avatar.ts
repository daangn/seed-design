import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import { findAllInstances } from "../../utils/figma-node";
import type { AvatarProperties, IdentityPlaceholderProperties } from "../type";
import type { ComponentHandler } from "../type-helper";
import { identityPlaceholderHandler } from "./identity-placeholder";

export const avatarHandler: ComponentHandler<AvatarProperties> = {
  key: metadata.avatar.key,
  codegen: async (node) => {
    const [placeholder] = findAllInstances<IdentityPlaceholderProperties>({
      node,
      key: identityPlaceholderHandler.key,
    });
    const { componentProperties: props } = node;

    const avatarHasSrc = props["Show Image#71850:57"].value;

    const commonProps = {
      ...(avatarHasSrc && {
        // Placeholder
        src: `https://placehold.co/${props.Size.value}x${props.Size.value}`,
      }),
      ...(placeholder && {
        fallback: await identityPlaceholderHandler.codegen(placeholder),
      }),
      size: props.Size.value,
    };

    return createElement(
      "Avatar",
      commonProps,
      props["Show Badge#1398:26"].value ? createElement("AvatarBadge", {}) : undefined,
      avatarHasSrc ? "alt 텍스트를 제공해야 합니다." : undefined,
    );
  },
};
