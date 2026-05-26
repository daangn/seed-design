import { describe, expect, it } from "vitest";

import {
  Checkbox,
  CheckboxControl,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
} from "./components/Checkbox";
import {
  ProgressCircle,
  ProgressCircleRange,
  ProgressCircleRoot,
} from "./components/ProgressCircle";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemIndicator,
  RadioGroupItemLabel,
  RadioGroupRoot,
} from "./components/RadioGroup";
import { Switch, SwitchControl, SwitchLabel, SwitchRoot, SwitchThumb } from "./components/Switch";
import { TagGroup, TagGroupItem, TagGroupItemLabel, TagGroupRoot } from "./components/TagGroup";

describe("components public exports", () => {
  it("exposes compound components through namespace exports", () => {
    expect(Switch.Root).toBe(SwitchRoot);
    expect(Switch.Control).toBe(SwitchControl);
    expect(Switch.Thumb).toBe(SwitchThumb);
    expect(Switch.Label).toBe(SwitchLabel);

    expect(Checkbox.Root).toBe(CheckboxRoot);
    expect(Checkbox.Control).toBe(CheckboxControl);
    expect(Checkbox.Indicator).toBe(CheckboxIndicator);
    expect(Checkbox.Label).toBe(CheckboxLabel);
    expect(Checkbox.Group).toBe(CheckboxGroup);

    expect(RadioGroup.Root).toBe(RadioGroupRoot);
    expect(RadioGroup.Item).toBe(RadioGroupItem);
    expect(RadioGroup.ItemControl).toBe(RadioGroupItemControl);
    expect(RadioGroup.ItemIndicator).toBe(RadioGroupItemIndicator);
    expect(RadioGroup.ItemLabel).toBe(RadioGroupItemLabel);

    expect(TagGroup.Root).toBe(TagGroupRoot);
    expect(TagGroup.Item).toBe(TagGroupItem);
    expect(TagGroup.ItemLabel).toBe(TagGroupItemLabel);
  });

  it("keeps ProgressCircle namespace usage while exposing flat slots", () => {
    expect(ProgressCircle.Root).toBe(ProgressCircleRoot);
    expect(ProgressCircle.Range).toBe(ProgressCircleRange);
  });
});
