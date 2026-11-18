import { IconCheckmarkClipboardLine, IconCheckmarkFill } from "@karrotmarket/react-monochrome-icon";
import { AST } from "@seed-design/rootage-core";
import { TableRoot } from "./table";
import { TokenCell, TokenValue } from "./token-cell";
import { TokenLink } from "./token-link";

function toCssVar(tokenId: string): string {
  return `--seed-${tokenId.replace(/^\$/, "").replace(/\./g, "-")}`;
}

export interface TokenTableItem {
  id: string;
  description?: string;
  values: TokenValue[];
  resolvedValue: AST.ValueLit;
}

export interface TokenTableProps {
  items: TokenTableItem[];
}

export function TokenTable(props: TokenTableProps) {
  const { items } = props;

  return (
    <TableRoot>
      <thead>
        <tr>
          <th>이름</th>
          <th>값</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          return <TokenRow key={item.id} item={item} />;
        })}
      </tbody>
    </TableRoot>
  );
}

function TokenRow(props: { item: TokenTableItem }) {
  const { item } = props;
  const { id, description, values, resolvedValue } = item;

  const canExpand = values.length > 1;

  return (
    // 펼침은 `expand` widget(`src/mdx/widgets.ts`)이 이 행의 `data-expanded`로 처리한다(정적 렌더링).
    <tr
      key={id}
      data-widget={canExpand ? "expand" : undefined}
      className={`group group/expand ${canExpand ? "cursor-zoom-in data-expanded:cursor-zoom-out" : ""}`}
    >
      <td>
        <div className="flex flex-col gap-1 min-w-0">
          <TokenLink
            id={id}
            description={description}
            trailing={
              // 복사는 `copy` widget(`src/mdx/widgets.ts`)이 `data-copy-text`로 처리한다(정적 렌더링).
              <button
                type="button"
                data-widget="copy"
                data-copy-text={toCssVar(id)}
                className="group/copy flex-none opacity-0 group-hover:opacity-100 transition-opacity text-fd-muted-foreground hover:text-fd-foreground"
                title={`CSS 변수 복사: ${toCssVar(id)}`}
                aria-label={`${toCssVar(id)} 복사`}
              >
                <IconCheckmarkFill
                  size={14}
                  className="hidden flex-none group-data-copied/copy:block"
                />
                <IconCheckmarkClipboardLine size={14} className="group-data-copied/copy:hidden" />
              </button>
            }
          />
        </div>
      </td>
      <td className="align-middle">
        <TokenCell values={values} resolvedValue={resolvedValue} />
      </td>
    </tr>
  );
}
