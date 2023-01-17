import type { StoryObj } from "@storybook/react";
import React from "react";

import {
  DoBox,
  DoDontLayout,
  DoImage,
  DontBox,
  DontImage,
  DontText,
  DoText,
} from "../components/mdx/DoDont";

export default {
  component: DoDontLayout,
  title: "Do-Dont",
};

export const Default: StoryObj<typeof DoDontLayout> = {
  render: (args) => (
    <DoDontLayout {...args}>
      <DoBox>
        <DoImage>
          <img
            src="https://via.placeholder.com/1000?text=Please+Put+Image+Here"
            alt="overflow"
            width="100%"
            height="300px"
          />
        </DoImage>
        <DoText>
          Checkbox는 1가지 이상의 옵션을 선택하거나 선택을 취소할 수 있습니다.
        </DoText>
      </DoBox>

      <DontBox>
        <DontImage>
          <img
            src="https://via.placeholder.com/1000?text=Please+Put+Image+Here"
            alt="overflow"
            width="100%"
            height="300px"
          />
        </DontImage>
        <DontText>
          선택할 수 있는 옵션이 하나인 경우, 체크박스를 사용하지 않습니다. 이런
          경우엔 Radio Group을 사용합니다.
        </DontText>
      </DontBox>
    </DoDontLayout>
  ),
};
