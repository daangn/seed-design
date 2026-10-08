import { HStack } from "@seed-design/lynx-react";
import { defaultPreset } from "@seed-design/lynx-react/content-placeholder-presets/default";
import { buySell } from "@seed-design/lynx-react/content-placeholder-presets/buy-sell";
import { car } from "@seed-design/lynx-react/content-placeholder-presets/car";
import { commerce } from "@seed-design/lynx-react/content-placeholder-presets/commerce";
import { coupon } from "@seed-design/lynx-react/content-placeholder-presets/coupon";
import { food } from "@seed-design/lynx-react/content-placeholder-presets/food";
import { group } from "@seed-design/lynx-react/content-placeholder-presets/group";
import { image } from "@seed-design/lynx-react/content-placeholder-presets/image";
import { jobs } from "@seed-design/lynx-react/content-placeholder-presets/jobs";
import { business } from "@seed-design/lynx-react/content-placeholder-presets/business";
import { post } from "@seed-design/lynx-react/content-placeholder-presets/post";
import { realty } from "@seed-design/lynx-react/content-placeholder-presets/realty";

import { ContentPlaceholder } from "@/components/ui/content-placeholder";

const presets = {
  default: defaultPreset,
  buySell,
  car,
  commerce,
  coupon,
  food,
  group,
  image,
  jobs,
  business,
  post,
  realty,
};

export default function ContentPlaceholderTypeExample() {
  return (
    <HStack gap="x3" wrap="wrap">
      {Object.entries(presets).map(([name, preset]) => (
        <ContentPlaceholder key={name} preset={preset} width="120px" height="120px" />
      ))}
    </HStack>
  );
}
