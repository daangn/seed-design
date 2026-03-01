"use client";

import * as React from "react";
import * as changeCase from "change-case";
import { CopyableName } from "./copyable-name";
import { useIcon } from "./icon-context";
import { IconDetailMetadata } from "./icon-detail-metadata";
import { Tag } from "./tags";
import { getServiceName } from "./utils";

type IconComponentType = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement> & { size?: number | string; color?: string }, "ref"> &
    React.RefAttributes<SVGSVGElement>
>;

export const IconDetailHeader = React.forwardRef<HTMLDivElement>(function IconDetailHeader(_, ref) {
  const { selectedIcon, iconComponents, iconStyle } = useIcon();

  if (!selectedIcon) return null;

  const pascalCaseIconName = changeCase.pascalCase(selectedIcon.name);
  const IconComponent = iconComponents[iconStyle][pascalCaseIconName] as IconComponentType;

  if (!IconComponent) return null;

  const serviceName = getServiceName(selectedIcon.metadatas);
  const isFigmaNotPublished = selectedIcon.metadatas.includes(Tag.figmaNotPublished);
  const isFat = selectedIcon.metadatas.includes(Tag.fat);
  const isService = selectedIcon.metadatas.includes(Tag.service);

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <CopyableName
        name={selectedIcon.name}
        label="아이콘 이름이 복사되었습니다"
        className="text-[20px] font-bold break-all"
      />

      <IconDetailMetadata />

      <div className="flex items-center justify-center py-8 bg-fd-muted rounded-lg">
        <IconComponent size={24} />
      </div>

      {(serviceName || isFigmaNotPublished || isFat || isService) && (
        <div className="flex flex-col gap-1">
          {serviceName && (
            <div className="text-seed-fg-critical text-xs">
              <span className="font-bold">[{serviceName} 서비스 아이콘]</span>
            </div>
          )}
          {isFigmaNotPublished && (
            <div className="text-seed-fg-critical text-xs">
              <span className="font-bold">[피그마 컴포넌트로 배포되지 않은 아이콘]</span>
              <span>
                {" "}
                해당 아이콘은 특정 컴포넌트를 위해 특수제작된 아이콘입니다. 디자인 코어팀에
                문의해주세요.
              </span>
            </div>
          )}
          {isFat && (
            <div className="text-seed-fg-critical text-xs">
              <span className="font-bold">[Fat 아이콘]</span>
              <span>
                {" "}
                해당 아이콘은 특정 컴포넌트를 위해 특수제작된 아이콘입니다. 디자인 코어팀에
                문의해주세요.
              </span>
            </div>
          )}
          {isService && (
            <div className="text-seed-fg-critical text-xs">
              <span className="font-bold">[서비스 아이콘]</span>
              <span>
                {" "}
                해당 아이콘은 특정 서비스를 위해 특수제작된 아이콘입니다. 특정 서비스 이외에는
                사용이 불가능합니다.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

IconDetailHeader.displayName = "IconDetailHeader";
