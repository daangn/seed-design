import { IconCheckmarkCircleFill, IconXmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import clsx from "clsx";
import type { GuidelineItem } from "./data";

interface GuidelineCardProps {
  item: GuidelineItem;
  className?: string;
}

/**
 * do/dont 가이드라인 한 항목을 텍스트 카드로 렌더한다.
 * 이미지 없이 텍스트가 SSOT이며, DoImage/DontImage의 배지 톤을 재사용한다.
 */
export function GuidelineCard({ item, className }: GuidelineCardProps) {
  const isDo = item.type === "do";

  return (
    <div
      className={clsx(
        "w-full flex gap-2 p-3 rounded-r2 not-prose",
        isDo ? "bg-bg-positive-weak" : "bg-bg-critical-weak",
        className,
      )}
    >
      <Icon
        svg={
          isDo ? (
            <IconCheckmarkCircleFill className="shrink-0" />
          ) : (
            <IconXmarkCircleFill className="shrink-0" />
          )
        }
        size="x5"
        color={isDo ? "fg.positiveContrast" : "fg.criticalContrast"}
      />
      <div
        className={clsx(
          "text-sm flex flex-col gap-0.5 break-keep",
          isDo ? "text-fg-positive-contrast" : "text-fg-critical-contrast",
        )}
      >
        <div className="flex items-center gap-1.5 leading-5">
          <span className="font-bold">{isDo ? "Do" : "Don’t"}</span>
          <span className="text-xs opacity-60 font-mono">{item.id}</span>
        </div>
        <div>{item.statement}</div>
        {item.description && <div className="opacity-80">{item.description}</div>}
      </div>
    </div>
  );
}
