import { render } from "@testing-library/react";
import { describe, expect, it, jest } from "bun:test";
import { WheelPicker } from "./wheel-picker";

describe("WheelPicker registry snippet", () => {
  it("columns 배열을 Root와 독립적인 Column으로 변환한다", () => {
    const { getAllByRole, getByRole } = render(
      <WheelPicker
        aria-label="설정 선택"
        columns={[
          {
            id: "theme",
            "aria-label": "테마",
            options: [
              { value: "light", label: "라이트" },
              { value: "dark", label: "다크" },
            ],
            defaultValue: "dark",
          },
          {
            id: "density",
            "aria-label": "밀도",
            options: [
              { value: "normal", label: "보통" },
              { value: "dense", label: "촘촘하게" },
            ],
            defaultValue: "normal",
          },
        ]}
      />,
    );

    expect(getByRole("group", { name: "설정 선택" })).toBeTruthy();
    expect(getAllByRole("spinbutton")).toHaveLength(2);
    expect(getByRole("spinbutton", { name: "테마" }).getAttribute("aria-valuetext")).toBe("다크");
  });

  it("React 요소 label의 ariaLabel을 접근성 문자열로 사용한다", () => {
    const { getByRole } = render(
      <WheelPicker
        aria-label="배지 선택"
        columns={[
          {
            id: "badge",
            "aria-label": "배지",
            options: [{ value: "popular", label: <span>◆ 인기</span>, ariaLabel: "인기" }],
          },
        ]}
      />,
    );

    expect(getByRole("spinbutton", { name: "배지" }).getAttribute("aria-valuetext")).toBe("인기");
  });

  it("React 요소 label에 ariaLabel이 없으면 개발 환경에서 경고한다", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <WheelPicker
        aria-label="배지 선택"
        columns={[
          {
            id: "badge",
            "aria-label": "배지",
            options: [{ value: "popular", label: <span>◆ 인기</span> }],
          },
        ]}
      />,
    );

    expect(warn).toHaveBeenCalledWith(
      'WheelPicker: "badge" 컬럼에서 React 요소 label을 사용하는 option에는 ariaLabel이 필요합니다.',
    );
    warn.mockRestore();
  });
});
