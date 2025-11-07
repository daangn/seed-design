import type { StackflowReactPlugin } from "@stackflow/react/future";
import { StackSyncObserver } from "../components/StackSyncObserver";

export const iframeSyncPlugin = (): StackflowReactPlugin => () => ({
  key: "iframe-sync",
  wrapActivity({ activity }) {
    return (
      <>
        <StackSyncObserver />
        {activity.render()}
      </>
    );
  },
});
