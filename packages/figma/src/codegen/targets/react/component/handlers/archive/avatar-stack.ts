import type { AvatarProperties, AvatarStackProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { createAvatarHandler } from "./avatar";

const { createLocalSnippetElement } = createLocalSnippetHelper("avatar");

export const createAvatarStackHandler = (ctx: ComponentHandlerDeps) => {
  const avatarHandler = createAvatarHandler(ctx);

  return defineComponentHandler<AvatarStackProperties>(
    metadata.avatarStack.key,
    (node, traverse) => {
      const avatarNodes = findAllInstances<AvatarProperties>({
        node,
        key: avatarHandler.key,
      });

      const { componentProperties: props } = node;

      const commonProps = {
        size: props.Size.value,
      };

      const avatarStackChildren = avatarNodes.map((avatarNode) =>
        avatarHandler.transform(avatarNode, traverse),
      );

      return createLocalSnippetElement("AvatarStack", commonProps, avatarStackChildren);
    },
  );
};
