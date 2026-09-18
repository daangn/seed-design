import type { Activity } from "@stackflow/core";
import { useActivity } from "@stackflow/react";

// `@stackflow/react` types its activity context as non-null but defaults it to `null`, so this is
// `null` outside an activity.
export const useNullableActivity = () => useActivity() as Activity | null;
