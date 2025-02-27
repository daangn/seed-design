import * as React from "react";

import { Badge } from "@seed-design/react";

import { useIcon } from "./icon-context";

import * as changeCase from "change-case";
import { Tag } from "./tags";
import { getServiceName } from "./utils";

export const IconBottomInfomation = () => {
  const { selectedIcon, search, iconComponents, iconStyle } = useIcon();

  if (!selectedIcon) {
    return null;
  }

  const pascalCaseIconName = changeCase.pascalCase(selectedIcon?.name);
  const Icon = iconComponents[iconStyle][pascalCaseIconName] as React.ForwardRefExoticComponent<
    Omit<
      React.SVGProps<SVGSVGElement> & {
        size?: number | string;
      },
      "ref"
    > &
      React.RefAttributes<SVGSVGElement>
  >;

  if (!Icon) {
    return null;
  }

  const isFigmaNotPublishedIcon = selectedIcon.metadatas.includes(Tag.figmaNotPublished);
  const isFatIcon = selectedIcon.metadatas.includes(Tag.fat);
  const isServiceIcon = selectedIcon.metadatas.includes(Tag.service);
  const serviceName = getServiceName(selectedIcon.metadatas);
  const highLightedName = selectedIcon.name.replace(
    search,
    `<span class="text-seed-fg-brand">${search}</span>`,
  );

  return (
    <div className="flex justify-between fixed bottom-0 min-h-28 left-0 right-0 border-t border-gray-200 p-4 z-30 bg-gray-50">
      <div className="flex flex-col justify-center gap-2">
        <div className="flex gap-4 items-end">
          <div
            className="text-xl font-bold"
            dangerouslySetInnerHTML={{ __html: highLightedName }}
          />
          <div className="flex flex-col gap-1">
            {serviceName && (
              <div className="text-seed-fg-critical text-xs">
                <span className="font-bold">[{serviceName} 서비스 아이콘]</span>
              </div>
            )}
            {isFigmaNotPublishedIcon && (
              <div className="text-seed-fg-critical text-xs">
                <span className="font-bold">[피그마 컴포넌트로 배포되지 않은 아이콘]</span>
                <span>
                  {" "}
                  해당 아이콘은 특정 컴포넌트를 위해 특수제작된 아이콘입니다. 디자인 코어팀에
                  문의해주세요.
                </span>
              </div>
            )}
            {isFatIcon && (
              <div className="text-seed-fg-critical text-xs">
                <span className="font-bold">[Fat 아이콘]</span>
                <span>
                  {" "}
                  해당 아이콘은 특정 컴포넌트를 위해 특수제작된 아이콘입니다. 디자인 코어팀에
                  문의해주세요.
                </span>
              </div>
            )}
            {isServiceIcon && (
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
        </div>
        <div>
          {selectedIcon?.metadatas.map((metadata) => (
            <Badge
              tone={search === "" ? "neutral" : metadata.includes(search) ? "brand" : "neutral"}
              key={metadata}
              className="mr-2"
            >
              {metadata}
            </Badge>
          ))}
        </div>
      </div>
      <div className="w-[80px] h-[80px]">{<Icon size={80} />}</div>
    </div>
  );
};
