import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { dataAttr, elementProps } from "@seed-design/dom-utils";
import AutoHeight from "embla-carousel-auto-height";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import { isDragPrevented } from "./dom";
import { useTabsContext } from "./useTabsContext";

export interface UseTabsCarouselStateProps {
  swipeable?: boolean;

  autoHeight?: boolean;

  loop?: boolean;

  dragThreshold?: number;

  onSettle?: () => void;
}

const autoHeight = AutoHeight();
const plugins = [autoHeight];

const useTabsCarouselState = (props: UseTabsCarouselStateProps) => {
  const api = useTabsContext();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: props.loop,
      dragThreshold: props.dragThreshold,
      duration: 20,
      watchDrag: (_, event: MouseEvent | TouchEvent) => {
        if (event.target instanceof HTMLElement) {
          if (isDragPrevented(event.target)) {
            return false;
          }
        }
        return true;
      },
    },
    plugins,
  );

  const onSettle = useCallbackRef(props.onSettle);

  useEffect(() => {
    const select = emblaApi?.on("select", () => {
      const contentIndex = emblaApi.selectedScrollSnap();
      api.setContentIndex(contentIndex);
    });

    const settle = emblaApi?.on("settle", () => {
      onSettle?.();
    });

    return () => {
      select?.clear();
      settle?.clear();
    };
  }, [emblaApi, api.setContentIndex, onSettle]);

  useEffect(() => {
    if (!emblaApi) return;

    const { dragHandler } = emblaApi.internalEngine();

    if (props.swipeable) {
      dragHandler.init(emblaApi);
    } else {
      dragHandler.destroy();
    }
  }, [emblaApi, props.swipeable]);

  useEffect(() => {
    if (emblaApi && api.contentIndex !== emblaApi.selectedScrollSnap()) {
      const engine = emblaApi.internalEngine();

      /**
       * We want the content to quickly snap into place when a tab changes.
       * However, using a very small duration can result in an underdamped spring, which produces a rubber-band (oscillatory) effect.
       *
       * To avoid that, we intentionally use a low duration and friction so that the motion feels fast (snappy)
       * without overshooting. The underlying idea is to map our parameters to a physical spring model—a damped harmonic oscillator—
       * so we can control the dynamics in a physically intuitive way.
       *
       * In embla, the acceleration is modeled as:
       *   a = (displacement * friction) / duration - velocity * (1 - friction)
       *
       * In a classical damped harmonic oscillator (assuming unit mass, m = 1), the acceleration is:
       *   a = (stiffness * displacement - damping * velocity)
       *
       * By comparing the two equations, we can equate the coefficients for displacement and velocity:
       *
       *   For the displacement term:
       *     stiffness = friction / duration
       *
       *   For the velocity term:
       *     damping = 1 - friction
       *
       * Additionally, the damping ratio (zeta) for a damped oscillator is defined as:
       *   zeta = damping / (2 * sqrt(stiffness))
       *
       * Substituting the derived expressions for stiffness and damping gives:
       *   zeta = (1 - friction) / (2 * sqrt(friction / duration))
       *
       * This damping ratio (zeta) tells us the nature of the response:
       *   - zeta < 1: Underdamped (oscillatory, rubber-band effect)
       *   - zeta = 1: Critically damped (fast snap without overshoot)
       *   - zeta > 1: Overdamped (slow response)
       *
       * For our current configuration, we use:
       *
       *     duration = 4
       *     friction = 0.4
       *
       * Which gives:
       *
       *     stiffness = 0.4 / 4 = 0.1
       *     damping   = 1 - 0.4 = 0.6
       *
       * And the damping ratio becomes:
       *
       *     zeta = 0.6 / (2 * sqrt(0.1))
       *       = 0.6 / (2 * 0.31623...)
       *       = 0.6 / 0.63246...
       *       = 0.94868...
       *
       * Since zeta is close to 1, this spring is nearly critically damped. This is enough for our usage,
       * ensuring that the animation snaps quickly without overshooting (avoiding the rubber-band effect)
       * when switching tabs.
       */
      engine.scrollBody.useDuration(4).useFriction(0.4);
      engine.scrollTo.index(api.contentIndex, 0);
    }
  }, [emblaApi, api.contentIndex]);

  return {
    refs: {
      root: emblaRef,
    },
    autoHeight: props.autoHeight,
  };
};

export interface UseTabsCarouselProps extends UseTabsCarouselStateProps {}

export type UseTabsCarouselReturn = ReturnType<typeof useTabsCarousel>;

export const useTabsCarousel = (props: UseTabsCarouselProps) => {
  const { refs, autoHeight } = useTabsCarouselState(props);

  const stateProps = elementProps({
    "data-carousel": "",
    "data-auto-height": dataAttr(autoHeight),
  });

  return {
    refs,
    stateProps,
    rootProps: elementProps({
      ...stateProps,
    }),
    cameraProps: elementProps({
      ...stateProps,
    }),
  };
};
