import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";
import { vars as typography } from "@seed-design/lynx-css/vars/component/typography";
import type { TextStyle } from "../../utils/styled";
import { Text } from "./Text";

describe("Text typography token integration", () => {
  it.each(Object.entries(typography))("preserves %s typography", (key, value) => {
    const suffix = key.slice("textStyle".length);
    const textStyle = (suffix[0]!.toLowerCase() + suffix.slice(1)) as TextStyle;
    const { getByText } = render(<Text textStyle={textStyle}>Example</Text>);
    expect(getByText("Example")).toHaveStyle(value.enabled.root);
  });

  it("keeps the default typography and consumer overrides", () => {
    const { getByText } = render(
      <>
        <Text>Default</Text>
        <Text
          color="#123456"
          fontSize="24px"
          fontWeight="medium"
          style={{ lineHeight: "30px", fontWeight: "500" }}
        >
          Custom
        </Text>
      </>,
    );
    expect(getByText("Default")).toHaveStyle(typography.textStyleT5Regular.enabled.root);
    expect(getByText("Custom")).toHaveStyle({
      color: "#123456",
      fontSize: "24px",
      fontWeight: "500",
      lineHeight: "30px",
    });
  });
});
