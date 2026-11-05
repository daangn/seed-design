import { act, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";

import { SearchInputClearButton, SearchInputInput, SearchInputRoot } from "./SearchInput";

function setUp(props: React.ComponentProps<typeof SearchInputRoot> = {}) {
  return {
    user: userEvent.setup(),
    ...render(
      <SearchInputRoot {...props}>
        <SearchInputInput aria-label="검색" />
        <SearchInputClearButton aria-label="지우기" />
      </SearchInputRoot>,
    ),
  };
}

describe("SearchInput", () => {
  it("should render a search landmark with a search input", () => {
    const { getByRole } = setUp();

    expect(getByRole("search")).toBeInTheDocument();
    expect(getByRole("searchbox")).toHaveAttribute("enterkeyhint", "search");
  });

  describe("submit", () => {
    it("should call onSubmit with the current value and blur on Enter", async () => {
      const handleSubmit = mock(() => {});
      const { getByRole, user } = setUp({ onSubmit: handleSubmit });
      const input = getByRole("searchbox");

      await user.type(input, "당근{Enter}");

      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith("당근");
      expect(input).not.toHaveFocus();
    });

    it("should keep the focus when blurOnSubmit is false", async () => {
      const handleSubmit = mock(() => {});
      const { getByRole, user } = setUp({ onSubmit: handleSubmit, blurOnSubmit: false });
      const input = getByRole("searchbox");

      await user.type(input, "당근{Enter}");

      expect(handleSubmit).toHaveBeenCalledWith("당근");
      expect(input).toHaveFocus();
    });

    it("should stop a surrounding form from submitting only when onSubmit is set", () => {
      const withOnSubmit = setUp({ onSubmit: () => {} });
      // `fireEvent` returns false when the default action is prevented.
      expect(fireEvent.keyDown(withOnSubmit.getByRole("searchbox"), { key: "Enter" })).toBe(false);
      withOnSubmit.unmount();

      const withoutOnSubmit = setUp();
      expect(fireEvent.keyDown(withoutOnSubmit.getByRole("searchbox"), { key: "Enter" })).toBe(
        true,
      );
    });

    it("should ignore Enter that confirms an IME composition", () => {
      const handleSubmit = mock(() => {});
      const { getByRole } = setUp({ defaultValue: "당근", onSubmit: handleSubmit });
      const input = getByRole("searchbox");

      act(() => input.focus());
      fireEvent.keyDown(input, { key: "Enter", isComposing: true });
      fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });

      expect(handleSubmit).not.toHaveBeenCalled();
      expect(input).toHaveFocus();
    });
  });

  describe("clear button", () => {
    it("should clear the value and keep the input focused", async () => {
      const handleValueChange = mock(() => {});
      const { getByRole, queryByRole, user } = setUp({ onValueChange: handleValueChange });
      const input = getByRole("searchbox");

      expect(queryByRole("button", { name: "지우기" })).toBeNull();

      await user.type(input, "당근");
      await user.click(getByRole("button", { name: "지우기" }));

      expect(input).toHaveValue("");
      expect(input).toHaveFocus();
      expect(handleValueChange).toHaveBeenLastCalledWith("");
      expect(queryByRole("button", { name: "지우기" })).toBeNull();
    });
  });
});
