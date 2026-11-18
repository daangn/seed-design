import { Fragment } from "react";
import { TokenCell } from "../token-cell";
import { TokenMappingItem } from "./color-migration-index";

export function ColorMigrationRow({ item }: { item: TokenMappingItem }) {
  // 펼침 상태는 이 행 하나(`tr`의 `data-expanded`)를 모든 새 토큰 셀이 공유한다. 누르는 곳은 각 셀 div이고
  // `expand` widget(`src/mdx/widgets.ts`)이 가장 가까운 `tr`을 토글한다.
  return (
    <tr key={item.previousTokenId} className="group/expand">
      <td>{item.previousTokenId}</td>
      <td className="align-middle space-y-2">
        {item.newTokens.length > 0 &&
          item.newTokens.map((newToken, index) => {
            const canExpand = newToken.values.length > 1;
            return (
              <Fragment key={newToken.id}>
                <div
                  data-widget={canExpand ? "expand" : undefined}
                  className={
                    canExpand
                      ? "cursor-zoom-in group-data-expanded/expand:cursor-zoom-out"
                      : undefined
                  }
                >
                  <TokenCell values={newToken.values} resolvedValue={newToken.resolvedValue} />
                </div>
                {index !== item.newTokens.length - 1 && (
                  <div className="text-xs text-center">또는</div>
                )}
              </Fragment>
            );
          })}
      </td>
      <td>{item.description}</td>
    </tr>
  );
}
