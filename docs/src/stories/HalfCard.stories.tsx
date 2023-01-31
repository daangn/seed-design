import type { StoryObj } from "@storybook/react";
import React from "react";

import {
  HalfCard,
  HalfCardDescription,
  HalfCardDescriptionCell,
  HalfCardDescriptionTitle,
  HalfCardImageCell,
} from "../components/mdx/card";

export default {
  component: HalfCard,
  title: "HalfCard",
};

export const Default: StoryObj<typeof HalfCard> = {
  render: (args) => (
    <HalfCard {...args}>
      <HalfCardImageCell>
        <img
          src="https://via.placeholder.com/1000?text=Please+Put+Image+Here"
          alt="overflow"
          width="100%"
          height="300px"
        />
      </HalfCardImageCell>
      <HalfCardDescriptionCell>
        <HalfCardDescriptionTitle>Label</HalfCardDescriptionTitle>
        <HalfCardDescription>
          Checkbox는 항상 Label을 가져야 합니다. Label이 설정되지 않은
          체크박스는 다른 컴포넌트와의 관계가 매우 명확하고, 사용자에게 충분한
          맥락을 전달할 수 있을때만 사용합니다.
        </HalfCardDescription>
      </HalfCardDescriptionCell>
    </HalfCard>
  ),
};
