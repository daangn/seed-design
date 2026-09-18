import type { StackflowReactPlugin } from "@stackflow/react";
import { StackSyncObserver } from "../components/StackSyncObserver";

export const iframeSyncPlugin = (): StackflowReactPlugin => () => ({
  key: "iframe-sync",
  wrapStack({ stack }) {
    return (
      <>
        <StackSyncObserver />
        {stack.render()}
      </>
    );
  },
});
