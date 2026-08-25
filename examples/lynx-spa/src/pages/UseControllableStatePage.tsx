import { useState } from "@lynx-js/react";
import { useControllableState } from "@seed-design/lynx-react";
import clsx from "clsx";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <view className="flex flex-col gap-x2">
      <text className="t5-bold text-fg-neutral">{title}</text>
      {children}
    </view>
  );
}

function UncontrollableToggle() {
  const [value, setValue] = useControllableState<boolean>({
    defaultValue: false,
    onChange: (v) => console.log("uncontrolled onChange:", v),
  });

  return (
    <view
      bindtap={() => setValue(!value)}
      className={clsx(
        "py-x3_5 px-x4 rounded-r2",
        value ? "bg-bg-brand-solid" : "bg-bg-neutral-weak",
      )}
    >
      <text className={clsx("t4-regular", value ? "text-fg-on-neutral-solid" : "text-fg-neutral")}>
        {`value: ${String(value)} (tap to toggle)`}
      </text>
    </view>
  );
}

function ControlledToggle() {
  const [external, setExternal] = useState<boolean>(false);
  const [value, setValue] = useControllableState<boolean>({
    value: external,
    defaultValue: false,
    onChange: (v) => {
      console.log("controlled onChange:", v);
      setExternal(v);
    },
  });

  return (
    <view className="flex flex-col gap-x2">
      <view
        bindtap={() => setValue(!value)}
        className={clsx(
          "py-x3_5 px-x4 rounded-r2",
          value ? "bg-bg-brand-solid" : "bg-bg-neutral-weak",
        )}
      >
        <text
          className={clsx("t4-regular", value ? "text-fg-on-neutral-solid" : "text-fg-neutral")}
        >
          {`value: ${String(value)} (tap to toggle)`}
        </text>
      </view>
      <view
        bindtap={() => setExternal(!external)}
        className="py-x2_5 px-x4 rounded-r1_5 bg-bg-layer-basement border border-stroke-neutral-muted"
      >
        <text className="t3-regular text-fg-neutral">
          {`External override: ${String(external)} (tap to flip parent state)`}
        </text>
      </view>
    </view>
  );
}

export function UseControllableStatePage() {
  return (
    <scroll-view scroll-y className="flex flex-col gap-x4 flex-1 bg-bg-layer-default">
      <text className="t7-bold text-fg-neutral">useControllableState</text>

      <Section title="Uncontrolled">
        <UncontrollableToggle />
        <text className="t2-regular text-fg-neutral-subtle">
          value가 제공되지 않아 훅 내부 state로 동작. onChange는 값이 실제 바뀔 때만 호출 (동일
          값으로 setValue 시 skip).
        </text>
      </Section>

      <Section title="Controlled">
        <ControlledToggle />
        <text className="t2-regular text-fg-neutral-subtle">
          부모의 value를 따르고 setValue는 onChange만 호출. 부모 state를 외부에서 바꿔도 반영됨.
        </text>
      </Section>
    </scroll-view>
  );
}
