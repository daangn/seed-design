import clsx from "clsx";

import * as style from "./table.css";

export default function Table(props: Object) {
  return (
    <div className={style.tableWrapper}>
      <table className={clsx(style.table)} {...props} />
    </div>
  );
}
