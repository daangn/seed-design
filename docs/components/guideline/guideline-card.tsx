import { IconCheckmarkCircleFill, IconXmarkCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import clsx from "clsx";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import type { GuidelineItem } from "./data";

interface GuidelineCardProps {
  item: GuidelineItem;
  /** 선택 이미지 URL. MDX에서 figmaId를 remark가 src로 치환해 넘긴다. */
  src?: string;
  className?: string;
}

/**
 * do/dont 가이드라인 한 항목을 카드로 렌더한다.
 * 텍스트가 SSOT이고, 이미지(src)는 있으면 부가로 함께 보여준다.
 * id는 내부 참조용이라 화면에 노출하지 않는다.
 */
export function GuidelineCard({ item, src, className }: GuidelineCardProps) {
  const isDo = item.type === "do";

  const body = (
    <div
      className={clsx(
        "w-full flex gap-2 p-3 rounded-r2 not-prose",
        isDo ? "bg-bg-positive-weak" : "bg-bg-critical-weak",
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
        <div className="font-bold leading-5">{isDo ? "Do" : "Don’t"}</div>
        <div>{item.statement}</div>
        {item.description && <div className="opacity-80">{item.description}</div>}
      </div>
    </div>
  );

  if (!src) return <div className={clsx(className)}>{body}</div>;

  return (
    <figure className={clsx("flex flex-col gap-1.5 not-prose my-4", className)}>
      <ImageZoom
        src={src}
        alt={item.statement}
        width={773}
        height={396}
        className={clsx(
          "w-full object-cover border rounded-r2 [&_img]:my-0 bg-palette-gray-100 dark:bg-palette-gray-900",
          isDo ? "border-bg-positive-solid" : "border-bg-critical-solid",
        )}
        loading="lazy"
        draggable={false}
      />
      {body}
    </figure>
  );
}
