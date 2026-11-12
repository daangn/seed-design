import { IconArrowRightLine } from "@karrotmarket/react-monochrome-icon";
import type { AST } from "@seed-design/rootage-core";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { Fragment } from "react";
import { stringifyValueLit } from "@/components/rootage";
import { TableRoot } from "@/components/table";
import { TokenLink } from "@/components/token-link";
import { TypeIndicator } from "@/components/type-indicator";

export interface TokenReferencePageProps {
  tokenId: string;
  description?: string;
  /** 컬렉션의 mode별로 풀어 둔 참조 경로와 최종 값. */
  definitions: {
    mode: string;
    path: { id: string; description?: string }[];
    value: AST.ValueLit;
  }[];
  references: string[];
}

/** `/foundations/design-token/reference/<id>` 본문. 데이터는 Astro 페이지가 빌드 시점에 계산한다. */
export function TokenReferencePage({
  tokenId,
  description,
  definitions,
  references,
}: TokenReferencePageProps) {
  return (
    <DocsPage tableOfContent={{ enabled: false }}>
      <DocsTitle>{tokenId}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      <DocsBody className="prose-p:break-keep prose-p:text-pretty prose-headings:text-balance">
        <h2>Definition</h2>
        {definitions.map(({ mode, path, value }) => (
          <Fragment key={mode}>
            <h3>{mode}</h3>
            <div className="flex items-center space-x-2">
              {path.map((token) => (
                <Fragment key={token.id}>
                  <div className="flex flex-col gap-1 px-3 py-2 bg-fd-background rounded-md border border-fd-border">
                    <div className="flex items-center space-x-2">
                      <TypeIndicator value={value} />
                      <TokenLink id={token.id} />
                    </div>
                    {token.description && (
                      <span className="text-fd-muted-foreground text-sm text-pretty break-keep">
                        {token.description}
                      </span>
                    )}
                  </div>
                  <IconArrowRightLine className="w-4 h-4" />
                </Fragment>
              ))}
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
