import "@testing-library/jest-dom/vitest";
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useCheckbox } from "./index";
import type { UseCheckboxProps } from "./index";

const renderCheckboxHook = (props: UseCheckboxProps) => renderHook(() => useCheckbox(props));

describe("useCheckbox", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with defaultChecked as true", () => {
    const { result } = renderCheckboxHook({ defaultChecked: true });
    const { hiddenInputProps } = result.current;

    expect(hiddenInputProps.checked).toBe(true);
  });

  it("renders with disabled prop", () => {
    const { result } = renderCheckboxHook({ disabled: true });
    const { hiddenInputProps } = result.current;

    expect(hiddenInputProps.disabled).toBe(true);
  });

  it("renders with required prop", () => {
    const { result } = renderCheckboxHook({ required: true });
    const { hiddenInputProps } = result.current;

    expect(hiddenInputProps.required).toBe(true);
  });
});
