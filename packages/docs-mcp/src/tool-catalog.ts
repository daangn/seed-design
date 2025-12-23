/**
 * Tool Catalog - Static index for tool discovery
 *
 * This catalog helps agents discover available tools and understand when to use each one.
 * Based on the "Tool Search Tool" pattern from Anthropic.
 */

export interface ToolCatalogEntry {
  /** Tool name as registered in MCP */
  name: string;
  /** Brief description of what the tool does */
  description: string;
  /** Scenarios when this tool should be used */
  whenToUse: string[];
  /** Keywords for search matching */
  keywords: string[];
  /** Example arguments for the tool */
  exampleArgs?: Record<string, string>;
  /** Tool category for grouping */
  category: "discovery" | "react" | "breeze" | "design-guidelines" | "rootage";
}

export const TOOL_CATALOG: ToolCatalogEntry[] = [
  // ============================================================================
  // Discovery Tool
  // ============================================================================
  {
    name: "discover_tools",
    description: "Discover available tools in this MCP server and learn when to use each tool",
    whenToUse: [
      "When first connecting to SEED Design MCP",
      "When unsure which tool to use for a task",
      "When exploring what documentation is available",
    ],
    keywords: ["help", "tools", "available", "discover", "find", "search", "what", "how"],
    category: "discovery",
  },

  // ============================================================================
  // React Component Tools
  // ============================================================================
  {
    name: "list_react_components",
    description: "List all available SEED React components",
    whenToUse: [
      "When looking for a specific UI component",
      "When exploring available components",
      "Before using get_react_component",
    ],
    keywords: ["component", "list", "react", "ui", "button", "modal", "input", "all"],
    category: "react",
  },
  {
    name: "get_react_component",
    description: "Get complete documentation for a specific SEED React component",
    whenToUse: [
      "When implementing a specific component",
      "When needing props, API, or usage examples",
      "When troubleshooting component issues",
    ],
    keywords: ["component", "props", "api", "usage", "example", "implementation"],
    exampleArgs: { componentName: "action-button" },
    category: "react",
  },
  {
    name: "get_react_changelog",
    description: "Get the React changelog with version history and updates",
    whenToUse: [
      "When checking what changed in a version",
      "When looking for breaking changes",
      "When planning upgrades",
    ],
    keywords: ["changelog", "version", "release", "update", "breaking", "history"],
    category: "react",
  },

  // ============================================================================
  // React Getting Started
  // ============================================================================
  {
    name: "list_react_getting_started",
    description: "List getting started topics (installation, CLI, styling)",
    whenToUse: [
      "When setting up a new project with SEED Design",
      "When configuring a bundler (Vite, Webpack, Rsbuild)",
      "When setting up CLI or theming",
    ],
    keywords: [
      "install",
      "setup",
      "start",
      "begin",
      "vite",
      "webpack",
      "rsbuild",
      "cli",
      "theme",
      "init",
    ],
    category: "react",
  },
  {
    name: "get_react_getting_started",
    description: "Get a specific getting started document",
    whenToUse: [
      "When following installation steps for a specific bundler",
      "When configuring CLI commands",
      "When setting up theming or Tailwind CSS",
    ],
    keywords: [
      "install",
      "setup",
      "cli",
      "theme",
      "tailwind",
      "vite",
      "webpack",
      "rsbuild",
      "manual",
    ],
    exampleArgs: { path: "installation/vite" },
    category: "react",
  },

  // ============================================================================
  // React Stackflow
  // ============================================================================
  {
    name: "list_react_stackflow",
    description: "List Stackflow integration topics",
    whenToUse: [
      "When using SEED Design with Stackflow",
      "When implementing native-like navigation",
      "When building mobile web apps",
    ],
    keywords: ["stackflow", "navigation", "screen", "app", "mobile", "native"],
    category: "react",
  },
  {
    name: "get_react_stackflow",
    description: "Get Stackflow integration documentation",
    whenToUse: [
      "When setting up Stackflow with SEED Design",
      "When using AlertDialog or BottomSheet in Stackflow context",
      "When implementing AppScreen",
    ],
    keywords: [
      "stackflow",
      "app-screen",
      "navigation",
      "alert-dialog",
      "bottom-sheet",
      "menu-sheet",
    ],
    exampleArgs: { path: "getting-started" },
    category: "react",
  },

  // ============================================================================
  // React Developer Tools
  // ============================================================================
  {
    name: "list_react_developer_tools",
    description: "List developer tools topics (codemods, Figma integration)",
    whenToUse: [
      "When automating code migrations",
      "When integrating with Figma",
      "When looking for development utilities",
    ],
    keywords: ["codemod", "figma", "tool", "migrate", "transform", "codegen", "automation"],
    category: "react",
  },
  {
    name: "get_react_developer_tools",
    description: "Get developer tools documentation",
    whenToUse: [
      "When running codemods for migration",
      "When setting up Figma codegen",
      "When learning about available transforms",
    ],
    keywords: ["codemod", "figma", "transform", "codegen", "migration"],
    exampleArgs: { path: "codemods/introduction" },
    category: "react",
  },

  // ============================================================================
  // React Migration
  // ============================================================================
  {
    name: "list_react_migration",
    description: "List migration guide topics",
    whenToUse: [
      "When upgrading from a previous version",
      "When migrating icons",
      "When planning a migration strategy",
    ],
    keywords: ["migrate", "upgrade", "version", "icon", "breaking", "guide"],
    category: "react",
  },
  {
    name: "get_react_migration",
    description: "Get migration guide documentation",
    whenToUse: [
      "When following step-by-step migration instructions",
      "When migrating icons to new format",
      "When handling breaking changes",
    ],
    keywords: ["migrate", "upgrade", "icon", "guide", "step"],
    exampleArgs: { path: "guide" },
    category: "react",
  },

  // ============================================================================
  // React AI Integration
  // ============================================================================
  {
    name: "list_react_ai_integration",
    description: "List AI integration topics (LLMs.txt, MCP)",
    whenToUse: [
      "When integrating SEED Design with AI tools",
      "When setting up MCP server",
      "When understanding LLMs.txt format",
    ],
    keywords: ["ai", "llm", "mcp", "integration", "claude", "model", "context", "protocol"],
    category: "react",
  },
  {
    name: "get_react_ai_integration",
    description: "Get AI integration documentation",
    whenToUse: [
      "When configuring MCP server for Claude",
      "When understanding LLMs.txt specification",
      "When integrating AI tools with SEED Design",
    ],
    keywords: ["ai", "llm", "mcp", "claude", "protocol", "specification"],
    exampleArgs: { path: "mcp" },
    category: "react",
  },

  // ============================================================================
  // React Updates
  // ============================================================================
  {
    name: "list_react_updates",
    description: "List updates and version improvement topics",
    whenToUse: [
      "When learning about new features",
      "When exploring version improvements",
      "When checking release highlights",
    ],
    keywords: ["update", "improvement", "feature", "new", "v3", "release"],
    category: "react",
  },
  {
    name: "get_react_updates",
    description: "Get version updates documentation",
    whenToUse: ["When learning about v3 improvements", "When exploring new features in detail"],
    keywords: ["update", "improvement", "v3", "feature"],
    exampleArgs: { path: "v3-improvements" },
    category: "react",
  },

  // ============================================================================
  // Breeze Tools
  // ============================================================================
  {
    name: "list_breeze_components",
    description: "List all Breeze utility components",
    whenToUse: ["When looking for utility components", "When exploring Breeze library"],
    keywords: ["breeze", "utility", "component", "animate", "number"],
    category: "breeze",
  },
  {
    name: "get_breeze_component",
    description: "Get documentation for a specific Breeze component",
    whenToUse: [
      "When implementing a Breeze component",
      "When needing AnimateNumber or other utilities",
    ],
    keywords: ["breeze", "animate", "number", "utility"],
    exampleArgs: { componentName: "animate-number" },
    category: "breeze",
  },

  // ============================================================================
  // Design Guidelines Tools
  // ============================================================================
  {
    name: "list_docs_components",
    description: "List component design guidelines",
    whenToUse: [
      "When understanding component design principles",
      "When reviewing UI/UX guidelines",
    ],
    keywords: ["design", "guideline", "ux", "ui", "principle", "anatomy"],
    category: "design-guidelines",
  },
  {
    name: "get_docs_component",
    description: "Get design guidelines for a specific component",
    whenToUse: [
      "When understanding component anatomy and usage",
      "When reviewing design recommendations",
    ],
    keywords: ["design", "guideline", "anatomy", "variant", "usage"],
    exampleArgs: { componentName: "action-button" },
    category: "design-guidelines",
  },
  {
    name: "list_foundation",
    description: "List foundation topics (color, typography, spacing, etc.)",
    whenToUse: ["When exploring design foundation", "When understanding design tokens"],
    keywords: ["foundation", "color", "typography", "spacing", "design", "token"],
    category: "design-guidelines",
  },
  {
    name: "get_foundation",
    description: "Get foundation documentation",
    whenToUse: [
      "When implementing color, typography, or spacing",
      "When understanding design token system",
    ],
    keywords: ["foundation", "color", "typography", "spacing", "token"],
    exampleArgs: { topic: "color/palette" },
    category: "design-guidelines",
  },

  // ============================================================================
  // Rootage Tools
  // ============================================================================
  {
    name: "get_rootage",
    description: "Get SEED Design rootage specification (design tokens and component specs)",
    whenToUse: [
      "When needing exact design token values",
      "When implementing component specifications",
      "When building custom components matching SEED Design",
    ],
    keywords: ["rootage", "token", "spec", "specification", "json", "value", "exact"],
    exampleArgs: { path: "/components/action-button.json" },
    category: "rootage",
  },
];

/**
 * Simple keyword matching for tool search
 */
export function matchesQuery(entry: ToolCatalogEntry, query: string): boolean {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);

  // Check if any query word matches keywords
  const keywordMatch = queryWords.some((word) =>
    entry.keywords.some((keyword) => keyword.includes(word) || word.includes(keyword)),
  );

  // Check if query matches description
  const descriptionMatch = entry.description.toLowerCase().includes(queryLower);

  // Check if query matches tool name
  const nameMatch = entry.name.toLowerCase().includes(queryLower);

  // Check if query matches any whenToUse
  const whenToUseMatch = entry.whenToUse.some((use) => use.toLowerCase().includes(queryLower));

  return keywordMatch || descriptionMatch || nameMatch || whenToUseMatch;
}

/**
 * Get all tools in the catalog
 */
export function getToolCatalog(): ToolCatalogEntry[] {
  return TOOL_CATALOG;
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: ToolCatalogEntry["category"]): ToolCatalogEntry[] {
  return TOOL_CATALOG.filter((entry) => entry.category === category);
}
