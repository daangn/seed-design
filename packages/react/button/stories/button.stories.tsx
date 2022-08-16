import "@seed-design/stylesheet/global.css";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Button } from "../src/index";

export default {
  title: "Button",
  component: Button,
  argTypes: {
    color: {
      options: ["primary", "primaryLow", "secondary"],
      control: { type: "select" },
    },
    size: {
      options: ["large", "medium", "small", "xsmall"],
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof Button>;

const STORY_TEXT = "Label";

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>{STORY_TEXT}</Button>
);

export const Basic = Template.bind({});
Basic.args = { color: "primary", size: "large" };
