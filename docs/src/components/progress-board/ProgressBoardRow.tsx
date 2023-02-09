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

      <td className={rowStyle.td({ status: style?.status })}>
        <Link
          aria-disabled={style?.status === "todo"}
          className={rowStyle.linkText({
            disabled: style?.status === "todo",
          })}
          to={style?.slug!}
        >
          {StatusText[style?.status!]}
        </Link>
      </td>

      <td className={rowStyle.td({ status: overview?.status })}>
        <Link
          aria-disabled={overview?.status === "todo"}
          className={rowStyle.linkText({
            disabled: overview?.status === "todo",
          })}
          to={overview?.slug!}
        >
          {StatusText[overview?.status!]}
        </Link>
      </td>

      <td className={rowStyle.td({ status: usage?.status })}>
        <Link
          aria-disabled={usage?.status === "todo"}
          className={rowStyle.linkText({
            disabled: usage?.status === "todo",
          })}
          to={usage?.slug!}
        >
          {StatusText[usage?.status!]}
        </Link>
      </td>

      <td className={rowStyle.td({ status: react?.status })}>
        <a
          aria-disabled={react?.status === "todo"}
          className={rowStyle.linkText({
            disabled: react?.status === "todo",
          })}
          href={react?.path!}
        >
          {StatusText[react?.status!]}
        </a>
      </td>

      <td className={rowStyle.td({ status: ios?.status })}>
        <a
          aria-disabled={ios?.status === "todo"}
          className={rowStyle.linkText({
            disabled: ios?.status === "todo",
          })}
          href={ios?.path!}
        >
          {StatusText[ios?.status!]}
        </a>
      </td>

      <td className={rowStyle.td({ status: android?.status })}>
        <a
          aria-disabled={android?.status === "todo"}
          className={rowStyle.linkText({
            disabled: android?.status === "todo",
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
