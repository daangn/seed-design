import { Flex } from "@seed-design/react";
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
    <Flex direction="column" gap="x4">
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
        <Flex
          width="full"
          height="x16"
          background="bg.criticalWeak"
          justifyContent="center"
          alignItems="center"
        >
          Snackbar가 이 영역과 겹치지 않게 조정됩니다. 스크롤은 무시합니다.
        </Flex>
      </SnackbarAvoidOverlap>
    </Flex>
  );
}

export default function SnackbarPreview() {
  return (
    <SnackbarProvider>
      <Component />
    </SnackbarProvider>
  );
}
