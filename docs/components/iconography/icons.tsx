"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import * as MonochormeComponents from "@karrotmarket/react-monochrome-icon";
import * as MulticolorComponents from "@karrotmarket/react-multicolor-icon";

import MonochromeData from "@karrotmarket/icon-data/monochrome.json";
import MulticolorData from "@karrotmarket/icon-data/multicolor.json";

import { IconBottomInfomation } from "./icon-bottom-infomation";
import { IconProvider } from "./icon-context";
import { IconGrid } from "./icon-grid";
import { IconSearch } from "./icon-search";
import { IconSegmentedControl } from "./icon-segmented-control";
import { Suspense } from "react";

export const IconLibrary = () => {
  return (
    <NuqsAdapter>
      <Suspense>
        <IconProvider
          iconData={{ monochrome: MonochromeData, multicolor: MulticolorData }}
          iconComponents={{
            monochrome: MonochormeComponents,
            multicolor: MulticolorComponents,
          }}
        >
          <IconSegmentedControl />
          <div className="pb-10 pt-4">
            <IconSearch />
          </div>
          <IconGrid />
          <IconBottomInfomation />
        </IconProvider>
      </Suspense>
    </NuqsAdapter>
  );
};
