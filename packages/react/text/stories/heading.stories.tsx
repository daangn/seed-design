import "@seed-design/stylesheet/global.css";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Heading } from "../src/index";

export default {
  title: "Heading",
  component: Heading,
  argTypes: {
    type: {
      options: ["h1", "h2", "h3", "h4"],
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof Heading>;

const STORY_TEXT = "Hello";

const Template: ComponentStory<typeof Heading> = (args) => (
  <Heading {...args}>{STORY_TEXT}</Heading>
);

export const Basic = Template.bind({});
Basic.args = { type: "h1" };
