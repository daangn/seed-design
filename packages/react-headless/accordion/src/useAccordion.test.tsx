import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";
import type { ReactElement } from "react";

import { useAccordion, type UseAccordionProps } from "./useAccordion";

function expectUseAccordionProps(_props: UseAccordionProps) {}

expectUseAccordionProps({ collapsible: false });
expectUseAccordionProps({ multiple: true });
// @ts-expect-error collapsible is only supported in single mode.
expectUseAccordionProps({ multiple: true, collapsible: false });

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function Harness(
  props: UseAccordionProps & {
    onApi?: (api: ReturnType<typeof useAccordion>) => void;
  },
) {
  const { onApi, ...hookProps } = props;
  const api = useAccordion(hookProps);
  onApi?.(api);

  return (
    <div>
      <button type="button" data-testid="toggle-1" onClick={() => api.toggle("item-1")}>
        toggle 1
      </button>
      <button type="button" data-testid="toggle-2" onClick={() => api.toggle("item-2")}>
        toggle 2
      </button>
      <button type="button" data-testid="toggle-empty" onClick={() => api.toggle("")}>
        toggle empty
      </button>
      <span data-testid="open-1">{String(api.isOpen("item-1"))}</span>
      <span data-testid="open-2">{String(api.isOpen("item-2"))}</span>
      <span data-testid="open-empty">{String(api.isOpen(""))}</span>
      <span data-testid="disabled">{String(api.disabled)}</span>
      <span data-testid="collapsible">{String(api.collapsible)}</span>
      <span data-testid="values">{JSON.stringify(api.values)}</span>
    </div>
  );
}

describe("useAccordion", () => {
  describe("single mode", () => {
    it("initializes with defaultValues and uses only the first value", () => {
      const { getByTestId } = setUp(
        <Harness defaultValues={["item-1", "item-2"]} />,
      );

      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("false");
      expect(getByTestId("values")).toHaveTextContent('["item-1"]');
    });

    it("opens one item on toggle and closes the previously open one", async () => {
      const { getByTestId, user } = setUp(<Harness />);

      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("false");

      await user.click(getByTestId("toggle-2"));
      expect(getByTestId("open-1")).toHaveTextContent("false");
      expect(getByTestId("open-2")).toHaveTextContent("true");
    });

    it("closes the open item when collapsible=true (default) and re-clicked", async () => {
      const { getByTestId, user } = setUp(<Harness defaultValues={["item-1"]} />);

      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("false");
      expect(getByTestId("values")).toHaveTextContent("[]");
    });

    it("keeps the open item when collapsible=false and re-clicked", async () => {
      const { getByTestId, user } = setUp(
        <Harness defaultValues={["item-1"]} collapsible={false} />,
      );

      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("values")).toHaveTextContent('["item-1"]');
    });

    it("is controlled when values prop is provided", async () => {
      const handleChange = mock<(values: string[]) => void>(() => {});
      const { getByTestId, user, rerender } = setUp(
        <Harness values={["item-2"]} onValuesChange={handleChange} />,
      );

      await user.click(getByTestId("toggle-1"));
      expect(handleChange).toHaveBeenCalledWith(["item-1"]);

      rerender(<Harness values={["item-1"]} onValuesChange={handleChange} />);
      expect(getByTestId("open-1")).toHaveTextContent("true");
    });

    it("uses an empty array for the controlled closed state", async () => {
      const handleChange = mock<(values: string[]) => void>(() => {});
      const { getByTestId, user, rerender } = setUp(
        <Harness values={[]} onValuesChange={handleChange} />,
      );

      expect(getByTestId("open-1")).toHaveTextContent("false");
      await user.click(getByTestId("toggle-1"));
      expect(handleChange).toHaveBeenCalledWith(["item-1"]);

      rerender(<Harness values={["item-1"]} onValuesChange={handleChange} />);
      expect(getByTestId("open-1")).toHaveTextContent("true");

      await user.click(getByTestId("toggle-1"));
      expect(handleChange).toHaveBeenLastCalledWith([]);
    });

    it("treats an empty string item value as a valid open item", async () => {
      const { getByTestId, user } = setUp(<Harness defaultValues={[""]} />);

      expect(getByTestId("open-empty")).toHaveTextContent("true");
      expect(getByTestId("open-1")).toHaveTextContent("false");

      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-empty")).toHaveTextContent("false");
      expect(getByTestId("open-1")).toHaveTextContent("true");

      await user.click(getByTestId("toggle-empty"));
      expect(getByTestId("open-empty")).toHaveTextContent("true");
      expect(getByTestId("open-1")).toHaveTextContent("false");
    });

    it("exposes collapsible=true by default", () => {
      const { getByTestId } = setUp(<Harness />);
      expect(getByTestId("collapsible")).toHaveTextContent("true");
    });
  });

  describe("multiple mode", () => {
    it("initializes with defaultValues array", () => {
      const { getByTestId } = setUp(<Harness multiple defaultValues={["item-1", "item-2"]} />);
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("true");
    });

    it("toggles items independently", async () => {
      const { getByTestId, user } = setUp(<Harness multiple />);
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("true");

      await user.click(getByTestId("toggle-2"));
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("true");
    });

    it("removes from array on re-click", async () => {
      const { getByTestId, user } = setUp(<Harness multiple defaultValues={["item-1"]} />);
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("false");
    });

    it("calls onValuesChange with the new array", async () => {
      const handleChange = mock<(values: string[]) => void>(() => {});
      const { getByTestId, user } = setUp(
        <Harness multiple values={[]} onValuesChange={handleChange} />,
      );

      await user.click(getByTestId("toggle-1"));
      expect(handleChange).toHaveBeenCalledWith(["item-1"]);
    });
  });

  describe("disabled", () => {
    it("exposes disabled=true when prop is true", () => {
      const { getByTestId } = setUp(<Harness disabled={true} />);
      expect(getByTestId("disabled")).toHaveTextContent("true");
    });

    it("defaults disabled to false", () => {
      const { getByTestId } = setUp(<Harness />);
      expect(getByTestId("disabled")).toHaveTextContent("false");
    });

    it("does not change values when toggle is called while disabled", async () => {
      const handleChange = mock<(values: string[]) => void>(() => {});
      const { getByTestId, user } = setUp(
        <Harness disabled={true} values={[]} onValuesChange={handleChange} />,
      );

      await user.click(getByTestId("toggle-1"));
      expect(handleChange).not.toHaveBeenCalled();
      expect(getByTestId("values")).toHaveTextContent("[]");
    });
  });
});
