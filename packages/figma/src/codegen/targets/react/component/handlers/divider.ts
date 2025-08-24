import type { DividerProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { match } from "ts-pattern";
import { createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";

export const createDividerHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<DividerProperties>(
    metadata.divider.key,
    ({ componentProperties: props }) => {
      const { color } = match(props.Tone.value)
        .with("Neutral", () => ({ color: "stroke.neutral" }))
        .with("Neutral Muted", () => ({ color: "stroke.neutralMuted" }))
        .exhaustive();

      return createSeedReactElement("Divider", { color });
    },
  );
