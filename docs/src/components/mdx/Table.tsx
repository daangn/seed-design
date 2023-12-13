import clsx from "clsx";
import type { HTMLAttributes } from "react";

import * as style from "./Table.css";

export const Table = (props: HTMLAttributes<HTMLTableElement>) => {
  const { className, ...rest } = props;
  return (
    <div className={style.tableWrapper}>
      <table className={clsx(style.table, className)} {...rest}></table>
    </div>
  );
};

export const TableHead = (props: HTMLAttributes<HTMLTableSectionElement>) => {
  const { className, ...rest } = props;
  return <thead className={clsx(style.tableHead, className)} {...rest}></thead>;
};

export const TableBody = (props: HTMLAttributes<HTMLTableSectionElement>) => {
  const { className, ...rest } = props;
  return <tbody className={clsx(style.tableBody, className)} {...rest}></tbody>;
};

export const TableRow = (props: HTMLAttributes<HTMLTableRowElement>) => {
  const { className, ...rest } = props;
  return <tr className={clsx(style.tableRow, className)} {...rest}></tr>;
};

export const TableData = (props: HTMLAttributes<HTMLTableCellElement>) => {
  const { className, ...rest } = props;
  return <td className={clsx(style.tableData, className)} {...rest}></td>;
};
