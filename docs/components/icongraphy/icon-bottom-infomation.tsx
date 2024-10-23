import * as React from "react";

import { Badge } from "seed-design/ui/badge";

import { useIcon } from "./icon-context";

import * as changeCase from "change-case";

export const IconBottomInfomation = () => {
  const { selectedIcon, search, iconComponents } = useIcon();

  if (!selectedIcon) {
    return null;
  }

  const pascalCaseIconName = changeCase.pascalCase(selectedIcon?.name);
  const Icon = iconComponents[pascalCaseIconName] as React.ForwardRefExoticComponent<
    Omit<
      React.SVGProps<SVGSVGElement> & {
        size?: number | string;
      },
      "ref"
    > &
      React.RefAttributes<SVGSVGElement>
  >;

  return (
    <div className="flex justify-between fixed bottom-0 min-h-28 left-0 right-0 bg-seed-bg-layer-default border-t border-gray-200 p-4 z-30">
      <div className="flex flex-col justify-center gap-2">
        <div className="flex gap-4 items-end">
          <div className="text-xl font-bold">{selectedIcon.name}</div>
          <div className="text-sm">{pascalCaseIconName}</div>
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
