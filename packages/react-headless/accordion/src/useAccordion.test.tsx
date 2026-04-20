import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";
import type { ReactElement } from "react";

import {
  useAccordion,
  type UseAccordionMultipleProps,
  type UseAccordionSingleProps,
} from "./useAccordion";

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function SingleHarness(
  props: UseAccordionSingleProps & {
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
      <span data-testid="open-1">{String(api.isOpen("item-1"))}</span>
      <span data-testid="open-2">{String(api.isOpen("item-2"))}</span>
      <span data-testid="disabled">{String(api.disabled)}</span>
      <span data-testid="collapsible">{String(api.collapsible)}</span>
    </div>
  );
}

function MultipleHarness(
  props: UseAccordionMultipleProps & {
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
      <span data-testid="open-1">{String(api.isOpen("item-1"))}</span>
      <span data-testid="open-2">{String(api.isOpen("item-2"))}</span>
    </div>
  );
}

describe("useAccordion", () => {
  describe("single mode", () => {
    it("initializes with defaultValue", () => {
      const { getByTestId } = setUp(<SingleHarness type="single" defaultValue="item-1" />);
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("false");
    });

    it("opens one item on toggle and closes the previously open one", async () => {
      const { getByTestId, user } = setUp(<SingleHarness type="single" />);
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("false");

      await user.click(getByTestId("toggle-2"));
      expect(getByTestId("open-1")).toHaveTextContent("false");
      expect(getByTestId("open-2")).toHaveTextContent("true");
    });

    it("closes the open item when collapsible=true (default) and re-clicked", async () => {
      const { getByTestId, user } = setUp(<SingleHarness type="single" defaultValue="item-1" />);
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("false");
    });

    it("keeps the open item when collapsible=false and re-clicked", async () => {
      const { getByTestId, user } = setUp(
        <SingleHarness type="single" defaultValue="item-1" collapsible={false} />,
      );
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("true");
    });

    it("is controlled when value prop is provided", async () => {
      const handleChange = mock<(value: string) => void>(() => {});
      const { getByTestId, user, rerender } = setUp(
        <SingleHarness type="single" value="" onValueChange={handleChange} />,
      );
      await user.click(getByTestId("toggle-1"));
      expect(handleChange).toHaveBeenCalledWith("item-1");

      rerender(<SingleHarness type="single" value="item-1" onValueChange={handleChange} />);
      expect(getByTestId("open-1")).toHaveTextContent("true");
    });

    it("exposes collapsible=true by default", () => {
      const { getByTestId } = setUp(<SingleHarness type="single" />);
      expect(getByTestId("collapsible")).toHaveTextContent("true");
    });
  });

  describe("multiple mode", () => {
    it("initializes with defaultValue array", () => {
      const { getByTestId } = setUp(<MultipleHarness defaultValue={["item-1", "item-2"]} />);
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("true");
    });

    it("toggles items independently", async () => {
      const { getByTestId, user } = setUp(<MultipleHarness />);
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("true");

      await user.click(getByTestId("toggle-2"));
      expect(getByTestId("open-1")).toHaveTextContent("true");
      expect(getByTestId("open-2")).toHaveTextContent("true");
    });

    it("removes from array on re-click", async () => {
      const { getByTestId, user } = setUp(<MultipleHarness defaultValue={["item-1"]} />);
      await user.click(getByTestId("toggle-1"));
      expect(getByTestId("open-1")).toHaveTextContent("false");
    });

    it("calls onValueChange with new array", async () => {
      const handleChange = mock<(value: string[]) => void>(() => {});
      const { getByTestId, user } = setUp(
        <MultipleHarness value={[]} onValueChange={handleChange} />,
      );
      await user.click(getByTestId("toggle-1"));
      expect(handleChange).toHaveBeenCalledWith(["item-1"]);
    });
  });

  describe("disabled", () => {
    it("exposes disabled=true when prop is true", () => {
      const { getByTestId } = setUp(<SingleHarness type="single" disabled={true} />);
      expect(getByTestId("disabled")).toHaveTextContent("true");
    });

    it("defaults disabled to false", () => {
      const { getByTestId } = setUp(<SingleHarness type="single" />);
      expect(getByTestId("disabled")).toHaveTextContent("false");
    });
  });
});
