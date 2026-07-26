import type { GeneratedRegistryItem } from "@/registry/schema";
import { SeedCodeTabs, SeedDynamicCodeBlock } from "@/components/codeblock";

interface BlockCodeTabsProps {
  name: string;
}

export async function BlockCodeTabs({ name }: BlockCodeTabsProps) {
  const blockJson = (await import(`@/public/__registry__/react/block/${name}.json`).then(
    (m) => m.default,
  )) as GeneratedRegistryItem;

  const depFiles: { path: string; content: string }[] = [];

  if (blockJson.innerDependencies) {
    const depJsons = await Promise.all(
      blockJson.innerDependencies.flatMap((dep) =>
        dep.itemIds.map((itemId) =>
          import(`@/public/__registry__/react/${dep.registryId}/${itemId}.json`).then(
            (m) => m.default as GeneratedRegistryItem,
          ),
        ),
      ),
    );

    for (const depJson of depJsons) {
      for (const snippet of depJson.snippets) {
        depFiles.push({ path: snippet.path, content: snippet.content });
      }
    }
  }

  const mainSnippet = blockJson.snippets[0];
  const allFiles = [{ path: mainSnippet.path, content: mainSnippet.content }, ...depFiles];

  if (allFiles.length === 1) {
    return <SeedDynamicCodeBlock lang="tsx" code={allFiles[0].content} />;
  }

  return (
    <SeedCodeTabs
      items={allFiles.map((file) => ({
        value: file.path,
        label: file.path,
        lang: "tsx",
        code: file.content,
      }))}
    />
  );
}
