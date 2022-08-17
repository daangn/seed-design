import * as menu from "@seed-design/menu";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useId } from "react";
import { Portal } from "../components/Portal";
import style from "./menu.module.css";

export default function Page() {
  const [state, send] = useMachine(
    menu.machine({ id: useId(), onSelect: console.log })
  );

  const api = menu.connect(state, send, normalizeProps);

  return (
    <main>
      <div>
        <button
          className={style.menuTrigger}
          data-testid="trigger"
          {...api.triggerProps}
        >
          Actions <span aria-hidden>▾</span>
        </button>
        <Portal>
          <div {...api.positionerProps}>
            <ul
              className={style.menuContent}
              data-testid="menu"
              {...api.contentProps}
            >
              <li {...api.getItemProps({ id: "edit" })}>Edit</li>
              <li {...api.getItemProps({ id: "duplicate" })}>Duplicate</li>
              <li {...api.getItemProps({ id: "delete" })}>Delete</li>
              <li {...api.getItemProps({ id: "export" })}>Export...</li>
            </ul>
          </div>
        </Portal>
      </div>
    </main>
  );
}
