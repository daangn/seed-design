import { HStack, Text } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  ResponsiveDialogAction,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogRoot,
  ResponsiveDialogTrigger,
} from "seed-design/ui/responsive-dialog";

const DialogResponsive = () => {
  return (
    <ResponsiveDialogRoot>
      <ResponsiveDialogTrigger asChild>
        <ActionButton variant="neutralSolid">Open</ActionButton>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent
        title="반응형 다이얼로그"
        description="화면 크기에 따라 적합한 컴포넌트로 자동 전환됩니다."
      >
        <ResponsiveDialogBody>
          <Text textStyle="articleBody">
            md 이상에서는 화면 중앙의 Dialog로, sm 이하에서는 화면 하단에서 슬라이드되는 Bottom
            Sheet로 표시됩니다.
          </Text>
        </ResponsiveDialogBody>
        <ResponsiveDialogFooter>
          <HStack gap="x2">
            <ResponsiveDialogAction variant="neutralWeak" flexGrow>
              취소
            </ResponsiveDialogAction>
            <ResponsiveDialogAction variant="neutralSolid" flexGrow>
              확인
            </ResponsiveDialogAction>
          </HStack>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialogRoot>
  );
};

export default DialogResponsive;
