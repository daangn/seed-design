import { useState } from "@lynx-js/react";
import { usePressTap } from "@seed-design/lynx-react";
import { clsx } from "cn";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <view className="flex flex-col gap-x2">
      <text className="t5-bold text-fg-neutral">{title}</text>
      {children}
    </view>
  );
}

function PressTapDemo({
  label,
  disabled,
  withMainThread,
}: {
  label: string;
  disabled?: boolean;
  withMainThread?: boolean;
}) {
  const [tapCount, setTapCount] = useState(0);

  const pressTap = usePressTap({
    disabled,
    onTap: () => setTapCount((c) => c + 1),
    mainThreadOnTap: withMainThread
      ? () => {
          "main thread";
          console.log("main thread tap fired");
        }
      : undefined,
  });

  const { pressed, ...handlers } = pressTap;
  const hasMainThread = "main-thread:bindtap" in pressTap;

  return (
    <view
      {...handlers}
      className={clsx(
        "py-x3_5 px-x4 rounded-r2",
        disabled
          ? "bg-bg-layer-basement opacity-50"
          : pressed
            ? "bg-bg-brand-solid-pressed opacity-100"
            : "bg-bg-brand-solid opacity-100",
      )}
    >
      <text
        className={clsx(
          "t4-bold",
          disabled ? "text-fg-neutral-subtle" : "text-fg-neutral-inverted",
        )}
      >
        {label}
      </text>
      <text
        className={clsx(
          "t2-regular mt-x1",
          disabled ? "text-fg-neutral-subtle" : "text-fg-neutral-inverted",
        )}
      >
        {`pressed: ${String(pressed)} · taps: ${tapCount} · main-thread:bindtap: ${String(hasMainThread)}`}
      </text>
    </view>
  );
}

export function UsePressTapPage() {
  return (
    <scroll-view scroll-y className="flex flex-col gap-x4 flex-1 bg-bg-layer-default">
      <text className="t7-bold text-fg-neutral">usePressTap</text>

      <Section title="Basic">
        <PressTapDemo label="Press me" />
        <text className="t2-regular text-fg-neutral-subtle">
          touchstart 시 pressed=true, touchend/cancel 시 pressed=false. 탭 시 onTap 호출.
        </text>
      </Section>

      <Section title="Disabled">
        <PressTapDemo label="Disabled" disabled />
        <text className="t2-regular text-fg-neutral-subtle">
          disabled=true일 때 pressed 변화와 onTap 호출이 차단됨.
        </text>
      </Section>

      <Section title="With main-thread:bindtap">
        <PressTapDemo label="Main thread ready" withMainThread />
        <text className="t2-regular text-fg-neutral-subtle">
          mainThreadOnTap 제공 시 `main-thread:bindtap` 반환 객체에 포함. 콘솔 로그 확인.
        </text>
      </Section>
    </scroll-view>
  );
}
