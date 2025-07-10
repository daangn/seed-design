import { createPresence } from "../utils/animation";

const TransitionIOS = {
  duration: "350ms",
  timingFunction: "cubic-bezier(0.2, 0.0, 0.0, 1.0)", // approximates iOS spring animation
};

const FadeInFromBottomAndroid = {
  duration: "300ms", // actually 350ms, but currently stackflow does not allow duration per activity.
  timingFunction: "cubic-bezier(0.23, 0.1, 0.32, 1)", // approximates Easing.out(Easing.poly(5)), https://api.flutter.dev/flutter/animation/Curves/easeOutQuint-constant.html
};

const FadeOutToBottomAndroid = {
  duration: "150ms", // currently stackflow does not allow duration per activity, 150ms may cause bug
  timingFunction: "linear",
};

const ScaleFromCenterAndroid = {
  duration: "300ms", // actually 400ms, but currently stackflow does not allow duration per activity.
  timingFunction: "cubic-bezier(0.20833, 0.82, 0.25, 1)", // from https://github.com/react-navigation/react-navigation/blob/bddcc44ab0e0ad5630f7ee0feb69496412a00217/packages/stack/src/TransitionConfigs/TransitionSpecs.tsx#L68
};

const iOSPresence = createPresence(TransitionIOS, TransitionIOS);
const fadeFromBottomAndroidPresence = createPresence(
  FadeInFromBottomAndroid,
  FadeOutToBottomAndroid,
);
// TODO: implement scaleFromCenter animations
// @ts-expect-error
const scaleFromCenterAndroidPresence = createPresence(
  ScaleFromCenterAndroid,
  ScaleFromCenterAndroid,
);

export const iOSAnimations = {
  layer: iOSPresence.getAnimations({
    in: {
      translateX: "var(--swipe-back-target, var(--swipe-back-displacement, 0))",
    },
    interaction: {
      translateX: "var(--swipe-back-displacement, 0)",
    },
    out: {
      translateX: "100%",
    },
  }),
  layerBehind: iOSPresence.getAnimations({
    in: {
      translateX: "0",
    },
    interaction: {
      translateX: "calc(-30% + var(--swipe-back-displacement, 0) * 0.3)",
    },
    out: {
      translateX: "-30%",
    },
    gravity: "out",
  }),
  dim: iOSPresence.getAnimations({
    in: {
      opacity: "1",
    },
    interaction: {
      opacity: "calc(1 - var(--swipe-back-displacement-ratio, 0))",
    },
    out: {
      opacity: "0",
    },
  }),
  title: iOSPresence.getAnimations({
    in: {
      opacity: "1",
      translateX: "0",
    },
    interaction: {
      opacity: "calc(1 - var(--swipe-back-displacement-ratio, 0))",
      translateX: "calc(var(--swipe-back-displacement, 0) * 0.25)",
    },
    out: {
      opacity: "0",
      translateX: "25%",
    },
  }),
  titleBehind: iOSPresence.getAnimations({
    in: {
      opacity: "1",
      translateX: "0",
    },
    interaction: {
      opacity: "calc(1 - var(--swipe-back-displacement-ratio, 0))",
      translateX: "calc(-25% + var(--swipe-back-displacement, 0) * 0.25)",
    },
    out: {
      opacity: "0",
      translateX: "-25%",
    },
    gravity: "out",
  }),
  appBarBackground: iOSPresence.getAnimations({
    in: {
      translateX: "0",
    },
    interaction: {
      translateX: "var(--swipe-back-displacement, 0)",
    },
    out: {
      translateX: "100%",
    },
  }),
  icon: iOSPresence.getAnimations({
    in: {
      opacity: "1",
    },
    interaction: {
      opacity: "calc(1 - var(--swipe-back-displacement-ratio, 0))",
    },
    out: {
      opacity: "0",
    },
  }),
  iconBehind: iOSPresence.getAnimations({
    in: {
      opacity: "1",
    },
    interaction: {
      opacity: "calc(1 - var(--swipe-back-displacement-ratio, 0))",
    },
    out: {
      opacity: "0",
    },
    gravity: "out",
  }),
};

export const fadeFromBottomAndroidAnimations = {
  layer: fadeFromBottomAndroidPresence.getAnimations({
    in: {
      opacity: "1",
      translateY: "0",
    },
    out: {
      opacity: "0",
      translateY: "8vh",
    },
  }),
  dim: fadeFromBottomAndroidPresence.getAnimations({
    in: {
      opacity: "1",
      translateY: "-8vh",
    },
    out: {
      opacity: "0",
      translateY: "0",
    },
  }),
  appBar: fadeFromBottomAndroidPresence.getAnimations({
    in: {
      opacity: "1",
      translateY: "0",
    },
    out: {
      opacity: "0",
      translateY: "8vh",
    },
  }),
};
