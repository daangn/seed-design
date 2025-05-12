import type { SerializedVariable } from "@/features/design-system/types";

export function serializeVariable({ id, key, name }: Variable): SerializedVariable {
  return { id, key, name };
}
