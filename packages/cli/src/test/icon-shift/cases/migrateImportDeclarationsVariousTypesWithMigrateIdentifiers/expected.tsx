// @ts-nocheck

import { IconHeart } from "some-new-package";
import { IconStar } from "some-new-package";
import IconMoon from "some-new-package/IconMoon";
import * as IconFlame from "some-new-package/IconFlame";

export function IconDiv() {
  console.log(IconHeart);

  return (
    <div>
      <IconHeart />
      <IconStar />
      <IconMoon />
      <IconFlame />
    </div>
  );
}
