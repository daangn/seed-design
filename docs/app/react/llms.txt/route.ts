import { baseUrl } from "@/app/metadata";

export const revalidate = false;

export async function GET() {
  return new Response(`# SEED Design React Documentation for LLMs

## Documentation Sets

- [Complete documentation](${new URL("/react/llms-full.txt", baseUrl)}): The complete SEED Design React documentation.
- [Components Entry](${new URL("/react/llms-components.txt", baseUrl)}): Entry point for accessing individual component documentation.
- [Changelog](${new URL("/react/llms-changelog.txt", baseUrl)}): Latest updates and version history of SEED Design React.

## Notes

- The complete documentation includes all content from the official documentation
- Package-specific documentation files contain only the content relevant to that package
- The content is automatically generated from the same source as the official documentation`);
}
