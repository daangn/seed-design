import * as React from "react";
import * as changeCase from "change-case";

import { useIcon } from "./icon-context";

export const IconGrid = () => {
  const { iconComponents, iconData, search, setSelectedIcon, selectedIcon } = useIcon();

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-4">
      {Object.keys(iconComponents).map((iconName) => {
        const IconComponent = iconComponents[iconName];
        const snakeCaseIconName = changeCase.snakeCase(iconName);
        const isSelected = selectedIcon?.name === snakeCaseIconName;
        const metadataString = iconData[snakeCaseIconName].metadatas.join(", ");
        const onSelect = () => {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set("icon", snakeCaseIconName);
          const url = `${window.location.pathname}?${searchParams.toString()}`;
          setSelectedIcon(iconData[snakeCaseIconName]);
          window.history.pushState({}, "", url);
        };

        if (search !== "" && !metadataString.includes(search)) {
          return null;
        }

        return (
          <div
            onClick={onSelect}
            key={iconName}
            className={`aspect-square rounded-md flex items-center justify-center ${isSelected ? "hover:bg-[#ffe8db]" : "hover:bg-gray-200"} cursor-pointer transition-colors ${isSelected ? "bg-[#fff2ec]" : "bg-gray-100"}`}
            data-metadatas={metadataString}
          >
            <IconComponent />
          </div>
        );
      })}
    </div>
  );
};
