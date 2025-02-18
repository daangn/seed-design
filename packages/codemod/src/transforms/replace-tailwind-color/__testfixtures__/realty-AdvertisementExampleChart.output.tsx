// @ts-nocheck
import { vars } from "@seed-design/design-token";
import { Fragment, PropsWithChildren, useLayoutEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelProps,
} from "recharts";
import { cn } from "styles/utils";

type StatisticsItem = { t: number; view: number; adView: number; isLast?: boolean };

const data: StatisticsItem[] = [
  { t: 0, view: 0, adView: 0 },
  { t: 1, view: 20, adView: 50 },
  { t: 2, view: 40, adView: 130 },
  { t: 3, view: 60, adView: 220 },
  { t: 4, view: 80, adView: 275 },
  { t: 5, view: 100, adView: 300, isLast: true },
];

const ticksCount = data.length;

const AdvertisementExampleChart = () => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={211}>
        <LineChart data={data} margin={{ top: 35 }}>
          <defs>
            <linearGradient
              id="carrot_gradient"
              x1="291"
              y1="-9.50001"
              x2="-8.5"
              y2="177"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF6F0F" />
              <stop offset="1" stopColor="#FF9E66" />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke={vars.$scale.color.gray100}
            horizontalValues={[-10, 100, 200, 300]}
          />
          <YAxis hide={true} padding={{ bottom: 20 }} />
          <XAxis hide={true} padding={{ left: 16, right: 40 }} />
          <Line
            type="monotone"
            dataKey="adView"
            isAnimationActive={false}
            stroke="url(#carrot_gradient)"
            strokeWidth={3}
            strokeLinecap="round"
            label={(props) => (
              <TooltipLabel {...props}>
                <AdTooltip>광고했을 때</AdTooltip>
              </TooltipLabel>
            )}
            dot={(props) => {
              if (!props.payload.isLast) return <Fragment key={props.key} />;
              const { key, ...rest } = props;

              return (
                <PulseDot key={key}>
                  <Dot
                    {...rest}
                    className="pulse"
                    r={24}
                    strokeWidth={0}
                    fill={vars.$semantic.color.primary}
                  />
                  <Dot
                    {...rest}
                    r={5}
                    stroke={vars.$semantic.color.primary}
                    strokeWidth={3}
                    fill={vars.$static.color.staticWhite}
                    fillOpacity={1}
                  />
                </PulseDot>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="view"
            isAnimationActive={false}
            stroke={vars.$scale.color.gray400}
            strokeWidth={2}
            strokeDasharray="4 4"
            strokeLinecap="round"
            dot={(props) => {
              if (!props.payload.isLast) return <Fragment key={props.key} />;
              return (
                <Dot
                  key={props.key}
                  {...props}
                  strokeDasharray="false"
                  r={5}
                  stroke={vars.$scale.color.gray400}
                  strokeWidth={3}
                  fill={vars.$static.color.staticWhite}
                  fillOpacity={1}
                />
              );
            }}
            label={(props) => (
              <TooltipLabel {...props}>
                <BaseTooltip>광고 안했을 때</BaseTooltip>
              </TooltipLabel>
            )}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdvertisementExampleChart;

const TooltipLabel = ({ viewBox, index, children }: PropsWithChildren<LabelProps>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1, height: 1 });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setSize({
      width: container.offsetWidth,
      height: container.offsetHeight,
    });
  }, []);

  if (!viewBox) return <div />;
  if (index !== ticksCount - 1) return <div />;
  if (!("x" in viewBox) || !("y" in viewBox)) return <div />;

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

const PulseDot = ({ children }: { children: React.ReactNode }) => (
  <g className="[&>.pulse]:origin-center [&>.pulse]:scale-0 [&>.pulse]:animate-[pulse_1.5s_infinite] [&>.pulse]:[transform-box:fill-box]">
    {children}
  </g>
);

const BaseTooltip = ({
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

const AdTooltip = ({ children }: { children: React.ReactNode }) => (
  <BaseTooltip className="bg-carrot-600 text-gray-00 after:border-t-carrot-600">
    {children}
  </BaseTooltip>
);
