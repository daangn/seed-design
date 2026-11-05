import { fireEvent, render } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, mock, spyOn } from "bun:test";
import { DrawerContent, DrawerDescription, DrawerRoot, DrawerTitle } from "./Drawer";

function mockRect(element: HTMLElement, size = 100) {
  return spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    width: size,
    height: size,
    top: 0,
    left: 0,
    right: size,
    bottom: size,
    toJSON: () => {},
  });
}

// happy-dom's fireEvent does not carry page coordinates onto the synthetic
// event, so build the native PointerEvent and pin pageX/pageY explicitly —
// the same data a real touch gesture delivers and what the swipe-threshold
// check reads.
function firePointer(type: string, element: HTMLElement, x: number, y: number) {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: "touch",
    clientX: x,
    clientY: y,
  });
  Object.defineProperty(event, "pageX", { value: x });
  Object.defineProperty(event, "pageY", { value: y });
  fireEvent(element, event);
}

function setup(onItemClick: () => void) {
  const utils = render(
    <DrawerRoot defaultOpen dismissible direction="bottom" modal={false}>
      <DrawerContent>
        <DrawerTitle>Sheet</DrawerTitle>
        <DrawerDescription>Sheet body</DrawerDescription>
        <button type="button" data-testid="item" onClick={onItemClick}>
          item
        </button>
      </DrawerContent>
    </DrawerRoot>,
  );
  const content = utils.container.ownerDocument.querySelector("[data-drawer]") as HTMLElement;

  // getTranslate() reads getComputedStyle().transform, which happy-dom leaves
  // empty; seed an identity matrix and a measurable rect so onDrag doesn't throw.
  content.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
  mockRect(content);

  return { ...utils, content, item: utils.getByTestId("item") };
}

describe("DrawerContent trailing-click suppression", () => {
  const originalSetPointerCapture = window.HTMLElement.prototype.setPointerCapture;

  beforeAll(() => {
    window.HTMLElement.prototype.setPointerCapture = mock(() => {});
  });

  afterAll(() => {
    window.HTMLElement.prototype.setPointerCapture = originalSetPointerCapture;
  });

  it("드래그가 swipe 임계값을 넘으면 뒤따르는 click을 억제한다", () => {
    const onItemClick = mock(() => {});
    const { content, item } = setup(onItemClick);

    firePointer("pointerdown", content, 50, 50);
    firePointer("pointermove", content, 50, 85); // +35px > touch 임계값 10px
    firePointer("pointerup", content, 50, 85);
    fireEvent.click(item, { clientX: 50, clientY: 85 });

    expect(onItemClick).not.toHaveBeenCalled();
  });

  it("임계값을 넘지 않은 순수 tap은 click을 통과시킨다", () => {
    const onItemClick = mock(() => {});
    const { content, item } = setup(onItemClick);

    firePointer("pointerdown", content, 50, 50);
    firePointer("pointermove", content, 52, 53); // 임계값 이내
    firePointer("pointerup", content, 52, 53);
    fireEvent.click(item, { clientX: 52, clientY: 53 });

    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it("click 없이 끝난 드래그 뒤의 깨끗한 tap은 다음 pointerdown에서 리셋되어 통과한다", () => {
    const onItemClick = mock(() => {});
    const { content, item } = setup(onItemClick);

    // 큰 드래그는 iOS가 click을 합성하지 않아 click 없이 끝난다.
    firePointer("pointerdown", content, 50, 50);
    firePointer("pointermove", content, 50, 85);
    firePointer("pointerup", content, 50, 85);

    // 다음 제스처의 pointerdown이 드래그 상태를 리셋하므로 tap은 정상 동작해야 한다.
    firePointer("pointerdown", content, 50, 50);
    firePointer("pointermove", content, 51, 51);
    firePointer("pointerup", content, 51, 51);
    fireEvent.click(item, { clientX: 51, clientY: 51 });

    expect(onItemClick).toHaveBeenCalledTimes(1);
  });
});
