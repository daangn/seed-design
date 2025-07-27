import { globby } from "globby";

export const revalidate = false;

const BASE_URL = "https://seed-design.io";

/**
 * This is an entry point for accessing individual component documentation.
 * Each component can be accessed through its specific endpoint.
 */
export async function GET() {
  const files = await globby([
    "./content/react/components/**/*.mdx",
    "!./content/react/components/concepts/**/*.mdx", // Exclude concept pages
  ]);

  const components = files
    .map((file) => {
      const relativePath = file.replace("./content/react/components/", "");
      const componentPath = relativePath.replace(".mdx", "");
      const cleanPath = componentPath.replace(/\(([^)]+)\)\//g, "$1/");
      const apiUrl = `${BASE_URL}/react/llms-components/${cleanPath}.txt`;
      return `- [${cleanPath}](${apiUrl})`;
    })
    .sort();

  const entryContent = `# SEED Design React Components - LLM Reference Entry

This is an entry point for accessing individual component documentation.
Each component can be accessed through its specific endpoint.

## Available Components

${components.join("\n")}

## Usage

To get information about a specific component, access its endpoint:
Example: /react/llms-components/action-button

The response will include the full MDX content for that component, processed and ready for LLM consumption.

## Additional Resources

- Full components documentation (all in one): /react/llms-full.txt
- Changelog: /react/llms-changelog.txt
`;

  return new Response(entryContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'inline; filename="llms-components.txt"',
    },
  });
}
