import { camelCase } from "change-case";
import { match } from "ts-pattern";
import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import type { ProgressCircleProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const progressCircleHandler: ComponentHandler<ProgressCircleProperties> = {
  key: metadata.progressCircle.key,
  codegen: async ({ componentProperties: props }) => {
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
      tone: camelCase(props.Tone.value),
    };

    return createElement("ProgressCircle", commonProps);
  },
};
