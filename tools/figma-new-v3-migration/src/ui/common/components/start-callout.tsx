import { Box } from "@seed-design/react";
import { Callout } from "common/design-system/ui/callout";

export function StartCallout() {
  return (
    <Box style={{ padding: 16 }}>
      <Callout
        title="사용법"
        tone="informative"
        description={
          <>
            1. 변경할 화면을 모두 선택 후, '검사하기' 버튼을 눌러요
            <br />
            2. 하단의 '자동 변경' 버튼으로 매칭된 부분을 변경해요.
            <br />
            3. 남은 요소들을 가이드에 맞게 선택 후, 변경해요.
          </>
        }
      />
    </Box>
  );
}
