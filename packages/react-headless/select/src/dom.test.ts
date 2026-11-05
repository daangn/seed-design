import { describe, expect, it } from "bun:test";
import {
  findEnabledIndex,
  findFirstEnabledIndex,
  findLastEnabledIndex,
  findSelectedIndex,
  getOptionValue,
  isDisabledElement,
} from "./dom";

interface OptionSpec {
  value?: string;
  disabled?: boolean;
}

/** Builds the element list the hook reads out of `elementsRef`; `null` is an unmounted slot. */
function createOptions(specs: (OptionSpec | null)[]) {
  return specs.map((spec) => {
    if (spec == null) return null;

    const element = document.createElement("div");
    if (spec.value != null) element.setAttribute("data-value", spec.value);
    if (spec.disabled) element.setAttribute("aria-disabled", "true");
    return element;
  });
}

const createEnabledOptions = (...values: string[]) =>
  createOptions(values.map((value) => ({ value })));

describe("isDisabledElement", () => {
  it("treats a missing element as disabled", () => {
    expect(isDisabledElement(null)).toBe(true);
  });

  it("reads aria-disabled, counting only the literal 'true'", () => {
    const [enabled, disabled] = createOptions([{ value: "a" }, { value: "b", disabled: true }]);

    expect(isDisabledElement(enabled)).toBe(false);
    expect(isDisabledElement(disabled)).toBe(true);

    enabled?.setAttribute("aria-disabled", "false");
    expect(isDisabledElement(enabled)).toBe(false);
  });
});

describe("getOptionValue", () => {
  it("reads data-value off the option element", () => {
    const [element] = createEnabledOptions("apple");

    expect(getOptionValue(element)).toBe("apple");
  });

  it("returns null for a missing element or a missing attribute", () => {
    const [withoutValue] = createOptions([{}]);

    expect(getOptionValue(null)).toBeNull();
    expect(getOptionValue(withoutValue)).toBeNull();
  });
});

describe("findSelectedIndex", () => {
  it("returns null for an empty selection", () => {
    expect(findSelectedIndex(createEnabledOptions("a", "b"), [])).toBeNull();
  });

  it("returns the first match in DOM order, not in value order", () => {
    const elements = createEnabledOptions("a", "b", "c");

    expect(findSelectedIndex(elements, ["c", "b"])).toBe(1);
  });

  it("returns null when no rendered option carries a selected value", () => {
    const elements = createEnabledOptions("a", "b");

    expect(findSelectedIndex(elements, ["z"])).toBeNull();
  });

  it("skips unmounted slots and options without a data-value", () => {
    const elements = createOptions([null, {}, { value: "a" }]);

    expect(findSelectedIndex(elements, ["a"])).toBe(2);
  });

  it("matches a disabled option too — selection survives an option going disabled", () => {
    const elements = createOptions([{ value: "a" }, { value: "b", disabled: true }]);

    expect(findSelectedIndex(elements, ["b"])).toBe(1);
  });
});

describe("findFirstEnabledIndex", () => {
  it("skips leading disabled options", () => {
    const elements = createOptions([
      { value: "a", disabled: true },
      { value: "b" },
      { value: "c" },
    ]);

    expect(findFirstEnabledIndex(elements)).toBe(1);
  });

  it("returns null when every option is disabled", () => {
    const elements = createOptions([
      { value: "a", disabled: true },
      { value: "b", disabled: true },
    ]);

    expect(findFirstEnabledIndex(elements)).toBeNull();
  });

  it("returns null for an empty list", () => {
    expect(findFirstEnabledIndex([])).toBeNull();
  });
});

describe("findLastEnabledIndex", () => {
  it("skips trailing disabled options", () => {
    const elements = createOptions([
      { value: "a" },
      { value: "b" },
      { value: "c", disabled: true },
    ]);

    expect(findLastEnabledIndex(elements)).toBe(1);
  });

  it("treats an unmounted slot as disabled", () => {
    const elements = createOptions([{ value: "a" }, null]);

    expect(findLastEnabledIndex(elements)).toBe(0);
  });

  it("returns null when every option is disabled", () => {
    const elements = createOptions([
      { value: "a", disabled: true },
      { value: "b", disabled: true },
    ]);

    expect(findLastEnabledIndex(elements)).toBeNull();
  });

  it("returns null for an empty list", () => {
    expect(findLastEnabledIndex([])).toBeNull();
  });
});

describe("findEnabledIndex", () => {
  it("steps to the neighbour in the given direction", () => {
    const elements = createEnabledOptions("a", "b", "c");

    expect(findEnabledIndex(elements, 0, 1)).toBe(1);
    expect(findEnabledIndex(elements, 2, -1)).toBe(1);
  });

  it("skips disabled options along the way", () => {
    const elements = createOptions([
      { value: "a" },
      { value: "b", disabled: true },
      { value: "c" },
    ]);

    expect(findEnabledIndex(elements, 0, 1)).toBe(2);
    expect(findEnabledIndex(elements, 2, -1)).toBe(0);
  });

  it("wraps around both ends", () => {
    const elements = createEnabledOptions("a", "b", "c");

    expect(findEnabledIndex(elements, 2, 1)).toBe(0);
    expect(findEnabledIndex(elements, 0, -1)).toBe(2);
  });

  it("wraps past disabled options at the far end", () => {
    const elements = createOptions([
      { value: "a", disabled: true },
      { value: "b" },
      { value: "c" },
    ]);

    expect(findEnabledIndex(elements, 2, 1)).toBe(1);
  });

  it("lands back on the starting index when it is the only enabled option", () => {
    const elements = createOptions([
      { value: "a", disabled: true },
      { value: "b" },
      { value: "c", disabled: true },
    ]);

    expect(findEnabledIndex(elements, 1, 1)).toBe(1);
    expect(findEnabledIndex(elements, 1, -1)).toBe(1);
  });

  it("returns null when every option is disabled", () => {
    const elements = createOptions([
      { value: "a", disabled: true },
      { value: "b", disabled: true },
    ]);

    expect(findEnabledIndex(elements, 0, 1)).toBeNull();
  });

  it("returns null for an empty list", () => {
    expect(findEnabledIndex([], 0, 1)).toBeNull();
  });
});
