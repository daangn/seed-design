import { ActionButton } from "seed-design/ui/action-button";
import { Snackbar, SnackbarProvider, useSnackbarAdapter } from "seed-design/ui/snackbar";

function Component() {
  const adapter = useSnackbarAdapter();

  return (
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
  );
}

export default function SnackbarPreview() {
  return (
    <SnackbarProvider>
      <Component />
    </SnackbarProvider>
  );
}
