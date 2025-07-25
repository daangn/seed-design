import { globby } from "globby";
import matter from "gray-matter";
import * as fs from "node:fs/promises";
import { processContent } from "../../../_llms/process-content";

export const revalidate = false;

/**
 * This is an entry point for accessing individual component documentation.
 * Each component can be accessed through its specific endpoint.
 */
export async function generateStaticParams() {
  const files = await globby([
    "./content/react/components/**/*.mdx",
    "!./content/react/components/concepts/**/*.mdx",
  ]);

  const params = files.map((file) => {
    const relativePath = file.replace("./content/react/components/", "");
    const componentPath = relativePath.replace(".mdx", "");
    const cleanPath = componentPath.replace(/\(([^)]+)\)\//g, "$1/");
    const pathArray = cleanPath.split("/");

    return {
      path: pathArray,
    };
  });

  return params;
}

export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const componentPath = path.join("/");

  try {
    const possiblePaths = [`./content/react/components/${componentPath}.mdx`];

    if (path.length > 1) {
      const [firstSegment, ...restSegments] = path;
      possiblePaths.push(
        `./content/react/components/(${firstSegment})/${restSegments.join("/")}.mdx`,
      );
    }

    let filePath: string | null = null;
    let fileContent: Buffer | null = null;

    for (const path of possiblePaths) {
      try {
        fileContent = await fs.readFile(path);
        filePath = path;
        break;
      } catch {}
    }

    if (!filePath || !fileContent) {
      return new Response(`Component not found: ${componentPath}`, {
        status: 404,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const { content, data } = matter(fileContent.toString());
    const processed = await processContent(filePath, content);
    const response = `file: ${filePath}
# ${data.title}

${data.description ?? ""}

${processed}`;

    const fileName = path[path.length - 1];

    return new Response(response, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `inline; filename="${fileName}.txt"`,
      },
    });
  } catch (error) {
    console.error("Error processing component:", error);
    return new Response(
      `Error processing component ${componentPath}: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      },
    );
  }
}
