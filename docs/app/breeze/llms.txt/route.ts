import { baseUrl } from "@/app/metadata";
import { breezeSource } from "@/app/source";

export const revalidate = false;

/**
 * Entry point for accessing individual breeze component documentation.
 * Each breeze component can be accessed through its specific endpoint.
 */
export async function GET() {
  const breezePages = breezeSource.getPages();

  const components = breezePages
    .map(({ data, slugs }) => {
      // Attach .txt extension to the last slug
      const path = slugs
        .map((slug, index) => {
          if (index === slugs.length - 1) return `${slug}.txt`;
          return slug;
        })
        .join("/");

      const txtUrl = new URL(`/breeze/llms/${path}`, baseUrl);

      return `- [${data.title}](${txtUrl})`;
    })
    .sort((a, b) => a.localeCompare(b));

  const response = `# SEED Design Breeze Components - LLM Reference Entry

This is an entry point for accessing individual breeze component documentation.
Breeze are utility components that enhance your SEED Design applications.

## Available Breeze Components

${components.join("\n")}

## Usage

To get information about a specific breeze component, access its endpoint:
Example: /breeze/llms/animate-number.txt

The response will include the full MDX content for that component, processed and ready for LLM consumption.

## Additional Resources

- Full components documentation: /react/llms-full.txt
- Regular components: /react/llms-components.txt
- Changelog: /react/llms-changelog.txt
`;

  return new Response(response);
}
