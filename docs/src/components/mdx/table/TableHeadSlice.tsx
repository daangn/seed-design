import clsx from "clsx";

import * as style from "./table.css";

export default function TableHead(props: Object) {
  return <thead className={clsx(style.tableHead)} {...props} />;
}
