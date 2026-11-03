import { act, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";
import type React from "react";

import {
  SegmentedTextInputRoot,
  SegmentedTextInputSegment,
  SegmentedTextInputSeparator,
  type SegmentedTextInputRootProps,
} from "./SegmentedTextInput";

function ResidentNumber(props: SegmentedTextInputRootProps) {
  return (
    <SegmentedTextInputRoot aria-label="주민등록번호" {...props}>
      <SegmentedTextInputSegment aria-label="앞 6자리" length={6} autoComplete="bday" />
      <SegmentedTextInputSeparator>-</SegmentedTextInputSeparator>
      <SegmentedTextInputSegment aria-label="뒤 첫 번째 자리" length={1} />
    </SegmentedTextInputRoot>
  );
}

function CardNumber(props: SegmentedTextInputRootProps) {
  return (
    <SegmentedTextInputRoot aria-label="카드번호" {...props}>
      <SegmentedTextInputSegment aria-label="1" length={4} />
      <SegmentedTextInputSegment aria-label="2" length={4} />
      <SegmentedTextInputSegment aria-label="3" length={4} masked />
      <SegmentedTextInputSegment aria-label="4" length={4} masked />
    </SegmentedTextInputRoot>
  );
}

function setUp(jsx: React.ReactElement) {
  return { user: userEvent.setup(), ...render(jsx) };
}

describe("SegmentedTextInput", () => {
  it("renders a group whose values follow segment order", () => {
    const { getByRole, getByLabelText } = setUp(<ResidentNumber defaultValue={["931205", "1"]} />);

    expect(getByRole("group")).toHaveAccessibleName("주민등록번호");
    expect(getByLabelText("앞 6자리")).toHaveValue("931205");
    expect(getByLabelText("뒤 첫 번째 자리")).toHaveValue("1");
  });

  it("moves to the next segment when typing fills the segment at its end", async () => {
    const onValueChange = mock();
    const { user, getByLabelText } = setUp(<ResidentNumber onValueChange={onValueChange} />);

    await user.click(getByLabelText("앞 6자리"));
    await user.keyboard("9312051");

    expect(onValueChange).toHaveBeenLastCalledWith(["931205", "1"]);
    expect(getByLabelText("뒤 첫 번째 자리")).toHaveFocus();
  });

  it("drops non-digit characters", async () => {
    const { user, getByLabelText } = setUp(<ResidentNumber />);

    await user.click(getByLabelText("앞 6자리"));
    await user.keyboard("9a3-1");

    expect(getByLabelText("앞 6자리")).toHaveValue("931");
  });

  it("rejects an insertion in the middle of a full segment", async () => {
    const { user, getByLabelText } = setUp(<ResidentNumber defaultValue={["931205", ""]} />);
    const front = getByLabelText("앞 6자리") as HTMLInputElement;

    await user.click(front);
    front.setSelectionRange(2, 2);
    await user.keyboard("0");

    expect(front).toHaveValue("931205");
    expect(front).toHaveFocus();
  });

  it("deletes the previous segment's last character on Backspace in an empty segment", async () => {
    const { user, getByLabelText } = setUp(<ResidentNumber defaultValue={["931205", ""]} />);

    await user.click(getByLabelText("뒤 첫 번째 자리"));
    await user.keyboard("{Backspace}");

    expect(getByLabelText("앞 6자리")).toHaveValue("93120");
    expect(getByLabelText("앞 6자리")).toHaveFocus();
  });

  it("stays in the segment when Backspace empties it", async () => {
    const { user, getByLabelText } = setUp(<ResidentNumber defaultValue={["931205", "1"]} />);

    await user.click(getByLabelText("뒤 첫 번째 자리"));
    await user.keyboard("{End}{Backspace}");

    expect(getByLabelText("뒤 첫 번째 자리")).toHaveValue("");
    expect(getByLabelText("뒤 첫 번째 자리")).toHaveFocus();
    expect(getByLabelText("앞 6자리")).toHaveValue("931205");
  });

  it("moves between segments with arrow keys at the edges", async () => {
    const { user, getByLabelText } = setUp(<ResidentNumber defaultValue={["931205", ""]} />);
    const front = getByLabelText("앞 6자리") as HTMLInputElement;

    await user.click(front);
    front.setSelectionRange(6, 6);
    await user.keyboard("{ArrowRight}");
    expect(getByLabelText("뒤 첫 번째 자리")).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(front).toHaveFocus();
    expect(front.selectionStart).toBe(6);
  });

  it("keeps the caret at the end of a masked segment and moves to neighbors with arrow keys", async () => {
    const { user, getByLabelText } = setUp(
      <CardNumber defaultValue={["1234", "5678", "12", ""]} />,
    );
    const third = getByLabelText("3") as HTMLInputElement;

    await user.click(third);
    third.setSelectionRange(0, 0);
    // React는 keyup 등에서 선택 변경을 확인해 onSelect를 부른다.
    fireEvent.keyUp(third);
    expect(third.selectionStart).toBe(2);

    // 전체 선택은 바꿔 쓸 수 있게 그대로 둔다.
    third.setSelectionRange(0, 2);
    fireEvent.keyUp(third);
    expect([third.selectionStart, third.selectionEnd]).toEqual([0, 2]);
    third.setSelectionRange(2, 2);

    await user.keyboard("{ArrowRight}");
    expect(getByLabelText("4")).toHaveFocus();

    await user.click(third);
    await user.keyboard("{ArrowLeft}");
    expect(getByLabelText("2")).toHaveFocus();
  });

  it("distributes a pasted resident number across segments", async () => {
    const { user, getByLabelText } = setUp(<ResidentNumber />);

    await user.click(getByLabelText("앞 6자리"));
    await user.paste("931205-1234567");

    expect(getByLabelText("앞 6자리")).toHaveValue("931205");
    expect(getByLabelText("뒤 첫 번째 자리")).toHaveValue("1");
  });

  it("stops pasting before masked segments and focuses the first masked segment", async () => {
    const { user, getByLabelText } = setUp(<CardNumber />);

    await user.click(getByLabelText("1"));
    await user.paste("1234-5678-9012-3456");

    expect(getByLabelText("1")).toHaveValue("1234");
    expect(getByLabelText("2")).toHaveValue("5678");
    expect(getByLabelText("3")).toHaveValue("");
    expect(getByLabelText("3")).toHaveFocus();
  });

  it("rejects a paste that overflows while unselected characters remain after the caret", async () => {
    const { user, getByLabelText } = setUp(<CardNumber defaultValue={["1234", "", "", ""]} />);
    const first = getByLabelText("1") as HTMLInputElement;

    await user.click(first);
    first.setSelectionRange(2, 2);
    await user.paste("99");

    expect(first).toHaveValue("1234");
    expect(getByLabelText("2")).toHaveValue("");
  });

  it("keeps a replacement inside the segment when unselected characters remain after it", () => {
    const { getByLabelText } = setUp(<CardNumber defaultValue={["1234", "5678", "", ""]} />);
    const first = getByLabelText("1") as HTMLInputElement;

    first.focus();
    first.setSelectionRange(0, 2);
    first.dispatchEvent(
      new InputEvent("beforeinput", { inputType: "insertReplacementText", data: "999" }),
    );
    fireEvent.change(first, { target: { value: "99934" } });

    expect(first).toHaveValue("1234");
    expect(getByLabelText("2")).toHaveValue("5678");
  });

  it("normalizes a birth date autofill and moves to the next segment", () => {
    const { getByLabelText } = setUp(<ResidentNumber defaultValue={["9312", "1"]} />);
    const front = getByLabelText("앞 6자리") as HTMLInputElement;

    act(() => front.focus());
    // autofill replaces the whole value without a beforeinput event
    fireEvent.change(front, { target: { value: "2000-01-01" } });

    expect(front).toHaveValue("000101");
    expect(getByLabelText("뒤 첫 번째 자리")).toHaveValue("1");
    expect(getByLabelText("뒤 첫 번째 자리")).toHaveFocus();
  });

  it("keeps focus state while moving between segments", async () => {
    const { user, getByRole, getByLabelText } = setUp(<ResidentNumber />);

    await user.click(getByLabelText("앞 6자리"));
    expect(getByRole("group")).toHaveAttribute("data-focus");

    await user.tab();
    expect(getByLabelText("뒤 첫 번째 자리")).toHaveFocus();
    expect(getByRole("group")).toHaveAttribute("data-focus");

    await user.tab();
    expect(getByRole("group")).not.toHaveAttribute("data-focus");
  });

  it("does not change readOnly segments", async () => {
    const { user, getByLabelText } = setUp(<ResidentNumber readOnly defaultValue={["9312", ""]} />);

    await user.click(getByLabelText("앞 6자리"));
    await user.keyboard("05");
    await user.paste("1234");

    expect(getByLabelText("앞 6자리")).toHaveValue("9312");
  });

  it("hides separators from assistive technologies and renders masked segments as password", () => {
    const { getByText, getByLabelText } = setUp(
      <>
        <ResidentNumber />
        <CardNumber />
      </>,
    );

    expect(getByText("-")).toHaveAttribute("aria-hidden", "true");
    expect(getByLabelText("3")).toHaveAttribute("type", "password");
    expect(getByLabelText("앞 6자리")).toHaveAttribute("inputmode", "numeric");
    expect(getByLabelText("앞 6자리")).not.toHaveAttribute("maxlength");
  });

  describe("IME composition", () => {
    // 조합 시작 → 조합 중 input → 조합 종료 순서로 브라우저 이벤트를 흉내 낸다.
    function compose(input: HTMLInputElement, selection: [number, number], text: string) {
      act(() => input.focus());
      input.setSelectionRange(...selection);
      fireEvent.compositionStart(input);
      const raw = input.value.slice(0, selection[0]) + text + input.value.slice(selection[1]);
      fireEvent.change(input, { target: { value: raw } });
      input.setSelectionRange(selection[0] + text.length, selection[0] + text.length);
      fireEvent.compositionEnd(input, { data: text });
    }

    it("rejects a composed insertion that overflows a full segment and keeps the existing value", () => {
      const { getByLabelText } = setUp(<ResidentNumber defaultValue={["931205", ""]} />);
      const front = getByLabelText("앞 6자리") as HTMLInputElement;

      compose(front, [2, 2], "0");

      expect(front).toHaveValue("931205");
      expect(front).toHaveFocus();
      expect(front.selectionStart).toBe(2);
    });

    it("stays in the segment when a composition replaces the last selected character", () => {
      const { getByLabelText } = setUp(<ResidentNumber defaultValue={["931205", ""]} />);
      const front = getByLabelText("앞 6자리") as HTMLInputElement;

      compose(front, [5, 6], "9");

      expect(front).toHaveValue("931209");
      expect(front).toHaveFocus();
    });

    it("moves to the next segment when a composition fills the segment at its end", () => {
      const { getByLabelText } = setUp(<ResidentNumber defaultValue={["93120", ""]} />);
      const front = getByLabelText("앞 6자리") as HTMLInputElement;

      compose(front, [5, 5], "5");

      expect(front).toHaveValue("931205");
      expect(getByLabelText("뒤 첫 번째 자리")).toHaveFocus();
    });
  });

  it("follows the DOM order after segments are reordered", async () => {
    const onValueChange = mock();
    function Reorderable({ order }: { order: string[] }) {
      return (
        <SegmentedTextInputRoot aria-label="reorder" onValueChange={onValueChange}>
          {order.map((key) => (
            <SegmentedTextInputSegment key={key} aria-label={key} length={2} />
          ))}
        </SegmentedTextInputRoot>
      );
    }

    const { user, getByRole, rerender } = setUp(<Reorderable order={["a", "b"]} />);
    rerender(<Reorderable order={["b", "a"]} />);

    const [first, second] = Array.from(getByRole("group").querySelectorAll("input"));
    expect(first).toHaveAccessibleName("b");

    await user.click(first as HTMLInputElement);
    await user.paste("5678");

    expect(onValueChange).toHaveBeenLastCalledWith(["56", "78"]);
    expect(first).toHaveValue("56");
    expect(second).toHaveValue("78");
  });
});
