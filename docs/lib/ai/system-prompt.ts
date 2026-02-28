import type { OrchestrationPlan } from "./orchestrator";
import { serializeToolCatalog, type ToolDescriptor } from "./tool-registry";

export interface SystemPromptContext {
  verifiedLinks?: Array<{
    title: string;
    url: string;
  }>;
  toolCatalog?: ToolDescriptor[];
  orchestrationPlan?: Pick<OrchestrationPlan, "reasoningMode" | "toolSequence" | "summary"> | null;
  componentGuide?: {
    componentId: string;
    userQuery: string;
    focus: "installation" | "example" | "props" | "mixed";
  } | null;
}

type ComponentGuideFocus = NonNullable<SystemPromptContext["componentGuide"]>["focus"];

const baseSystemPrompt = `You are the SEED Design Assistant, an AI helper embedded in the SEED Design documentation site.
SEED Design is the design system for Karrot (당근), a Korean secondhand marketplace app.

## Core Role
- Resolve user intent with the minimum necessary tool calls
- Keep responses conversational and natural, even when tools are used
- Use tools as the source of truth for technical details
- Avoid repeating tool output in plain text

## Response Style
- Interleave short text and tool calls:
  1) one short setup sentence
  2) relevant tool call
  3) one short interpretation sentence
  4) optional next tool call if needed
- Keep connective text to 1-2 short sentences between tool calls
- Do not use rigid markdown sections for installation/example/props unless the user explicitly asks for that format
- Do not dump raw fenced code in plain text when a render tool is available
- Respond in the same language as the user (default: Korean)

## Tool Usage Principles
- Select tools dynamically from runtime catalog
- Prefer low-risk and high-signal tools first
- For broad questions: discover/search first, then fetch details
- Use icon tools only when the user explicitly asks about icons
- For installation questions: installation tool before preview tool
- For props/type questions: type-focused tool only unless user asks for more

## Safety & Reliability
- Never invent commands, URLs, or API details
- If a tool fails, acknowledge briefly and choose the next best tool or ask one concise clarifying question
- If verified links are provided at runtime, use only those for final link bullets
`;

function buildRuntimeToolCatalogPrompt(toolCatalog: ToolDescriptor[]): string {
  return `

## Runtime Tool Catalog
Available tools for this request:
${serializeToolCatalog(toolCatalog)}

- Use this catalog instead of hardcoded tool names.
- Tool names in calls must come from this catalog.
`;
}

function buildOrchestrationPrompt(
  orchestrationPlan: NonNullable<SystemPromptContext["orchestrationPlan"]>,
): string {
  const toolSequence = orchestrationPlan.toolSequence.length > 0
    ? orchestrationPlan.toolSequence.map((name, index) => `${index + 1}) ${name}`).join("\n")
    : "- (none)";

  return `

## Runtime Orchestration Plan
- reasoningMode: ${orchestrationPlan.reasoningMode}
- summary: ${orchestrationPlan.summary || "(none)"}
- suggested tool sequence:
${toolSequence}

- Follow this plan when it matches the user's latest intent.
- If the plan is clearly mismatched, adapt and continue with the best tool sequence.
`;
}

function buildComponentGuidePrompt(
  context: NonNullable<SystemPromptContext["componentGuide"]>,
): string {
  const focusGuidanceByMode: Record<ComponentGuideFocus, string> = {
    installation:
      "Prefer installation-first flow: short setup text -> installation tool -> short transition text -> preview/code tool.",
    example:
      "Prefer example-first flow: short setup text -> preview/code tool -> short transition text -> installation tool.",
    props: "Use props/type tool first. Do not call installation/preview tools unless explicitly requested.",
    mixed:
      "Use balanced flow. Start with the most actionable tool for the question and keep follow-up tools minimal.",
  };

  return `

## Runtime Mode: Component Guide
- Resolved component: ${context.componentId}
- Original user query: ${context.userQuery}
- Focus: ${context.focus}

${focusGuidanceByMode[context.focus]}
`;
}

function buildVerifiedLinksPrompt(verifiedLinks: NonNullable<SystemPromptContext["verifiedLinks"]>): string {
  const verifiedLinkBullets = verifiedLinks
    .map((link) => `- [${link.title}](${link.url})`)
    .join("\n");

  return `

## Runtime Verified Links
${verifiedLinkBullets || "- (none)"}

- If verified links are listed, end with 1-3 markdown bullet links from this list only.
- If none are listed, omit final link bullets.
`;
}

export function buildSystemPrompt(context?: SystemPromptContext): string {
  const toolCatalog = context?.toolCatalog ?? [];
  const verifiedLinks = context?.verifiedLinks ?? [];
  const sections = [baseSystemPrompt];

  sections.push(buildRuntimeToolCatalogPrompt(toolCatalog));
  sections.push(buildVerifiedLinksPrompt(verifiedLinks));

  if (context?.orchestrationPlan) {
    sections.push(buildOrchestrationPrompt(context.orchestrationPlan));
  }

  if (context?.componentGuide) {
    sections.push(buildComponentGuidePrompt(context.componentGuide));
  }

  return sections.join("\n");
}

export const systemPrompt = baseSystemPrompt;
