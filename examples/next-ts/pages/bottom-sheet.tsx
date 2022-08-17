import * as bottomSheet from "@seed-design/bottom-sheet";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useEffect, useId, useRef } from "react";
import { Portal } from "../components/Portal";
import style from "./bottom-sheet.module.css";

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null);

  // Dialog 1
  const [state, send] = useMachine(
    bottomSheet.machine({
      id: useId(),
    })
  );
  const parentDialog = bottomSheet.connect(state, send, normalizeProps);

  useEffect(() => {
    console.log(state);
  }, [state]);

  // Dialog 2
  const [state2, send2] = useMachine(
    bottomSheet.machine({
      id: useId(),
    })
  );
  const childDialog = bottomSheet.connect(state2, send2, normalizeProps);

  return (
    <>
      <main>
        <div>
          <button
            className={style.trigger}
            {...parentDialog.triggerProps}
            data-testid="trigger-1"
          >
            Open
          </button>

          <div style={{ minHeight: "1200px" }} />

          {(parentDialog.isOpen || parentDialog.isClosing) && (
            <Portal>
              <div className={style.backdrop} {...parentDialog.backdropProps} />
              <div
                className={style.underlay}
                data-testid="underlay-1"
                {...parentDialog.underlayProps}
              >
                <div
                  {...parentDialog.contentProps}
                >
                  <h2 {...parentDialog.titleProps}>Edit profile</h2>
                  <p {...parentDialog.descriptionProps}>
                    Make changes to your profile here. Click save when you are
                    done.
                  </p>
                  <input
                    type="text"
                    ref={inputRef}
                    placeholder="Enter name..."
                    data-testid="input-1"
                  />
                  <button data-testid="save-button-1">Save Changes</button>

                  <button {...childDialog.triggerProps} data-testid="trigger-2">
                    Open Nested
                  </button>

                  {childDialog.isOpen && (
                    <Portal>
                      <div
                        className={style.backdrop}
                        {...childDialog.backdropProps}
                      />
                      <div
                        data-testid="underlay-2"
                        className={style.underlay}
                        {...childDialog.underlayProps}
                      >
                        <div {...childDialog.contentProps}>
                          <h2 {...childDialog.titleProps}>Nested</h2>
                          <button
                            onClick={() => parentDialog.close()}
                            data-testid="special-close"
                          >
                            Close Dialog 1
                          </button>
                        </div>
                      </div>
                    </Portal>
                  )}
                </div>
              </div>
            </Portal>
          )}
        </div>
      </main>
    </>
  );
}
