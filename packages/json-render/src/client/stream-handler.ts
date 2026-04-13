import { parseSpecStreamLine, applySpecStreamPatch } from "@json-render/core";
import type { Spec } from "@json-render/core";

export interface StreamCallbacks {
  onPartialSpec?: (spec: Spec) => void;
  onText?: (text: string) => void;
  onComplete?: (spec: Spec) => void;
  onError?: (error: Error) => void;
}

export function createStreamProcessor(callbacks: StreamCallbacks) {
  let spec: Record<string, unknown> = {};
  let buffer = "";
  let fullText = "";

  function processChunk(text: string) {
    buffer += text;

    const lines = buffer.split("\n");
    // Keep the last incomplete line in buffer
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith("{") && trimmed.includes('"op"')) {
        try {
          const patch = parseSpecStreamLine(trimmed);
          spec = applySpecStreamPatch(spec, patch) as Record<string, unknown>;
          callbacks.onPartialSpec?.(spec as Spec);
        } catch {
          // Incomplete JSON line, ignore
        }
      } else {
        fullText += trimmed + "\n";
        callbacks.onText?.(trimmed);
      }
    }
  }

  function finish(): { spec: Spec; text: string } {
    // Process any remaining buffer
    if (buffer.trim()) {
      processChunk("\n");
    }

    callbacks.onComplete?.(spec as Spec);
    return { spec: spec as Spec, text: fullText };
  }

  return { processChunk, finish };
}
