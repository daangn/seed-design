import clsx from "clsx";
import React from "react";

import * as style from "./Table.css";

interface PropsWithChildren {
  children: React.ReactNode;
}

export const Table = ({ children }: PropsWithChildren) => (
  <table className={clsx(style.table)}>{children}</table>
);

export const TableHead = ({ children }: PropsWithChildren) => (
  <thead className={clsx(style.tableHead)}>{children}</thead>
);

export const TableBody = ({ children }: PropsWithChildren) => (
  <tbody className={clsx(style.tableBody)}>{children}</tbody>
);

export const TableRow = ({ children }: PropsWithChildren) => (
  <tr className={clsx(style.tableRow)}>{children}</tr>
);

export const TableData = ({ children }: PropsWithChildren) => (
  <td className={clsx(style.tableData)}>{children}</td>
);
