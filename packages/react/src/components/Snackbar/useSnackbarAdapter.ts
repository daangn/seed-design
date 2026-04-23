import { useSnackbarContext, type CreateSnackbarOptions } from "@seed-design/react-snackbar";
import { useMemo } from "react";

export type UseSnackbarAdapterReturn = ReturnType<typeof useSnackbarAdapter>;

/**
 * wraps the snackbar context to provide a more user-friendly API
 */
export function useSnackbarAdapter() {
  const api = useSnackbarContext();
  const adapter = useMemo(
    () => ({
      visible: api.visible,
      create: (options: CreateSnackbarOptions) => {
        return api.create({
          timeout: options.timeout ?? 4000,
          removeDelay: options.removeDelay ?? 200,
          onClose: options.onClose,
          render: options.render,
        });
      },
      dismiss: api.dismiss,
    }),
    [api],
  );

  return adapter;
}
