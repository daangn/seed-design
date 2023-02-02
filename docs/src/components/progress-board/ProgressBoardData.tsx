import type { PropsWithChildren } from "react";

import * as style from "./ProgressBoardData.css";
import type { ProgressStatus } from "./types";

const ProgressBoardData = ({
  children,
  status,
}: PropsWithChildren<{ status: ProgressStatus }>) => {
  switch (status) {
    case "todo":
      return (
        <td className={style.todoData}>
          <p className={style.todoText}>TO DO</p>
          {children}
        </td>
      );
    case "in-progress":
      return (
        <td className={style.inProgressData}>
          <p className={style.inProgressText}>IN PROGRESS</p>
          {children}
        </td>
      );
    case "done":
      return (
        <td className={style.doneData}>
          <p className={style.doneText}>DONE</p>
          {children}
        </td>
      );
  }
};

export default ProgressBoardData;
