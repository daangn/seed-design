import { describe, expect, it } from "bun:test";

import dialog from "./src/recipes/dialog";
import alertDialog from "./src/recipes/alert-dialog";
import { alertDialog as alertDialogVars, dialog as dialogVars } from "./src/vars/component";

describe("Lynx dialog motion", () => {
  it("fades content without scaling it during exit", () => {
    expect(dialog.base.content["&.ui-closed"]).toMatchObject({
      opacity: dialogVars.base.enabled.content.exitOpacity,
      transform: "scale(1)",
    });
    expect(alertDialog.base.content["&.ui-closed"]).toMatchObject({
      opacity: alertDialogVars.base.enabled.content.exitOpacity,
      transform: "scale(1)",
    });
  });

  it("retains the scale animation for enter", () => {
    expect(dialog.base.content["&.ui-entering"]?.["--seed-enter-scale"]).toBe(
      dialogVars.base.enabled.content.enterScale,
    );
    expect(alertDialog.base.content["&.ui-entering"]?.["--seed-enter-scale"]).toBe(
      alertDialogVars.base.enabled.content.enterScale,
    );
  });
});
