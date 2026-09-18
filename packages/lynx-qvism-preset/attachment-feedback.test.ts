import { describe, expect, it } from "bun:test";
import { attachmentInputItem, attachmentInputTrigger } from "./src/recipes/attachment-input";
import {
  attachmentInputItemRemoveButton,
  attachmentInputTrigger as triggerVars,
} from "./src/vars/component";

describe("attachment press feedback", () => {
  it("keeps trigger active and pressed backgrounds gated and leaves transform to the hook", () => {
    expect(attachmentInputTrigger.variants.disabled.false.root["&:active"]).toEqual({
      backgroundColor: triggerVars.base.pressed.root.color,
    });
    expect(attachmentInputTrigger.variants.disabled.true).not.toHaveProperty("root");
    expect(attachmentInputTrigger.variants.pressed.true).toEqual({});
    expect(attachmentInputTrigger.compoundVariants).toContainEqual({
      disabled: false,
      pressed: true,
      css: { root: { backgroundColor: triggerVars.base.pressed.root.color } },
    });
    expect(attachmentInputTrigger.base.root.transition).toBe("background-color 0.2s");
  });

  it("applies remove feedback independently of the item and only when interactive", () => {
    expect(attachmentInputItem.compoundVariants).toContainEqual({
      disabled: false,
      readOnly: false,
      css: {
        removeButton: {
          "&:active": { backgroundColor: attachmentInputItemRemoveButton.base.pressed.root.color },
        },
      },
    });
    expect(attachmentInputItem.compoundVariants).toContainEqual({
      disabled: false,
      readOnly: false,
      removePressed: true,
      css: {
        removeButton: { backgroundColor: attachmentInputItemRemoveButton.base.pressed.root.color },
      },
    });
    expect(attachmentInputItem.base.removeButton.transition).toBe("background-color 0.2s");
    expect(attachmentInputItem.base.actionButton).not.toHaveProperty("&:active");
  });
});
