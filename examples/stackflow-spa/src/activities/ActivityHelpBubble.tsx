import "@seed-design/stylesheet/helpBubble.css";

import type { ActivityComponentType } from "@stackflow/react";

import { usePopover } from "@seed-design/react-popover";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActionButton } from "../design-system/components";
import { helpBubble } from "@seed-design/recipe/helpBubble";
import { forwardRef } from "react";

export interface HelpBubbleArrowProps extends React.ComponentPropsWithRef<"svg"> {
  width: number;

  height: number;

  tipRadius: number;
}

const HelpBubbleArrow = forwardRef<SVGSVGElement, HelpBubbleArrowProps>((props, ref) => {
  const { width, height, tipRadius, ...otherProps } = props;
  const pathData = `M0,0
    H${width}
    L${width / 2 + tipRadius},${height - tipRadius}
    Q${width / 2},${height} ${width / 2 - tipRadius},${height - tipRadius}
    Z`;

  return (
    <svg
      aria-hidden="true"
      width={width}
      height={width}
      viewBox={`0 0 ${width} ${height > width ? height : width}`}
      ref={ref}
      {...otherProps}
    >
      <path stroke="none" d={pathData} />
    </svg>
  );
});

const ActivityHelpBubble: ActivityComponentType = () => {
  const api = usePopover({
    defaultOpen: true,
    placement: "top",
    gutter: 4,
    overflowPadding: 16,
    arrowPadding: 14,
  });
  const classNames = helpBubble();

  const arrowRect = api.rects.arrow;

  return (
    <AppScreen appBar={{ title: "HelpBubble" }}>
      <div style={{ overflowY: "auto", height: "200vh" }}>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <ActionButton ref={api.refs.trigger} {...api.triggerProps}>
            Wow
          </ActionButton>
        </div>
        {api.open && (
          <div ref={api.refs.positioner} {...api.positionerProps} className={classNames.positioner}>
            <div className={classNames.content}>
              <div ref={api.refs.arrow} {...api.arrowProps} className={classNames.arrow}>
                <HelpBubbleArrow
                  width={arrowRect?.width ?? 0}
                  height={arrowRect?.height ?? 0}
                  tipRadius={1}
                />
              </div>
              <span className={classNames.title}>Title</span>
              <span className={classNames.description}>Description</span>
            </div>
          </div>
        )}
      </div>
    </AppScreen>
  );
};

export default ActivityHelpBubble;
