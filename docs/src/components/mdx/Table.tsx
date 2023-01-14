import clsx from "clsx";

import * as style from "./Table.css";

export const Table = (props: Object) => (
  <div className={style.tableWrapper}>
    <table className={clsx(style.table)} {...props}></table>
  </div>
);

export const TableHead = (props: Object) => (
  <thead className={clsx(style.tableHead)} {...props}></thead>
);

export const TableBody = (props: Object) => (
  <tbody className={clsx(style.tableBody)} {...props}></tbody>
);

export const TableRow = (props: Object) => (
  <tr className={clsx(style.tableRow)} {...props}></tr>
);

export const TableData = (props: Object) => (
  <td className={clsx(style.tableData)} {...props}></td>
);
