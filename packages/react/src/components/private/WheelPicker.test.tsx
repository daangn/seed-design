import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import { InternalWheelPickerColumn, InternalWheelPickerRoot } from "./WheelPicker";

const options = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

describe("InternalWheelPicker", () => {
  it("여러 컬럼을 하나의 ScrollFog와 Selection Indicator로 조합한다", () => {
    const { container, getAllByRole, getByRole } = render(
      <InternalWheelPickerRoot
        aria-label="내부 휠 피커"
        itemSize={40}
        visibleItemCount={5}
        fogSize={32}
        className="root"
        columnsClassName="columns"
        scrollFogClassName="fog"
        selectionIndicatorClassName="indicator"
      >
        <InternalWheelPickerColumn aria-label="첫 번째" options={options} />
        <InternalWheelPickerColumn aria-label="두 번째" options={options} />
      </InternalWheelPickerRoot>,
    );

    const root = getByRole("group");
    const fogs = container.querySelectorAll("[data-wheel-picker-scroll-fog]");
    const indicator = container.querySelector("[data-wheel-picker-indicator]");
    const columns = container.querySelector("[data-wheel-picker-columns]");
    const [firstColumn] = getAllByRole("spinbutton");

    expect(root).toHaveClass("seed-wheel-picker__root", "root");
    expect(root).toHaveStyle({
      "--seed-wheel-picker-item-size": "40px",
      "--seed-wheel-picker-visible-item-count": "5",
      "--seed-wheel-picker-viewport-size": "200px",
      "--seed-wheel-picker-center-offset": "80px",
    });
    expect(fogs).toHaveLength(1);
    expect(fogs[0]).toHaveClass("seed-wheel-picker__scrollFog", "fog");
    expect(fogs[0]).toHaveStyle({
      "--scroll-fog-size-top": "32px",
      "--scroll-fog-size-bottom": "32px",
    });
    expect(indicator).toHaveClass("seed-wheel-picker__selectionIndicator", "indicator");
    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(columns).toHaveClass("seed-wheel-picker__columns", "columns");
    expect(getAllByRole("spinbutton")).toHaveLength(2);
    expect(firstColumn).toHaveClass("seed-wheel-picker__column");
    expect(firstColumn.firstElementChild).toHaveClass("seed-wheel-picker__item");
  });
});
