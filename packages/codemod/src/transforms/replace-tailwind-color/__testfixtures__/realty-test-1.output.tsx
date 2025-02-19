// @ts-nocheck
import { vars } from "@seed-design/design-token";
import { cn } from "styles/utils";

const Component1 = ({ children }: { children: React.ReactNode }) => {
  return (
    <foreignObject
      x={viewBox.x}
      y={viewBox.y}
      width={size.width}
      height={size.height}
      style={{ overflow: "visible" }}
    >
      <div ref={containerRef} className="relative w-fit">
        {children}
      </div>
    </foreignObject>
  );
};

const Component2 = ({ children }: { children: React.ReactNode }) => (
  <g className="[&>.pulse]:origin-center [&>.pulse]:scale-0 [&>.pulse]:animate-[pulse_1.5s_infinite] [&>.pulse]:[transform-box:fill-box]">
    {children}
  </g>
);

const Component3 = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "label6Bold bg-gray-300 text-gray-800 relative -left-[80%] -top-[30px] w-max rounded-[2px] p-[1px_4px] text-center",
      "after:absolute after:left-[80%] after:top-full after:-ml-[5px]",
      "after:border-t-gray-300 after:border-[5px] after:border-solid after:border-transparent",
      "after:text-gray-300 after:border-[5px] after:border-solid after:border-transparent",
      className,
    )}
  >
    {children}
  </div>
);

const Component4 = ({ children }: { children: React.ReactNode }) => (
  <BaseTooltip className="bg-carrot-600 text-gray-00 after:border-t-carrot-600">
    {children}
  </BaseTooltip>
);
