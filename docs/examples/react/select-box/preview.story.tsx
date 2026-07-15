"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { HStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

function SelectBoxPreview({ disabled }: { disabled?: boolean }) {
  return (
    <HStack gap="x6" align="flex-start">
      <CheckSelectBoxGroup aria-label="Fruit">
        <CheckSelectBox
          label="Apple"
          defaultChecked
          disabled={disabled}
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          label="Melon"
          description="Elit cupidatat dolore fugiat enim veniam culpa."
          disabled={disabled}
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox label="Mango" disabled={disabled} suffix={<CheckSelectBoxCheckmark />} />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot defaultValue="apple" disabled={disabled} aria-label="Fruit">
        <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
        <RadioSelectBoxItem
          value="melon"
          label="Melon"
          description="Elit cupidatat dolore fugiat enim veniam culpa."
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem value="mango" label="Mango" suffix={<RadioSelectBoxRadiomark />} />
      </RadioSelectBoxRoot>
    </HStack>
  );
}

export const story = defineStory({
  displayName: "SelectBox",
  Component: withStoryPreview()(SelectBoxPreview),
  args: {
    initial: {
      disabled: false,
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
