import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";
import * as React from "react";

import { usePullToRefresh, type UsePullToRefreshProps } from "./usePullToRefresh";

// ---------------------------------------------------------------------------
// Test component
// ---------------------------------------------------------------------------

function TestPullToRefresh({ threshold = 44, ...props }: UsePullToRefreshProps) {
  const api = usePullToRefresh({ threshold, ...props });
  return (
    // ref={api.refs.root}: --ptr-displacement CSS 변수 갱신을 위해 필요
    <div data-testid="ptr-root" ref={api.refs.root} {...api.rootProps}>
      <div data-testid="ptr-content" {...api.contentProps}>
        content
      </div>
    </div>
  );
}

function setUp(props?: UsePullToRefreshProps) {
  return render(<TestPullToRefresh {...props} />);
}

// ---------------------------------------------------------------------------
// Helpers
// 테스트 환경(happy-dom)에서는 ontouchstart가 없으므로 pointer 이벤트를 사용한다.
// isLeftPress()는 pointer 이벤트에서 buttons === 1 을 요구한다.
// act() 로 감싸서 setState 이후 React re-render 가 assertion 전에 반영되도록 한다.
// ---------------------------------------------------------------------------

function pointerMove(element: HTMLElement, clientY: number) {
  act(() => {
    fireEvent.pointerMove(element, { clientY, buttons: 1 });
  });
}

function pointerUp(element: HTMLElement) {
  act(() => {
    fireEvent.pointerUp(element);
  });
}

// PTR은 첫 번째 pointerMove에서 ctx.y를 초기화(idle 유지)하고,
// 두 번째 pointerMove에서 y > ctx.y 조건을 만족할 때 pulling으로 진입한다.
// enterPulling(root, baseY)은 이 두 단계를 압축한 헬퍼다.
function enterPulling(root: HTMLElement, baseY = 100) {
  pointerMove(root, baseY - 10); // ctx.y 초기화
  pointerMove(root, baseY); // pulling 진입, y0 = baseY
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("usePullToRefresh", () => {
  describe("초기 상태", () => {
    it("idle 상태로 시작한다", () => {
      const { getByTestId } = setUp();
      expect(getByTestId("ptr-root")).toHaveAttribute("data-ptr-state", "idle");
    });
  });

  describe("상태 전환 — 정상 흐름", () => {
    it("scrollTop=0에서 아래로 드래그하면 pulling 상태가 된다", () => {
      const { getByTestId } = setUp();
      const root = getByTestId("ptr-root");

      enterPulling(root);

      expect(root).toHaveAttribute("data-ptr-state", "pulling");
    });

    it("displacement가 threshold를 초과하면 ready 상태가 된다", () => {
      // threshold=44, displacementMultiplier=0.5 → y - y0 > 88 필요
      const { getByTestId } = setUp({ threshold: 44 });
      const root = getByTestId("ptr-root");

      enterPulling(root, 100); // y0 = 100
      pointerMove(root, 200); // displacement = (200 - 100) * 0.5 = 50 > 44

      expect(root).toHaveAttribute("data-ptr-state", "ready");
    });

    it("pulling 상태에서 손을 떼면 idle로 복귀한다", () => {
      const { getByTestId } = setUp();
      const root = getByTestId("ptr-root");

      enterPulling(root);
      expect(root).toHaveAttribute("data-ptr-state", "pulling");

      pointerUp(root);
      expect(root).toHaveAttribute("data-ptr-state", "idle");
    });

    it("onPtrRefresh 없이 ready 상태에서 손을 떼면 idle로 복귀한다", () => {
      const { getByTestId } = setUp({ threshold: 44 });
      const root = getByTestId("ptr-root");

      enterPulling(root, 100);
      pointerMove(root, 200);
      expect(root).toHaveAttribute("data-ptr-state", "ready");

      pointerUp(root);
      expect(root).toHaveAttribute("data-ptr-state", "idle");
    });

    it("onPtrRefresh가 있을 때 ready 상태에서 손을 떼면 loading이 된다", () => {
      const onPtrRefresh = mock(() => new Promise<void>(() => {})); // never resolves
      const { getByTestId } = setUp({ threshold: 44, onPtrRefresh });
      const root = getByTestId("ptr-root");

      enterPulling(root, 100);
      pointerMove(root, 200);

      pointerUp(root);
      expect(root).toHaveAttribute("data-ptr-state", "loading");
    });
  });

  describe("idle bail-out — 버그 수정 검증", () => {
    it("pulling 상태에서 displacement가 0 이하가 되면 idle로 복귀한다", () => {
      const { getByTestId } = setUp();
      const root = getByTestId("ptr-root");

      enterPulling(root, 110); // y0 = 110
      expect(root.getAttribute("data-ptr-state")).toBe("pulling");

      // displacement = (90 - 110) * 0.5 = -10 ≤ 0 → idle bail-out
      pointerMove(root, 90);
      expect(root.getAttribute("data-ptr-state")).toBe("idle");
    });

    it("ready 상태에서 displacement가 0 이하가 되면 idle로 복귀한다", () => {
      const { getByTestId } = setUp({ threshold: 44 });
      const root = getByTestId("ptr-root");

      enterPulling(root, 100); // y0 = 100
      pointerMove(root, 200); // displacement = 50 > 44 → ready
      expect(root.getAttribute("data-ptr-state")).toBe("ready");

      // displacement = (80 - 100) * 0.5 = -10 ≤ 0 → idle bail-out
      pointerMove(root, 80);
      expect(root.getAttribute("data-ptr-state")).toBe("idle");
    });

    it("idle로 복귀 후 content의 transform이 제거된다", () => {
      const { getByTestId } = setUp();
      const root = getByTestId("ptr-root");
      const content = getByTestId("ptr-content");

      enterPulling(root, 110);
      // pulling 중에는 content에 transform이 적용된다
      expect(content.style.transform).toBe("translateY(var(--ptr-displacement, 0))");

      // 손가락을 위로 올려 idle 복귀 → transform 제거
      pointerMove(root, 90);
      expect(content.style.transform).toBe("");
    });

    it("bail-out 이후 다시 아래로 드래그하면 pulling을 재진입할 수 있다", () => {
      const { getByTestId } = setUp();
      const root = getByTestId("ptr-root");

      // 1차 pulling → bail-out
      enterPulling(root, 110);
      pointerMove(root, 90);
      expect(root.getAttribute("data-ptr-state")).toBe("idle");

      // 2차 pulling 재진입
      enterPulling(root, 120);
      expect(root.getAttribute("data-ptr-state")).toBe("pulling");
    });
  });

  describe("displacement 클램핑", () => {
    it("--ptr-displacement CSS 변수는 음수가 되지 않는다", () => {
      const { getByTestId } = setUp();
      const root = getByTestId("ptr-root");

      enterPulling(root, 110); // y0 = 110

      // displacement 음수 → clamp → bail-out 전에도 CSS 변수는 0
      pointerMove(root, 90);

      const displacement = root.style.getPropertyValue("--ptr-displacement");
      // idle로 복귀했으므로 0px 이거나 설정되지 않음
      expect(Number.parseFloat(displacement || "0")).toBeGreaterThanOrEqual(0);
    });
  });

  describe("disabled 상태", () => {
    it("disabled=true이면 pulling이 트리거되지 않는다", () => {
      const { getByTestId } = setUp({ disabled: true });
      const root = getByTestId("ptr-root");

      enterPulling(root);

      expect(root).toHaveAttribute("data-ptr-state", "idle");
    });
  });

  describe("콜백", () => {
    it("pulling 진입 시 onPtrPullStart가 호출된다", () => {
      const onPtrPullStart = mock(() => {});
      const { getByTestId } = setUp({ onPtrPullStart });
      const root = getByTestId("ptr-root");

      pointerMove(root, 90); // ctx.y 초기화, 아직 pulling 진입 아님
      expect(onPtrPullStart).not.toHaveBeenCalled();

      pointerMove(root, 100); // pulling 진입
      expect(onPtrPullStart).toHaveBeenCalledTimes(1);
    });

    it("pulling/ready 상태에서 손을 뗄 때 onPtrPullEnd가 호출된다", () => {
      const onPtrPullEnd = mock(() => {});
      const { getByTestId } = setUp({ onPtrPullEnd });
      const root = getByTestId("ptr-root");

      enterPulling(root);
      pointerUp(root);

      expect(onPtrPullEnd).toHaveBeenCalledTimes(1);
    });

    it("displacement가 threshold 초과 시 onPtrReady가 호출된다", () => {
      const onPtrReady = mock(() => {});
      const { getByTestId } = setUp({ threshold: 44, onPtrReady });
      const root = getByTestId("ptr-root");

      enterPulling(root, 100);
      pointerMove(root, 200); // displacement = 50 > 44

      expect(onPtrReady).toHaveBeenCalledTimes(1);
    });
  });
});
