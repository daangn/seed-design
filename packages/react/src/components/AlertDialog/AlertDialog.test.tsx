import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";
import {
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogPositioner,
  AlertDialogRoot,
  type AlertDialogRootProps,
  AlertDialogTitle,
} from "./AlertDialog";

function renderAlertDialog(props: Omit<AlertDialogRootProps, "children">) {
  return render(
    <AlertDialogRoot defaultOpen {...props}>
      <AlertDialogPositioner>
        <AlertDialogBackdrop data-testid="backdrop" />
        <AlertDialogContent>
          <AlertDialogTitle>제목</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialogPositioner>
    </AlertDialogRoot>,
  );
}

describe("AlertDialog", () => {
  it("기본 role로 alertdialog를 사용한다", () => {
    renderAlertDialog({});

    expect(document.querySelector('[role="alertdialog"]')).not.toBeNull();
  });

  it("role을 명시하면 기본값 대신 사용한다", () => {
    renderAlertDialog({ role: "dialog" });

    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(document.querySelector('[role="alertdialog"]')).toBeNull();
  });

  it("기본적으로 바깥을 눌러도 닫히지 않는다", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onOpenChange = mock(() => {});
    const { getByTestId } = renderAlertDialog({ onOpenChange });

    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));
    await user.click(getByTestId("backdrop"));

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closeOnInteractOutside를 켜면 바깥을 눌렀을 때 닫힌다", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onOpenChange = mock(() => {});
    const { getByTestId } = renderAlertDialog({ onOpenChange, closeOnInteractOutside: true });

    await act(() => new Promise((resolve) => setTimeout(resolve, 10)));
    await user.click(getByTestId("backdrop"));

    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });
});
