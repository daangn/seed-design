import { globby } from "globby";

export const revalidate = false;

const BASE_URL = "https://seed-design.io";

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
      const apiUrl = `${BASE_URL}/react/llms-components/${cleanPath}`;
      return `- [${cleanPath}](${apiUrl})`;
    })
    .sort();

  const entryContent = `# SEED Design React Documentation for LLMs

## Documentation Sets

- [Complete documentation](${BASE_URL}/react/llms-full.txt): The complete SEED Design React documentation.
- [Changelog](${BASE_URL}/react/llms-changelog.txt): Latest updates and version history of SEED Design React.

## Individual Component Documentation

Each component can be accessed through its specific endpoint.

### Available Components

${components.join("\n")}

### Usage

To get information about a specific component, access its endpoint:
Example: /react/llms-components/action-button

The response will include the full MDX content for that component, processed and ready for LLM consumption.

## Notes

- The complete documentation includes all content from the official documentation
- Package-specific documentation files contain only the content relevant to that package
- The content is automatically generated from the same source as the official documentation`;

  return new Response(entryContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
