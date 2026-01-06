import { baseUrl } from "@/app/metadata";

export const revalidate = false;

export async function GET() {
  return new Response(`# SEED Design React Documentation for LLMs

## Documentation Sets

- [Complete documentation](${new URL("/react/llms-full.txt", baseUrl)}): The complete SEED Design React documentation.
- [Components Entry](${new URL("/react/llms-components.txt", baseUrl)}): Entry point for accessing individual component documentation.
- [Changelog](${new URL("/react/llms-changelog.txt", baseUrl)}): Latest updates and version history of SEED Design React.

## Documentation Sections

- [Getting Started](${new URL("/react/llms-getting-started.txt", baseUrl)}): Installation guides, CLI usage, and styling/theming configuration.
- [Stackflow](${new URL("/react/llms-stackflow.txt", baseUrl)}): Stackflow integration for native-like navigation.
- [Developer Tools](${new URL("/react/llms-developer-tools.txt", baseUrl)}): Codemods for automated migrations and Figma integration.
- [Migration](${new URL("/react/llms-migration.txt", baseUrl)}): Migration guides for upgrading from previous versions.
- [AI Integration](${new URL("/react/llms-ai-integration.txt", baseUrl)}): LLMs.txt specification and MCP integration guides.
- [Updates](${new URL("/react/llms-updates.txt", baseUrl)}): Version improvements and release notes.

## Notes

- The complete documentation includes all content from the official documentation
- Package-specific documentation files contain only the content relevant to that package
- The content is automatically generated from the same source as the official documentation`);
}
