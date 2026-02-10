import type { DividerProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { match } from "ts-pattern";
import { createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { camelCase } from "change-case";

export const createDividerHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<DividerProperties>(
    metadata.componentDivider.key,
    ({ componentProperties: props }) => {
      const { color } = match(props.Tone.value)
        .with("Neutral Muted", () => ({ color: "stroke.neutralMuted" }))
        .with("Neutral Subtle", () => ({ color: "stroke.neutralSubtle" }))
        .exhaustive();

      const commonProps = {
        color,
        orientation: camelCase(props.Orientation.value),
      };

      return createSeedReactElement("Divider", commonProps, undefined);
    },
  );
