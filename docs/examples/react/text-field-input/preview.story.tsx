"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import { TextField, TextFieldInput, type TextFieldProps } from "seed-design/ui/text-field";

interface TextFieldInputStoryProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  size?: TextFieldProps["size"];
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

function TextFieldInputStory({
  label,
  description,
  errorMessage,
  placeholder,
  size,
  invalid,
  disabled,
  readOnly,
}: TextFieldInputStoryProps) {
  return (
    <TextField
      label={label}
      description={description}
      errorMessage={errorMessage}
      size={size}
      invalid={invalid}
      disabled={disabled}
      readOnly={readOnly}
    >
      <TextFieldInput autoFocus placeholder={placeholder} />
    </TextField>
  );
}

export const story = defineStory({
  displayName: "TextFieldInput",
  Component: withStoryPreview()(TextFieldInputStory),
  args: {
    initial: {
      label: "라벨",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
