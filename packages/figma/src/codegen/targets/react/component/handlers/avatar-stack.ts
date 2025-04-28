import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import type { SeedComponentHandlerDeps } from "../deps.interface";
import type { AvatarProperties, AvatarStackProperties } from "@/codegen/component-properties";
import { createAvatarHandler } from "./avatar";

export const createAvatarStackHandler = (ctx: SeedComponentHandlerDeps) => {
  const avatarHandler = createAvatarHandler(ctx);

  return defineComponentHandler<AvatarStackProperties>(metadata.avatarStack.key, (node) => {
    const avatarNodes = findAllInstances<AvatarProperties>({
      node,
      key: avatarHandler.key,
    });

    const { componentProperties: props } = node;

    const commonProps = {
      size: props.Size.value,
      // TODO: 구현될 예정
      // topItem: camelCase(props["Top Item"].value),
    };

    const avatarStackChildren = avatarNodes.map(avatarHandler.transform);

    return createElement("AvatarStack", commonProps, avatarStackChildren);
  });
};
