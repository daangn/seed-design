import { Link } from "gatsby";

import { TableData, TableRow } from "../mdx/Table";
import ProgressBoardData from "./ProgressBoardData";
import * as rowStyle from "./ProgressBoardRow.css";
import type { ProgressBoardRowInterface } from "./types";

const ProgressBoardRow = ({
  title,
  android,
  ios,
  react,
  usage,
  overview,
  style,
}: ProgressBoardRowInterface) => {
  return (
    <TableRow>
      {title && (
        <TableData>
          <strong>{title}</strong>
        </TableData>
      )}
      <ProgressBoardData status={overview?.status!}>
        {overview?.slug && overview?.status !== "todo" && (
          <Link className={rowStyle.linkText} to={overview.slug}>
            link
          </Link>
        )}
      </ProgressBoardData>

      <ProgressBoardData status={usage?.status!}>
        {usage?.slug && usage?.status !== "todo" && (
          <Link className={rowStyle.linkText} to={usage.slug}>
            link
          </Link>
        )}
      </ProgressBoardData>

      <ProgressBoardData status={style?.status!}>
        {style?.slug && style?.status !== "todo" && (
          <Link className={rowStyle.linkText} to={style.slug}>
            link
          </Link>
        )}
      </ProgressBoardData>

      <ProgressBoardData status={react?.status!}>
        {react?.path && react?.status !== "todo" && (
          <a href={react.path} className={rowStyle.linkText} target="_blank">
            link
          </a>
        )}
      </ProgressBoardData>

      <ProgressBoardData status={ios?.status!}>
        {ios?.path && ios?.status !== "todo" && (
          <a href={ios.path} className={rowStyle.linkText} target="_blank">
            link
          </a>
        )}
      </ProgressBoardData>

      <ProgressBoardData status={android?.status!}>
        {android?.path && android?.status !== "todo" && (
          <a href={android.path} className={rowStyle.linkText} target="_blank">
            link
          </a>
        )}
      </ProgressBoardData>
    </TableRow>
  );
};

export default ProgressBoardRow;
