import { Link } from "gatsby";

import { TableData, TableRow } from "../mdx/Table";
import * as rowStyle from "./ProgressBoardRow.css";
import type { ProgressBoardRowInterface } from "./types";

const StatusText = {
  todo: "To do",
  "in-progress": "In Progress",
  done: "Done",
};

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

      <td className={rowStyle.td}>
        <Link
          aria-disabled={style?.status === "todo"}
          className={rowStyle.linkText({
            status: style?.status,
          })}
          to={style?.slug!}
        >
          {StatusText[style?.status!]}
        </Link>
      </td>

      <td className={rowStyle.td}>
        <Link
          aria-disabled={overview?.status === "todo"}
          className={rowStyle.linkText({
            status: overview?.status,
          })}
          to={overview?.slug!}
        >
          {StatusText[overview?.status!]}
        </Link>
      </td>

      <td className={rowStyle.td}>
        <Link
          aria-disabled={usage?.status === "todo"}
          className={rowStyle.linkText({
            status: usage?.status,
          })}
          to={usage?.slug!}
        >
          {StatusText[usage?.status!]}
        </Link>
      </td>

      <td className={rowStyle.td}>
        <a
          aria-disabled={react?.status === "todo"}
          className={rowStyle.linkText({
            status: react?.status,
          })}
          href={react?.path!}
        >
          {StatusText[react?.status!]}
        </a>
      </td>

      <td className={rowStyle.td}>
        <a
          aria-disabled={ios?.status === "todo"}
          className={rowStyle.linkText({
            status: ios?.status,
          })}
          href={ios?.path!}
        >
          {StatusText[ios?.status!]}
        </a>
      </td>

      <td className={rowStyle.td}>
        <a
          aria-disabled={android?.status === "todo"}
          className={rowStyle.linkText({
            status: android?.status,
          })}
          href={android?.path!}
        >
          {StatusText[android?.status!]}
        </a>
      </td>
    </TableRow>
  );
};

export default ProgressBoardRow;
