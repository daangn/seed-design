/**
 * Builds the SVG path for a HelpBubble arrow tip given its measured size.
 * Shared by HelpBubble (dialog) and HelpBubbleTooltip (tooltip) so the arrow
 * geometry stays in a single place.
 */
export const getHelpBubbleArrowTipPath = (width: number, height: number, tipRadius: number) =>
  `M0,0
      H${width}
      L${width / 2 + tipRadius},${height - tipRadius}
      Q${width / 2},${height} ${width / 2 - tipRadius},${height - tipRadius}
      Z`;
