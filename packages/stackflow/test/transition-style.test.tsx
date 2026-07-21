import { describe, expect, it } from "bun:test";
import { makeActivity } from "./fixtures";
import { getPart, getScreen, renderStack, settle } from "./harness";

describe("transitionStyle 결정", () => {
  it("cupertino 테마 기본값은 horizontalSlide다", async () => {
    const { container } = renderStack({
      activities: { A: makeActivity({ testId: "a" }) },
      initialActivity: "A",
      theme: "cupertino",
    });
    await settle(container);

    const screen = getScreen(container, "a");
    expect(screen.dataset["screenTransitionStyle"]).toBe("horizontalSlide");
    expect(getPart(screen, "screen-layer")?.className).toContain("transitionStyle_horizontalSlide");
  });

  it("android 테마 기본값은 verticalSlide다", async () => {
    const { container } = renderStack({
      activities: { A: makeActivity({ testId: "a" }) },
      initialActivity: "A",
      theme: "android",
    });
    await settle(container);

    const screen = getScreen(container, "a");
    expect(screen.dataset["screenTransitionStyle"]).toBe("verticalSlide");
    expect(getPart(screen, "screen-layer")?.className).toContain("transitionStyle_verticalSlide");
  });

  it("화면 단위 prop이 테마 기본값을 override한다", async () => {
    const { container } = renderStack({
      activities: { A: makeActivity({ testId: "a", transitionStyle: "fadeIn" }) },
      initialActivity: "A",
      theme: "cupertino",
    });
    await settle(container);

    expect(getScreen(container, "a").dataset["screenTransitionStyle"]).toBe("fadeIn");
  });

  it("behind 화면 스타일은 top 화면의 transitionStyle을 따라간다", async () => {
    const { container, push, pop } = renderStack({
      activities: {
        A: makeActivity({ testId: "a" }), // horizontalSlide (cupertino 기본값)
        B: makeActivity({ testId: "b", transitionStyle: "fadeIn" }),
      },
      initialActivity: "A",
      theme: "cupertino",
    });
    await push("B");
    await settle(container);

    // A는 자기 스타일(horizontalSlide)이 아니라 top(B)의 fadeIn을 따라가야 한다
    const behind = getScreen(container, "a");
    expect(behind.dataset["screenTransitionStyle"]).toBe("fadeIn");
    expect(getPart(behind, "screen-layer")?.className).toContain("transitionStyle_fadeIn");
    expect(getPart(behind, "screen-layer")?.className).not.toContain(
      "transitionStyle_horizontalSlide",
    );

    // pop 후에는 다시 자기 스타일로 복귀한다
    await pop();
    await settle(container);
    expect(getScreen(container, "a").dataset["screenTransitionStyle"]).toBe("horizontalSlide");
  });

  it("tone/gradient variant가 NextAppBar background slot 클래스에 반영된다", async () => {
    const { container } = renderStack({
      activities: {
        Transparent: makeActivity({
          testId: "transparent",
          withAppBar: true,
          tone: "transparent",
          gradient: true,
        }),
      },
      initialActivity: "Transparent",
    });
    await settle(container);

    const background = getPart(getScreen(container, "transparent"), "app-bar-background");
    expect(background?.className).toContain(
      "seed-next-app-bar__background--tone_transparent-gradient_true",
    );

    const { container: plainContainer } = renderStack({
      activities: {
        Plain: makeActivity({
          testId: "plain",
          withAppBar: true,
          tone: "transparent",
          gradient: false,
        }),
      },
      initialActivity: "Plain",
    });
    await settle(plainContainer);
    const plainBackground = getPart(getScreen(plainContainer, "plain"), "app-bar-background");
    expect(plainBackground?.className).not.toContain("gradient_true");
  });

  it("theme variant class가 recipe에 반영된다 (cupertino 44px / android 56px 소스)", async () => {
    const { container } = renderStack({
      activities: { A: makeActivity({ testId: "a" }) },
      initialActivity: "A",
      theme: "android",
    });
    await settle(container);

    expect(getScreen(container, "a").className).toContain("theme_android");
  });
});
