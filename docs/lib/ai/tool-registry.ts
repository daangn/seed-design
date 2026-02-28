import type { Tool } from "ai";

export type ToolSource = "client" | "mcp";

export type ToolCapability =
  | "discover"
  | "search"
  | "fetch"
  | "preview"
  | "install"
  | "code"
  | "types"
  | "mutation"
  | "other";

export type ToolRisk = "low" | "medium" | "high";

export type ApprovalPolicy = "auto" | "on-high-risk" | "always";

export type ToolUIHint = "generic" | "preview" | "code" | "table" | "install";

export interface ToolDescriptor {
  name: string;
  description: string;
  source: ToolSource;
  capability: ToolCapability;
  risk: ToolRisk;
  uiHint: ToolUIHint;
  approvalPolicy: ApprovalPolicy;
}

const UNSAFE_OBJECT_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function isSafeObjectKey(key: string): boolean {
  return key.length > 0 && !UNSAFE_OBJECT_KEYS.has(key);
}

function createSafeRecord<T>(): Record<string, T> {
  return Object.create(null) as Record<string, T>;
}

export function inferToolCapability(name: string, description: string): ToolCapability {
  const normalized = `${name} ${description}`.toLowerCase();

  if (/(discover|list|catalog)/.test(normalized)) return "discover";
  if (/(search|find|query)/.test(normalized)) return "search";
  if (/(get|read|fetch|full docs|rootage)/.test(normalized)) return "fetch";
  if (/(preview|example)/.test(normalized)) return "preview";
  if (/(install|setup)/.test(normalized)) return "install";
  if (/(code|snippet|block)/.test(normalized)) return "code";
  if (/(props|type|schema|table)/.test(normalized)) return "types";
  if (/(create|update|delete|remove|move|apply|write|run|execute)/.test(normalized)) {
    return "mutation";
  }

  return "other";
}

export function inferToolRisk(name: string, description: string): ToolRisk {
  const normalized = `${name} ${description}`.toLowerCase();

  if (/(delete|remove|drop|trash|reset|revoke|apply|write|update|create|move)/.test(normalized)) {
    return "high";
  }

  if (/(install|run|execute|call)/.test(normalized)) {
    return "medium";
  }

  return "low";
}

export function inferToolUIHint(capability: ToolCapability): ToolUIHint {
  if (capability === "preview") return "preview";
  if (capability === "install") return "install";
  if (capability === "code") return "code";
  if (capability === "types") return "table";
  return "generic";
}

function inferApprovalPolicy(risk: ToolRisk): ApprovalPolicy {
  if (risk === "high") return "always";
  if (risk === "medium") return "on-high-risk";
  return "auto";
}

export function createToolDescriptor(input: {
  name: string;
  description?: string;
  source: ToolSource;
  capability?: ToolCapability;
  risk?: ToolRisk;
  uiHint?: ToolUIHint;
  approvalPolicy?: ApprovalPolicy;
}): ToolDescriptor {
  const description = input.description ?? input.name;
  const capability = input.capability ?? inferToolCapability(input.name, description);
  const risk = input.risk ?? inferToolRisk(input.name, description);
  const uiHint = input.uiHint ?? inferToolUIHint(capability);
  const approvalPolicy = input.approvalPolicy ?? inferApprovalPolicy(risk);

  return {
    name: input.name,
    description,
    source: input.source,
    capability,
    risk,
    uiHint,
    approvalPolicy,
  };
}

export function mergeToolDescriptors(...groups: ToolDescriptor[][]): ToolDescriptor[] {
  const deduped = new Map<string, ToolDescriptor>();

  for (const group of groups) {
    for (const descriptor of group) {
      deduped.set(descriptor.name, descriptor);
    }
  }

  return Array.from(deduped.values());
}

export function isApprovalRequired(descriptor: ToolDescriptor): boolean {
  if (descriptor.approvalPolicy === "always") return true;
  if (descriptor.approvalPolicy === "on-high-risk") return descriptor.risk === "high";
  return false;
}

export function applyApprovalPolicyToTool(toolDef: Tool, descriptor: ToolDescriptor): Tool {
  if ("needsApproval" in toolDef && toolDef.needsApproval != null) {
    return toolDef;
  }

  if (!isApprovalRequired(descriptor)) {
    return toolDef;
  }

  return {
    ...toolDef,
    needsApproval: true,
  };
}

export function applyApprovalPolicies(
  tools: Record<string, Tool>,
  descriptors: ToolDescriptor[],
): Record<string, Tool> {
  const descriptorMap = new Map(descriptors.map((descriptor) => [descriptor.name, descriptor]));
  const next = createSafeRecord<Tool>();

  for (const [name, toolDef] of Object.entries(tools)) {
    if (!isSafeObjectKey(name)) {
      continue;
    }

    const descriptor =
      descriptorMap.get(name) ??
      createToolDescriptor({
        name,
        description: name,
        source: "mcp",
      });

    next[name] = applyApprovalPolicyToTool(toolDef, descriptor);
  }

  return next;
}

export function serializeToolCatalog(descriptors: ToolDescriptor[]): string {
  if (descriptors.length === 0) {
    return "- (none)";
  }

  return descriptors
    .map((descriptor) => {
      return `- ${descriptor.name} [${descriptor.source}] capability=${descriptor.capability} risk=${descriptor.risk} ui=${descriptor.uiHint}`;
    })
    .join("\n");
}

const ICON_TOOL_NAME_PATTERN = /(^|[_-])(icon|icons)([_-]|$)/i;
const ICON_QUERY_PATTERN = /(아이콘|icon|icons|glyph|pictogram|symbol|svg)/i;

export function isIconToolName(toolName: string): boolean {
  return ICON_TOOL_NAME_PATTERN.test(toolName);
}

export function isIconIntentQuery(query: string): boolean {
  return ICON_QUERY_PATTERN.test(query);
}

export function filterToolsForQuery<T>(
  tools: Record<string, T>,
  descriptors: ToolDescriptor[],
  query?: string | null,
): {
  tools: Record<string, T>;
  descriptors: ToolDescriptor[];
} {
  if (!query || isIconIntentQuery(query)) {
    return { tools, descriptors };
  }

  const filteredEntries = Object.entries(tools).filter(([toolName]) => !isIconToolName(toolName));

  if (filteredEntries.length === 0) {
    return { tools, descriptors };
  }

  const filteredTools = createSafeRecord<T>();
  for (const [toolName, toolDefinition] of filteredEntries) {
    if (!isSafeObjectKey(toolName)) {
      continue;
    }
    filteredTools[toolName] = toolDefinition;
  }

  const filteredToolNames = Object.keys(filteredTools);
  if (filteredToolNames.length === 0) {
    return { tools, descriptors };
  }

  const allowedToolNames = new Set(Object.keys(filteredTools));
  const filteredDescriptors = descriptors.filter((descriptor) => allowedToolNames.has(descriptor.name));

  return {
    tools: filteredTools,
    descriptors: filteredDescriptors,
  };
}
