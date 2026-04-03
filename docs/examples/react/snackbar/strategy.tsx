import { ActionButton } from "seed-design/ui/action-button";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";

export default function SnackbarStrategy() {
  const adapter = useSnackbarAdapter();

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <ActionButton
        variant="neutralSolid"
        onClick={() =>
          adapter.create({
            render: () => <Snackbar variant="positive" message="저장되었습니다" />,
          })
        }
      >
        Immediate (positive)
      </ActionButton>
      <ActionButton
        variant="neutralSolid"
        onClick={() =>
          adapter.create({
            strategy: "queued",
            render: () => <Snackbar variant="critical" message="오류가 발생했습니다" />,
          })
        }
      >
        Queued (critical)
      </ActionButton>
    </div>
  );
}
