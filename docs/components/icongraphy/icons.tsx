"use client";

import * as React from "react";

import * as Index from "@daangn/react-icon";
import IconData from "@daangn/icon-data";

import { IconProvider } from "./icon-context";
import { IconGrid } from "./icon-grid";
import { IconSearch } from "./icon-search";
import { IconBottomInfomation } from "./icon-bottom-infomation";

export const Icons = () => {
  return (
    <IconProvider iconData={IconData} iconComponents={Index}>
      <IconSearch />
      <IconGrid />
      <IconBottomInfomation />
    </IconProvider>
  );
};
