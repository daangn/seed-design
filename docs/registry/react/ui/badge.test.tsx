import { IconHeartFill } from "@karrotmarket/react-monochrome-icon";
import { render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import * as React from "react";
import { Badge, type BadgeProps } from "./badge";

describe("Badge registry snippet", () => {
  it("원시 prefix 아이콘과 렌더 래퍼를 사용하는 고정 action을 구성한다", () => {
    const ref = React.createRef<HTMLSpanElement>();
    // @ts-expect-error Badge의 prefix와 action은 함께 사용할 수 없다.
    const invalidProps: BadgeProps = {
      children: "판매 완료",
      prefix: <IconHeartFill />,
      action: { "aria-label": "도움말" },
    };
    void invalidProps;

    const { getByRole, getByTestId, queryByRole } = render(
      <div>
        <Badge ref={ref} prefix={<IconHeartFill data-testid="prefix-icon" />}>
          관심 등록
        </Badge>
        <Badge
          action={{
            "aria-label": "도움말",
            render: (trigger) => <div data-testid="action-wrapper">{trigger}</div>,
          }}
        >
          판매 완료
        </Badge>
        <Badge
          action={{
            "aria-label": "숨긴 도움말",
            render: () => null,
          }}
        >
          숨긴 액션
        </Badge>
      </div>,
    );

    const action = getByRole("button", { name: "도움말" });

    expect(ref.current?.tagName).toBe("SPAN");
    expect(getByTestId("prefix-icon")).toBeTruthy();
    expect(getByTestId("action-wrapper").contains(action)).toBe(true);
    expect(action.querySelector("svg")).toBeTruthy();
    expect(queryByRole("button", { name: "숨긴 도움말" })).toBeNull();
  });
});
