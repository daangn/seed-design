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
  figma,
  react,
}: ProgressBoardRowInterface) => {
  return (
    <TableRow>
      {title && (
        <TableData>
          <strong>{title}</strong>
        </TableData>
      )}

      <td className={rowStyle.td}>
        <a
          aria-disabled={figma?.status === "todo"}
          className={rowStyle.linkText({
            status: figma?.status,
          })}
          href={figma?.path!}
        >
          {StatusText[figma?.status!]}
        </a>
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
