import monochromeIconData from "@karrotmarket/icon-data/monochrome.json";
import * as MonochromeIcons from "@karrotmarket/lynx-monochrome-icon";
import { vars } from "@seed-design/lynx-css/vars";

import { VirtualIconGrid } from "../components/icon-virtual-grid.jsx";
import { createIconEntries } from "../utils/icon-data";

const { $color } = vars;
const icons = createIconEntries(monochromeIconData, MonochromeIcons);

export function FoundationMonochromeIconPage() {
  return (
    <VirtualIconGrid
      title="Monochrome Icon"
      packageName="@karrotmarket/lynx-monochrome-icon"
      icons={icons}
      iconColor={$color.fg.neutral}
    />
  );
}
