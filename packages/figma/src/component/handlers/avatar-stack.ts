import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import { findAllInstances } from "../../node-util";
import type { AvatarProperties, AvatarStackProperties } from "../type";
import type { ComponentHandler } from "../type-helper";
import { avatarHandler } from "./avatar";

export const avatarStackHandler: ComponentHandler<AvatarStackProperties> = {
  key: metadata.avatarStack.key,
  codegen: async (node) => {
    const avatarNodes = await findAllInstances<AvatarProperties>({
      node,
      key: avatarHandler.key,
    });

    const { componentProperties: props } = node;

    const commonProps = {
      size: props.Size.value,
      // TODO: 구현될 예정
      // topItem: camelCase(props["Top Item"].value),
    };

    const avatarStackChildren = (await Promise.all(avatarNodes.map(avatarHandler.codegen))).map(
      (avatar) => {
        return {
          ...avatar,
          props: { ...avatar.props, size: undefined },
        };
      },
    );

    return createElement("AvatarStack", commonProps, avatarStackChildren);
  },
};
