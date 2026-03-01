type ChatRole = "system" | "user" | "assistant";

interface TextPart {
  type: "text";
  text: string;
}

interface NormalizedUIMessage {
  id: string;
  role: ChatRole;
  parts: TextPart[];
}

const VALID_ROLES = new Set<ChatRole>(["system", "user", "assistant"]);

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function extractTextFromPartLike(part: unknown): string | null {
  if (typeof part === "string") {
    return normalizeText(part);
  }

  if (!part || typeof part !== "object") {
    return null;
  }

  const text = normalizeText((part as { text?: unknown }).text);
  if (text) return text;

  const type = (part as { type?: unknown }).type;
  if (type === "text" || type === "input_text") {
    return normalizeText((part as { value?: unknown }).value);
  }

  return null;
}

function extractTextPartsFromParts(parts: unknown): TextPart[] {
  if (!Array.isArray(parts)) return [];

  return parts
    .map((part) => {
      if (!part || typeof part !== "object") return null;
      const type = (part as { type?: unknown }).type;
      if (type !== "text") return null;
      const text = normalizeText((part as { text?: unknown }).text);
      if (!text) return null;
      return { type: "text", text } as const;
    })
    .filter((part): part is TextPart => part !== null);
}

function extractTextPartsFromContent(content: unknown): TextPart[] {
  const single = normalizeText(content);
  if (single) {
    return [{ type: "text", text: single }];
  }

  if (!Array.isArray(content)) {
    return [];
  }

  return content
    .map((part) => {
      const text = extractTextFromPartLike(part);
      if (!text) return null;
      return { type: "text", text } as const;
    })
    .filter((part): part is TextPart => part !== null);
}

function normalizeMessage(message: unknown, index: number): NormalizedUIMessage | null {
  if (!message || typeof message !== "object") return null;

  const role = (message as { role?: unknown }).role;
  if (!VALID_ROLES.has(role as ChatRole)) {
    return null;
  }
  const normalizedRole = role as ChatRole;

  const idValue = normalizeText((message as { id?: unknown }).id);
  const id = idValue ?? `normalized-message-${index + 1}`;

  const parts = extractTextPartsFromParts((message as { parts?: unknown }).parts);
  const fallbackParts = parts.length > 0
    ? parts
    : extractTextPartsFromContent((message as { content?: unknown }).content);

  if (fallbackParts.length === 0) {
    return null;
  }

  return {
    id,
    role: normalizedRole,
    parts: fallbackParts,
  };
}

export function normalizeUIMessagesForValidation(messages: unknown[]): NormalizedUIMessage[] {
  return messages
    .map((message, index) => normalizeMessage(message, index))
    .filter((message): message is NormalizedUIMessage => message !== null);
}
