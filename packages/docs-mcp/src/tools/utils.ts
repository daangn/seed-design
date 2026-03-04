export const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  idempotentHint: true,
} as const;

export function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

export function toErrorResult<T extends Record<string, unknown>>(message: string, fallback: T) {
  return {
    content: [{ type: "text" as const, text: message }],
    structuredContent: {
      ...fallback,
      error: message,
    },
    isError: true,
  };
}
