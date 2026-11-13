import { getRootage } from "@/lib/rootage";
import { buildSeoMetadata } from "@/lib/seo";
import { getDefaultModes, stringifyValueLit } from "@/components/rootage";
import { TableRoot } from "@/components/table";
import { TokenLink } from "@/components/token-link";
import { TypeIndicator } from "@/components/type-indicator";
import { IconArrowRightLine } from "@karrotmarket/react-monochrome-icon";
import { resolveReferences, resolveToken } from "@seed-design/rootage-core";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";

export const dynamic = "force-static";

function decodeTokenIdFromParams(id: string) {
  return decodeURIComponent(id) as `$${string}`;
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const rootage = await getRootage();
  const tokenId = decodeTokenIdFromParams(params.id);
  const decl = rootage.tokenEntities[tokenId];
  if (!decl) notFound();

  const collection = decl.collection;
  const modes = rootage.tokenCollectionEntities[collection].modes;
  const defaultModes = getDefaultModes(rootage);

  const resolvedTokens = modes.map(({ id: mode }) => {
    const resolved = resolveToken(rootage, tokenId, {
      ...defaultModes,
      [collection]: mode,
    });
    return { mode, resolved };
  });
  const references = resolveReferences(rootage, tokenId, defaultModes);

  return (
    <DocsPage tableOfContent={{ enabled: false }}>
      <DocsTitle>{tokenId}</DocsTitle>
      <DocsDescription>{decl.description}</DocsDescription>
      <DocsBody className="prose-p:break-keep prose-p:text-pretty prose-headings:text-balance">
        <h2>Definition</h2>
        {resolvedTokens.map(({ mode, resolved: { path, value } }) => (
          <Fragment key={mode}>
            <h3>{mode}</h3>
            <div className="flex items-center space-x-2">
              {path.map((id) => {
                const tokenDesc = rootage.tokenEntities[id]?.description;
                return (
                  <Fragment key={id}>
                    <div className="flex flex-col gap-1 px-3 py-2 bg-fd-background rounded-md border border-fd-border">
                      <div className="flex items-center space-x-2">
                        <TypeIndicator value={value} />
                        <TokenLink id={id} />
                      </div>
                      {tokenDesc && (
                        <span className="text-fd-muted-foreground text-sm text-pretty break-keep">
                          {tokenDesc}
                        </span>
                      )}
                    </div>
                    <IconArrowRightLine className="w-4 h-4" />
                  </Fragment>
                );
              })}
              <div className="flex items-center space-x-2 px-3 py-2 bg-fd-background rounded-md border border-fd-border">
                <TypeIndicator value={value} />
                <div>{stringifyValueLit(value)}</div>
              </div>
            </div>
          </Fragment>
        ))}
        <h2>References</h2>
        <TableRoot>
          <thead>
            <tr>
              <th>이름</th>
            </tr>
          </thead>
          <tbody>
            {references.map((ref) => (
              <tr key={ref}>
                <td>{ref.startsWith("$") ? <TokenLink id={ref} /> : ref}</td>
              </tr>
            ))}
          </tbody>
        </TableRoot>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const rootage = await getRootage();

  return rootage.tokenIds.map((id) => ({
    id,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const rootage = await getRootage();
  const tokenId = decodeTokenIdFromParams(params.id);
  const decl = rootage.tokenEntities[tokenId];
  if (!decl) notFound();

  return buildSeoMetadata({ title: tokenId, description: decl.description ?? undefined });
}
