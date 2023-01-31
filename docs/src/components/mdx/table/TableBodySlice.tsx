import clsx from "clsx";

import * as style from "./table.css";

export default function TableBody(props: Object) {
  return <tbody className={clsx(style.tableBody)} {...props} />;
}
