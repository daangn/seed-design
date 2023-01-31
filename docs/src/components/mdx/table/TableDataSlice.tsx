import clsx from "clsx";

import * as style from "./table.css";

export default function TableData(props: Object) {
  return <td className={clsx(style.tableData)} {...props} />;
}
