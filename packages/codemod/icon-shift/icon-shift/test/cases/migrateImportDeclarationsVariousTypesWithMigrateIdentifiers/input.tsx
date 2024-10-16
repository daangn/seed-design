// @ts-nocheck

import { IconLike } from "some-package";
import { IconFavorite } from "some-package";
import IconNight from "some-package/IconNight";
import * as IconHot from "some-package/IconHot";

export function IconDiv() {
  console.log(IconLike);

  return (
    <div>
      <IconLike />
      <IconFavorite />
      <IconNight />
      <IconHot />
    </div>
  );
}
