import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "bun:test";

import { Field } from "@seed-design/react-field";
import {
  SegmentedTextInputDots,
  SegmentedTextInputRoot,
  SegmentedTextInputSegment,
  SegmentedTextInputSeparator,
} from "./SegmentedTextInput";

function ResidentNumber() {
  return (
    <SegmentedTextInputRoot>
      <SegmentedTextInputSegment aria-label="앞 6자리" length={6} sizing="fill" />
      <SegmentedTextInputSeparator> - </SegmentedTextInputSeparator>
      <SegmentedTextInputSegment
        aria-label="뒤 첫 번째 자리"
        length={1}
        sizing="fill"
        placeholder={<SegmentedTextInputDots count={1} />}
        staticSuffix={<SegmentedTextInputDots count={6} />}
      />
    </SegmentedTextInputRoot>
  );
}

describe("SegmentedTextInput", () => {
  it("connects the Field label to the group and the first segment", async () => {
    const user = userEvent.setup();
    const { getByRole, getByLabelText, getByText } = render(
      <Field.Root invalid disabled={false}>
        <Field.Label>주민등록번호</Field.Label>
        <ResidentNumber />
        <Field.ErrorMessage>다시 확인해 주세요</Field.ErrorMessage>
      </Field.Root>,
    );

    const group = getByRole("group");
    expect(group).toHaveAccessibleName("주민등록번호");
    expect(group).toHaveAttribute("data-invalid");

    const front = getByLabelText("앞 6자리");
    const back = getByLabelText("뒤 첫 번째 자리");
    expect(front).toHaveAccessibleDescription("다시 확인해 주세요");
    expect(back).toHaveAttribute("aria-invalid", "true");

    await user.click(getByText("주민등록번호"));
    expect(front).toHaveFocus();
  });

  it("applies Field disabled and readOnly to every segment", () => {
    const { getByLabelText, getByRole } = render(
      <Field.Root disabled readOnly>
        <ResidentNumber />
      </Field.Root>,
    );

    expect(getByRole("group")).toHaveAttribute("data-disabled");
    expect(getByLabelText("앞 6자리")).toBeDisabled();
    expect(getByLabelText("뒤 첫 번째 자리")).toHaveAttribute("readonly");
  });

  it("draws masked segments as dots that fill as the user types", async () => {
    const user = userEvent.setup();
    const { container, getByLabelText } = render(
      <SegmentedTextInputRoot>
        <SegmentedTextInputSegment aria-label="뒷자리" length={7} masked />
      </SegmentedTextInputRoot>,
    );

    await user.click(getByLabelText("뒷자리"));
    await user.keyboard("123");

    const dots = container.querySelector(".seed-segmented-text-input__dots[data-masked]");
    expect(dots).toHaveAttribute("aria-hidden", "true");
    expect(dots?.querySelectorAll(".seed-segmented-text-input__dot")).toHaveLength(7);
    expect(dots?.querySelectorAll("[data-filled]")).toHaveLength(3);
  });

  it("hides static text from assistive technologies and excludes static segments from the value", async () => {
    const user = userEvent.setup();
    const values: string[][] = [];
    const { container, getByLabelText } = render(
      <SegmentedTextInputRoot onValueChange={(value) => values.push(value)}>
        <SegmentedTextInputSegment aria-label="앞 6자리" length={6} />
        <SegmentedTextInputSeparator> - </SegmentedTextInputSeparator>
        <SegmentedTextInputSegment staticText={<SegmentedTextInputDots count={7} />} />
      </SegmentedTextInputRoot>,
    );

    const dots = container.querySelector(".seed-segmented-text-input__dots");
    expect(dots?.closest("[aria-hidden=true]")).not.toBeNull();
    expect(dots?.children).toHaveLength(7);

    await user.click(getByLabelText("앞 6자리"));
    await user.keyboard("9");
    expect(values.at(-1)).toEqual(["9"]);
  });
});
