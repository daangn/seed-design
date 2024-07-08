import type { TokenObject } from "@seed-design/vars";

type Unit = keyof TokenObject["unit"];
type Radii = keyof TokenObject["radii"];
type ColorFg = keyof TokenObject["color"]["fg"];
type ColorBg = keyof TokenObject["color"]["bg"];
type ColorStroke = keyof TokenObject["color"]["stroke"];
type ColorPalette = keyof TokenObject["color"]["palette"];

export interface BaseStyleProps {
  /** The width of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/width). */
  width?: number | string;
  /** The height of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/height). */
  height?: number | string;
  /** The minimum width of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width). */
  minWidth?: number | string;
  /** The minimum height of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/min-height). */
  minHeight?: number | string;
  /** The maximum width of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width). */
  maxWidth?: number | string;
  /** The maximum height of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/max-height). */
  maxHeight?: number | string;

  /** When used in a flex layout, specifies how the element will grow or shrink to fit the space available. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex). */
  flex?: string | number | boolean;
  /** When used in a flex layout, specifies how the element will grow to fit the space available. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow). */
  flexGrow?: number;
  /** When used in a flex layout, specifies how the element will shrink to fit the space available. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink). */
  flexShrink?: number;
  /** When used in a flex layout, specifies the initial main size of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-basis). */
  flexBasis?: number | string;
  /** Specifies how the element is justified inside a flex or grid container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-self). */
  justifySelf?:
    | "auto"
    | "normal"
    | "start"
    | "end"
    | "flex-start"
    | "flex-end"
    | "self-start"
    | "self-end"
    | "center"
    | "left"
    | "right"
    | "stretch"; // ...
  /** Overrides the `alignItems` property of a flex or grid container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self). */
  alignSelf?:
    | "auto"
    | "normal"
    | "start"
    | "end"
    | "center"
    | "flex-start"
    | "flex-end"
    | "self-start"
    | "self-end"
    | "stretch";

  /** Specifies how the element is positioned. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/position). */
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  /** The stacking order for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index). */
  zIndex?: number;
  /** The top position for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/top). */
  top?: number | string;
  /** The bottom position for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/bottom). */
  bottom?: number | string;
  /** The logical start position for the element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-start). */
  start?: number | string;
  /** The logical end position for the element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-end). */
  end?: number | string;
  /** The left position for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/left). Consider using `start` instead for RTL support. */
  left?: number | string;
  /** The right position for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/right). Consider using `start` instead for RTL support. */
  right?: number | string;
}

export interface ContainerStyleProps {
  /** The background color for the element. */
  backgroundColor?: ColorBg | ColorPalette;

  /** The width of the element's border on all four sides. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width). */
  borderWidth?: number;
  /** The width of the border on the logical start side, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start-width). */
  borderStartWidth?: number;
  /** The width of the border on the logical end side, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end-width). */
  borderEndWidth?: number;
  /** The width of the top border. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width). */
  borderTopWidth?: number;
  /** The width of the bottom border. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width). */
  borderBottomWidth?: number;
  /** The width of the left and right borders. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width). */
  borderXWidth?: number;
  /** The width of the top and bottom borders. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width). */
  borderYWidth?: number;

  /** The color of the element's border on all four sides. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color). */
  borderColor?: ColorStroke | ColorPalette | "transparent";
  /** The color of the border on the logical start side, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start-color). */
  borderStartColor?: ColorStroke | ColorPalette | "transparent";
  /** The color of the border on the logical end side, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end-color). */
  borderEndColor?: ColorStroke | ColorPalette | "transparent";
  /** The color of the top border. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-color). */
  borderTopColor?: ColorStroke | ColorPalette | "transparent";
  /** The color of the bottom border. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-color). */
  borderBottomColor?: ColorStroke | ColorPalette | "transparent";
  /** The color of the left and right borders. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-color). */
  borderXColor?: ColorStroke | ColorPalette | "transparent";
  /** The color of the top and bottom borders. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width). */
  borderYColor?: ColorStroke | ColorPalette | "transparent";

  /** The border radius on all four sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius). */
  borderRadius?: Radii;
  /** The border radius for the top start corner of the element, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-start-start-radius). */
  borderTopStartRadius?: Radii;
  /** The border radius for the top end corner of the element, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-start-end-radius). */
  borderTopEndRadius?: Radii;
  /** The border radius for the bottom start corner of the element, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-end-start-radius). */
  borderBottomStartRadius?: Radii;
  /** The border radius for the bottom end corner of the element, depending on the layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/border-end-end-radius). */
  borderBottomEndRadius?: Radii;

  /** The padding for all four sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding). */
  padding?: number | string;
  /** The padding for the left side of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left). */
  paddingLeft?: number | string;
  /** The padding for the right side of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right). */
  paddingRight?: number | string;
  /** The padding for the top side of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top). */
  paddingTop?: number | string;
  /** The padding for the bottom side of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom). */
  paddingBottom?: number | string;
  /** The padding for both the left and right sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding). */
  paddingX?: number | string;
  /** The padding for both the top and bottom sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/padding). */
  paddingY?: number | string;

  /** Species what to do when the element's content is too long to fit its size. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow). */
  overflow?: string;
}
