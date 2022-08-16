import "@seed-design/stylesheet/global.css";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Text } from "../src/index";

export default {
  title: "Text",
  component: Text,
  argTypes: {
    type: {
      options: [
        "bodyL1",
        "bodyL2",
        "bodyM1",
        "bodyM2",
        "label1",
        "label2",
        "label3",
        "label4",
        "label5",
        "label6",
      ],
      control: { type: "select" },
    },
    weight: {
      options: ["regular", "bold"],
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof Text>;

const STORY_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const Template: ComponentStory<typeof Text> = (args) => (
  <Text {...args}>{STORY_TEXT}</Text>
);

export const Basic = Template.bind({});
Basic.args = { type: "bodyL1", weight: "regular" };
