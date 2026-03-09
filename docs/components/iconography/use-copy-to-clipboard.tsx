"use client";

import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";

export function useCopyToClipboard() {
  const adapter = useSnackbarAdapter();

  return async (text: string, label?: string) => {
    await navigator.clipboard.writeText(text);
    adapter.create({
      timeout: 2000,
      onClose: () => {},
      render: () => <Snackbar message={label ?? "복사되었습니다"} />,
    });
  };
}
