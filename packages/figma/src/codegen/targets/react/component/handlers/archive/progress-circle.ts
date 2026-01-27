import type { ProgressCircleProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { camelCase } from "change-case";
import { match } from "ts-pattern";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("progress-circle");

export const createProgressCircleHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ProgressCircleProperties>(
    metadata.progressCircle.key,
    ({ componentProperties: props }) => {
      const { value, minValue, maxValue } = match(props.Value.value)
        .with("Indeterminate", () => ({
          value: undefined,
          minValue: undefined,
          maxValue: undefined,
        }))
        .with("0%", () => ({
          value: 0,
          minValue: 0,
          maxValue: 100,
        }))
        .with("25%", () => ({
          value: 25,
          minValue: 0,
          maxValue: 100,
        }))
        .with("75%", () => ({
          value: 75,
          minValue: 0,
          maxValue: 100,
        }))
        .with("100%", () => ({
          value: 100,
          minValue: 0,
          maxValue: 100,
        }))
        .exhaustive();

      const commonProps = {
        value,
        minValue,
        maxValue,
        size: props.Size.value,
        ...(props.Tone.value !== "Custom(inherit)" && {
          tone: camelCase(props.Tone.value),
        }),
      };

      return createLocalSnippetElement("ProgressCircle", commonProps);
    },
  );
