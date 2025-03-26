export const revalidate = false;

export async function GET() {
  return new Response(`
# SEED Design React Documentation for LLMs

## Documentation Sets

- [Complete documentation](/react/llms-full.txt): The complete SEED Design React documentation.
- [Components](/react/llms-components.txt): Documentation for all components in SEED Design React.

## Notes

- The complete documentation includes all content from the official documentation
- Package-specific documentation files contain only the content relevant to that package
- The content is automatically generated from the same source as the official documentation`);
}
