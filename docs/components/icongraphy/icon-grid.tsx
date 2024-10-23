import * as React from "react";
import * as changeCase from "change-case";

import { useIcon } from "./icon-context";

export const IconGrid = () => {
  const { iconComponents, iconData, search, setSelectedIcon, selectedIcon } = useIcon();

  const onSelect = (iconName: string) => {
    const isSameIcon = selectedIcon?.name === iconName;
    if (isSameIcon) {
      setSelectedIcon(undefined);
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("icon", iconName);
    const url = `${window.location.pathname}?${searchParams.toString()}`;
    setSelectedIcon(iconData[iconName]);
    window.history.pushState({}, "", url);
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-4">
      {Object.keys(iconComponents).map((iconName) => {
        const IconComponent = iconComponents[iconName] as React.ForwardRefExoticComponent<
          Omit<
            React.SVGProps<SVGSVGElement> & {
              size?: number | string;
            },
            "ref"
          > &
            React.RefAttributes<SVGSVGElement>
        >;
        const snakeCaseIconName = changeCase.snakeCase(iconName);
        const isSelected = selectedIcon?.name === snakeCaseIconName;
        const metadataString = iconData[snakeCaseIconName].metadatas.join(", ");

        if (search !== "" && !metadataString.includes(search)) {
          return null;
        }

        return (
          <div
            onClick={() => onSelect(snakeCaseIconName)}
            key={iconName}
            className={`aspect-square rounded-md flex items-center justify-center ${isSelected ? "hover:bg-seed-bg-brand-weak-pressed" : "hover:bg-seed-bg-layer-default-pressed"} cursor-pointer transition-colors ${isSelected ? "bg-seed-bg-brand-weak" : "bg-seed-bg-layer-default"}`}
            data-metadatas={metadataString}
          >
            <IconComponent className="text-seed-" />
          </div>
        );
      })}
    </div>
  );
};
