import { Flex, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  Snackbar,
  SnackbarAvoidOverlap,
  SnackbarProvider,
  useSnackbarAdapter,
} from "seed-design/ui/snackbar";

function Component() {
  const adapter = useSnackbarAdapter();

  return (
    <VStack gap="x4">
      <ActionButton
        onClick={() =>
          adapter.create({
            timeout: 5000,
            onClose: () => {},
            render: () => <Snackbar message="알림 메세지" actionLabel="확인" onAction={() => {}} />,
          })
        }
      >
        실행
      </ActionButton>
      <SnackbarAvoidOverlap>
        <Flex width="full" height="x16" bg="bg.criticalWeak" justify="center" align="center">
          Snackbar가 이 영역과 겹치지 않게 조정됩니다. 스크롤은 무시합니다.
        </Flex>
      </SnackbarAvoidOverlap>
    </VStack>
  );
}

export default function SnackbarPreview() {
  return (
    <SnackbarProvider>
      <Component />
    </SnackbarProvider>
  );
}
