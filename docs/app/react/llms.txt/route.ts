export const revalidate = false;

const BASE_URL = "https://seed-design.io";

export async function GET() {
  return new Response(`
# SEED Design React Documentation for LLMs

## Documentation Sets

- [Complete documentation](${BASE_URL}/react/llms-full.txt): The complete SEED Design React documentation.
- [Components](${BASE_URL}/react/llms-components.txt): Documentation for all components in SEED Design React.
- [Changelog](${BASE_URL}/react/llms-changelog.txt): Latest updates and version history of SEED Design React.

## Notes

- The complete documentation includes all content from the official documentation
- Package-specific documentation files contain only the content relevant to that package
- The content is automatically generated from the same source as the official documentation`);
}
