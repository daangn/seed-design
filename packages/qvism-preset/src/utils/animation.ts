export interface AnimationProps {
  duration: string;
  timingFunction: string;

  /**
   * @default 1
   */
  opacity?: string;

  /**
   * @default 1
   */
  scale?: string;

  /**
   * @default 0
   */
  translateX?: string;

  /**
   * @default 0
   */
  translateY?: string;
}

export function enterAnimation(props: AnimationProps) {
  return {
    animation: "seed-enter",
    animationTimingFunction: props.timingFunction,
    animationDuration: props.duration,
    "--seed-enter-translate-x": props.translateX ?? "0",
    "--seed-enter-translate-y": props.translateY ?? "0",
    "--seed-enter-opacity": props.opacity?.toString() ?? "1",
    "--seed-enter-scale": props.scale?.toString() ?? "1",
  };
}

export function exitAnimation(props: AnimationProps) {
  return {
    animation: "seed-exit",
    animationTimingFunction: props.timingFunction,
    animationDuration: props.duration,
    animationFillMode: "forwards",
    "--seed-exit-translate-x": props.translateX ?? "0",
    "--seed-exit-translate-y": props.translateY ?? "0",
    "--seed-exit-opacity": props.opacity?.toString() ?? "1",
    "--seed-exit-scale": props.scale?.toString() ?? "1",
  };
}

interface TransformProps {
  translateX?: string;
  translateY?: string;
  opacity?: string;
  scale?: string;
}

function translate3d({ translateX = "0", translateY = "0" }: TransformProps) {
  return `translate3d(${translateX}, ${translateY}, 0)`;
}

function transform({ translateX, translateY, opacity, scale }: TransformProps) {
  return {
    transform: translateX || translateY ? translate3d({ translateX, translateY }) : undefined,
    opacity,
    scale,
  };
}

export function createPresence(
  enterConfig: { duration: string; timingFunction: string },
  exitConfig: { duration: string; timingFunction: string },
) {
  function enter(from: TransformProps, to: TransformProps) {
    return {
      ...enterAnimation({ ...enterConfig, ...from }),
      ...transform(to),
    };
  }

  function exit(from: TransformProps, to: TransformProps) {
    return {
      ...transform(from),
      ...exitAnimation({ ...exitConfig, ...to }),
    };
  }

  function getAnimations(props: {
    in: TransformProps;
    interaction?: TransformProps;
    cancel?: TransformProps;
    complete?: TransformProps;
    out: TransformProps;
    gravity?: "in" | "out";
  }) {
    const gravity = props.gravity || "in";
    const animations =
      gravity === "in"
        ? {
            push: enter(props.out, props.in),
            idle: props.interaction ? enter(props.interaction, props.in) : undefined,
            pop: exit(props.interaction ?? props.in, props.out),
          }
        : {
            push: exit(props.in, props.out),
            idle: props.interaction ? exit(props.interaction, props.out) : undefined,
            pop: enter(props.interaction ?? props.in, props.in),
          };

    return {
      ...animations,
      interaction: props.interaction
        ? {
            animation: "none", // remove animation while swiping, so that animation re-run on idle or pop
            ...transform(props.interaction), // while swiping back, set swiping position
          }
        : (undefined as never),
      cancel: props.cancel
        ? {
            animation: "none !important",
            ...transform(props.cancel),

            transition: `transform ${enterConfig.duration} ${enterConfig.timingFunction}, opacity ${enterConfig.duration} ${enterConfig.timingFunction}`,
          }
        : (undefined as never),
      complete: props.complete
        ? {
            animation: "none !important",
            ...transform(props.complete),

            transition: `transform ${exitConfig.duration} ${exitConfig.timingFunction}, opacity ${exitConfig.duration} ${exitConfig.timingFunction}`,
          }
        : (undefined as never),
    };
  }

  return { getAnimations };
}
