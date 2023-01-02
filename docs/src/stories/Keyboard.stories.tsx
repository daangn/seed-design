import type { StoryObj } from "@storybook/react";
import React from "react";

import Keyboard from "../components/mdx/Keyboard";

export default {
  component: Keyboard,
  title: "Keyboard",
};

export const Default: StoryObj<typeof Keyboard> = {
  render: (args) => <Keyboard {...args}>K</Keyboard>,
};
