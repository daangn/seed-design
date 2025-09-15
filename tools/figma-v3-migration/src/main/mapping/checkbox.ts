import type { ComponentMapping, NewComponentProperties } from "./types";

export const checkboxCircleMapping: ComponentMapping<"✅ Checkbox_circle v2", "🟢 Checkbox"> = {
  oldComponent: "✅ Checkbox_circle v2",
  newComponent: "🟢 Checkbox",
  variantMap: {
    "Size:Large": "Size:Large",
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Medium",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Checkbox"> = {
      "Label#49990:0": oldProperties["Label#49990:81"].value,
      Shape: "Square",
    };

    const isPressed = oldProperties.Pressed.value === "True";
    const isHovered = oldProperties.Hovered.value === "True";
    const isDisabled = oldProperties.Disabled.value === "True";
    const isIndeterminate = oldProperties.Indeterminate.value === "True";
    const isSelected = oldProperties.Selected.value === "True";

    if (isIndeterminate) {
      if (isDisabled) {
        newProperties.State = "Disabled";
      } else if (isPressed) {
        newProperties.State = "Pressed";
      }
    } else if (isSelected) {
      if (isDisabled) {
        newProperties.State = "Disabled";
      } else if (isPressed) {
        newProperties.State = "Pressed";
      } else {
        newProperties.State = "Enabled";
      }
    } else if (isPressed || isHovered) {
      if (isDisabled) {
        newProperties.State = "Disabled";
      } else {
        newProperties.State = "Pressed";
      }
    } else {
      newProperties.State = "Enabled";
    }

    if (oldProperties.Bold.value === "True" && oldProperties.Size.value === "Medium") {
      newProperties.Weight = "Bold";
      newProperties.Size = "Large";
    }

    return newProperties;
  },
};

export const checkboxSquareMapping: ComponentMapping<"✅ Checkbox_square v2", "🟢 Checkbox"> = {
  oldComponent: "✅ Checkbox_square v2",
  newComponent: "🟢 Checkbox",
  variantMap: {
    "Size:Large": "Size:Large",
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Medium",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Checkbox"> = {
      "Label#49990:0": oldProperties["Label#49990:0"].value,
      Shape: "Square",
    };

    const isPressed = oldProperties.Pressed.value === "True";
    const isHovered = oldProperties.Hovered.value === "True";
    const isDisabled = oldProperties.Disabled.value === "True";
    const isIndeterminate = oldProperties.Indeterminate.value === "True";
    const isSelected = oldProperties.Selected.value === "True";

    if (isIndeterminate) {
      if (isDisabled) {
        newProperties.State = "Disabled";
      } else if (isPressed) {
        newProperties.State = "Pressed";
      } else {
        newProperties.State = "Enabled";
      }
    } else if (isSelected) {
      if (isDisabled) {
        newProperties.State = "Disabled";
      } else if (isPressed) {
        newProperties.State = "Pressed";
      } else {
        newProperties.State = "Enabled";
      }
    } else if (isPressed || isHovered) {
      if (isDisabled) {
        newProperties.State = "Disabled";
      } else {
        newProperties.State = "Pressed";
      }
    } else {
      newProperties.State = "Enabled";
    }

    if (oldProperties.Bold.value === "True" && oldProperties.Size.value === "Medium") {
      newProperties.Weight = "Bold";
      newProperties.Size = "Large";
    }

    return newProperties;
  },
};

export const checkboxGhostMapping: ComponentMapping<"✅ Checkbox_ghost v2", "🟢 Checkbox"> = {
  oldComponent: "✅ Checkbox_ghost v2",
  newComponent: "🟢 Checkbox",
  variantMap: {
    "Size:Large": "Size:Large",
    "Size:Medium": "Size:Medium",
    "Size:Small": "Size:Medium",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Checkbox"> = {
      "Label#49990:0": oldProperties["Label#49990:162"].value,
      Shape: "Ghost",
    };

    const isPressed = oldProperties.Pressed.value === "True";
    const isHovered = oldProperties.Hovered.value === "True";
    const isDisabled = oldProperties.Disabled.value === "True";
    const isIndeterminate = oldProperties.Indeterminate.value === "True";
    const isSelected = oldProperties.Selected.value === "True";

    if (isIndeterminate) {
      if (isDisabled) {
        newProperties.State = "Disabled";
      } else if (isPressed) {
        newProperties.State = "Pressed";
      } else {
        newProperties.State = "Enabled";
      }
    } else if (isSelected) {
      if (isDisabled) {
        newProperties.State = "Disabled";
      } else if (isPressed) {
        newProperties.State = "Pressed";
      } else {
        newProperties.State = "Enabled";
      }
    } else if (isPressed || isHovered) {
      if (isDisabled) {
        newProperties.State = "Disabled";
      } else {
        newProperties.State = "Pressed";
      }
    } else {
      newProperties.State = "Enabled";
    }

    return newProperties;
  },
};
