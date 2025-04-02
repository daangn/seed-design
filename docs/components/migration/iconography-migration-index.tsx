"use client";

import * as V3MonochromeIcons from "@karrotmarket/react-monochrome-icon";
import {
  monochromeIconMappings,
  multicolorIconMappings,
} from "@seed-design/migration-index/iconography";
import * as V2Icons from "@seed-design/react-icon";
import { vars } from "@seed-design/css/vars";

import { V2Icon, V2IconColor, V3Icon, type V2ServiceIcons } from "./icon";

interface IconographyMigrationIndexProps {
  type: "monochrome" | "multicolor";
}

export interface IconMappingItem {
  previousIconId: string;
  newIcons: {
    id: string;
  }[];
  description?: string;
}

export function IconographyMigrationIndex({ type }: IconographyMigrationIndexProps) {
  const mappings = {
    monochrome: monochromeIconMappings,
    multicolor: multicolorIconMappings,
  }[type];

  const tableItems: IconMappingItem[] = mappings.map((mapping) => ({
    previousIconId: mapping.previous,
    newIcons: mapping.next.map((newId) => {
      return {
        id: newId,
      };
    }),
    description: mapping.description,
  }));

  return (
    <table>
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th>V2</th>
          <th>V3</th>
        </tr>
      </thead>
      <tbody>
        {tableItems.map((item) => (
          <IconographyMigrationRow key={item.previousIconId} item={item} type={type} />
        ))}
      </tbody>
    </table>
  );
}

interface IconographyMigrationRowProps {
  item: IconMappingItem;
  type: "monochrome" | "multicolor";
}

function IconographyMigrationRow({ item, type }: IconographyMigrationRowProps) {
  const { previousIconId, newIcons } = item;

  return (
    <tr>
      <td>
        {previousIconId ? (
          type === "monochrome" ? (
            <V2Icon name={previousIconId as keyof typeof V2Icons} />
          ) : (
            <V2IconColor name={previousIconId as keyof typeof V2ServiceIcons} />
          )
        ) : (
          <span style={{ color: vars.$color.fg.neutral }}>none</span>
        )}
      </td>
      <td>
        {newIcons.length > 0 ? (
          newIcons.map((icon) => (
            <V3Icon key={icon.id} name={icon.id as keyof typeof V3MonochromeIcons} type={type} />
          ))
        ) : (
          <span style={{ color: vars.$color.fg.neutral }}>none</span>
        )}
      </td>
    </tr>
  );
}
