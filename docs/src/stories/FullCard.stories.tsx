import type { StoryObj } from "@storybook/react";
import React from "react";

import {
  FullCard,
  FullCardDescription,
  FullCardImageCell,
} from "../components/mdx/card";

export default {
  component: FullCard,
  title: "FullCard",
};

export const Default: StoryObj<typeof FullCard> = {
  render: (args) => (
    <FullCard {...args}>
      <FullCardImageCell>
        <img
          src="https://via.placeholder.com/1000?text=Please+Put+Image+Here"
          alt="overflow"
          width="100%"
          height="300px"
        />
      </FullCardImageCell>
      <FullCardDescription>
        label이 2줄을 초과할 경우 텍스트 시작점을 기준으로 위와 같이
        개행처리됩니다
      </FullCardDescription>
    </FullCard>
  ),
};
