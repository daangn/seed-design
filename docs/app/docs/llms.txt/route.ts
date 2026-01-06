import { baseUrl } from "@/app/metadata";

export const revalidate = false;

export async function GET() {
  return new Response(`# SEED Design Documentation for LLMs

## Documentation Sets

- [Components Entry](${new URL("/docs/llms-components.txt", baseUrl)}): Entry point for accessing individual component design guideline documentation.
- [Foundation Entry](${new URL("/docs/llms-foundation.txt", baseUrl)}): Entry point for accessing individual foundation documentation (color, typography, spacing, etc.).

## Notes

- The content is automatically generated from the same source as the official documentation`);
}
