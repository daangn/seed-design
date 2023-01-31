import clsx from "clsx";

import * as style from "./table.css";

export default function TableRow(props: Object) {
  return <tr className={clsx(style.tableRow)} {...props} />;
}
