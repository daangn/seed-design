"use client";

import { withStoryPreview } from "@/components/story-preview";
import { defineStory } from "@/lib/story";
import {
  FieldButton,
  FieldButtonPlaceholder,
  FieldButtonValue,
  type FieldButtonProps,
} from "seed-design/ui/field-button";

function FieldButtonDemo({
  label,
  description,
  errorMessage,
  value,
  placeholder,
  ...props
}: Pick<FieldButtonProps, "size" | "disabled" | "invalid" | "showRequiredIndicator"> & {
  label?: string;
  description?: string;
  errorMessage?: string;
  value?: string;
  placeholder?: string;
}) {
  return (
    <FieldButton
      label={label}
      description={description}
      errorMessage={errorMessage}
      buttonProps={{
        onClick: () => window.alert("버튼 클릭됨"),
        "aria-label": "알림 표시",
      }}
      {...props}
    >
      {value ? (
        <FieldButtonValue>{value}</FieldButtonValue>
      ) : placeholder ? (
        <FieldButtonPlaceholder>{placeholder}</FieldButtonPlaceholder>
      ) : null}
    </FieldButton>
  );
}

export const story = defineStory({
  displayName: "FieldButton",
  Component: withStoryPreview()(FieldButtonDemo),
  args: {
    initial: {
      label: "레이블",
      description: "버튼에 대한 설명을 작성해주세요",
    },
  },
});

// MDX can't dot into a client module (`story.WithControl`), so re-export it
export const Preview = story.WithControl;
