import { baseUrl } from "@/app/metadata";
import { reactSource } from "@/app/source";

export const revalidate = false;

/**
 * Entry point for accessing individual bits component documentation.
 * Each bits component can be accessed through its specific endpoint.
 */
export async function GET() {
  const bitsPages = reactSource.getPages().filter(({ slugs }) => {
    const [firstSlug] = slugs;
    return firstSlug === "bits";
  });

  const components = bitsPages
    .map(({ data, slugs }) => {
      const [_firstSlug, ...restSlugs] = slugs;

      // Attach .txt extension to the last slug
      const path = restSlugs
        .map((slug, index) => {
          if (index === restSlugs.length - 1) return `${slug}.txt`;
          return slug;
        })
        .join("/");

      const txtUrl = new URL(`/react/llms-bits/${path}`, baseUrl);

      return `- [${data.title}](${txtUrl})`;
    })
    .sort((a, b) => a.localeCompare(b));

  const response = `# SEED Design Bits Components - LLM Reference Entry

This is an entry point for accessing individual bits component documentation.
Bits are utility components that enhance your SEED Design applications.

## Available Bits Components

${components.join("\n")}

## Usage

To get information about a specific bits component, access its endpoint:
Example: /react/llms-bits/animate-number.txt

The response will include the full MDX content for that component, processed and ready for LLM consumption.

## Additional Resources

- Full components documentation: /react/llms-full.txt
- Regular components: /react/llms-components.txt
- Changelog: /react/llms-changelog.txt
`;

  return new Response(response);
}
