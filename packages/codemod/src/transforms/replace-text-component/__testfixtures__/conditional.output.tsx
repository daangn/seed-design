// @ts-nocheck

import { Text } from "@seed-design/react";

const Component = () => {
  return (
    (<div>
      <Text color="palette.gray700" textStyle={isPrimary ? "t5Bold" : "t6Bold"}>광고 노출 기준</Text>
      <Text color="palette.gray700" textStyle={isDetail ? "t5Bold" : "t6Bold"}>
        앱 내 최근 활동 이력을 분석하여 이용자의 관심사와 관련성이 높은 게시글을 노출해요.
      </Text>
    </div>)
  );
};
