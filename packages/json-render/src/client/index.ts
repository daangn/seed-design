import Anthropic from "@anthropic-ai/sdk";
import { buildUserPrompt } from "@json-render/core";
import type { Spec } from "@json-render/core";
import type { GenerateUIOptions, GenerateUIResult } from "../types";
import { buildSeedSystemPrompt } from "./prompt-builder";
import { createStreamProcessor } from "./stream-handler";

export async function generateUI(options: GenerateUIOptions): Promise<GenerateUIResult> {
  const apiKey = options.apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is required. Set it as an environment variable or pass it via options.apiKey.",
    );
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const systemPrompt = buildSeedSystemPrompt();
  const userPrompt = buildUserPrompt({
    prompt: options.prompt,
    currentSpec: options.currentSpec,
  });

  const processor = createStreamProcessor({
    onPartialSpec: options.onPartialSpec,
    onText: options.onText,
  });

  const stream = client.messages.stream({
    model: options.model ?? "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      processor.processChunk(event.delta.text);
    }
  }

  return processor.finish();
}
