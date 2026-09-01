import { mannerTemp, type MannerTempVariantProps } from "@seed-design/lynx-css/recipes/manner-temp";
import type { NodesRef } from "@lynx-js/types";
import clsx from "clsx";
import * as React from "@lynx-js/react";
import { isValidElement } from "@lynx-js/react";

import type { LynxStyledElementProps, LynxViewRef } from "../../types";
import { toArray } from "../../utils/children";

type MannerTempLevel = NonNullable<MannerTempVariantProps["level"]>;

const emoteSources = {
  l1: "https://assetstorage.krrt.io/1123529253537884138/b63c9b3c-410c-4cf5-ba83-d787a03c3c57/width_96_height_96.webp",
  l2: "https://assetstorage.krrt.io/1123529253537884138/8e4bc458-f6d4-41ce-bfa2-17ea34022f5b/width_96_height_96.webp",
  l3: "https://assetstorage.krrt.io/1123529253537884138/906ff501-edf6-402d-a3a4-a93ce9e04d30/width_96_height_96.webp",
  l4: "https://assetstorage.krrt.io/1123529253537884138/10753976-b25d-4e4c-84b2-dbbe196dd0d9/width_96_height_96.webp",
  l5: "https://assetstorage.krrt.io/1123529253537884138/ddfbd296-5089-408c-aa37-919f45074e5e/width_96_height_96.webp",
  l6: "https://assetstorage.krrt.io/1123529253537884138/bf8f9b4d-c72e-4bf2-a094-460d3ad1b11f/width_96_height_96.webp",
  l7: "https://assetstorage.krrt.io/1123529253537884138/9906a459-a4e3-4521-a6e5-0cc24c0aa763/width_96_height_96.webp",
  l8: "https://assetstorage.krrt.io/1123529253537884138/438edadb-d31d-4711-aebd-a72f303fdf49/width_96_height_96.webp",
  l9: "https://assetstorage.krrt.io/1123529253537884138/61f6c297-11da-4d72-ba90-20cd69c09c22/width_96_height_96.webp",
  l10: "https://assetstorage.krrt.io/1123529253537884138/6cc410ac-3a55-4542-b49f-53551db74c4d/width_96_height_96.webp",
} satisfies Record<MannerTempLevel, string>;

const MannerTempLevelContext = React.createContext<MannerTempLevel | null>(null);

export interface MannerTempEmoteProps extends LynxStyledElementProps {
  level?: MannerTempLevel;
}

export const MannerTempEmote = React.forwardRef<unknown, MannerTempEmoteProps>((props, ref) => {
  const contextLevel = React.useContext(MannerTempLevelContext);
  const { level = contextLevel ?? "l1", children: _children, className, ...nativeProps } = props;
  const classes = mannerTemp({ level });

  return (
    <image
      {...(ref ? { ref: ref as React.Ref<NodesRef> } : {})}
      {...nativeProps}
      src={emoteSources[level]}
      mode="aspectFit"
      accessibility-elements-hidden={true}
      className={clsx(classes.emote, className)}
    />
  );
});

MannerTempEmote.displayName = "MannerTempEmote";

function isMannerTempEmote(node: React.ReactNode) {
  return isValidElement(node) && node.type === MannerTempEmote;
}

/**
 * @platform Lynx
 *
 * React와 같은 `level` variant와 `MannerTempEmote` 조합을 제공합니다.
 * HTML `<span>` 대신 native `<view>` / `<text>` / `<image>`를 렌더링합니다.
 */
export interface MannerTempProps extends MannerTempVariantProps, LynxStyledElementProps {}

export const MannerTemp = React.forwardRef<unknown, MannerTempProps>((props, ref) => {
  const [variantProps, otherProps] = mannerTemp.splitVariantProps(props);
  const classes = mannerTemp(variantProps);
  const { children, className, ...nativeProps } = otherProps;
  const childArray = toArray(children);
  const emoteChildren = childArray.filter(isMannerTempEmote);
  const labelChildren = childArray.filter((child) => !isMannerTempEmote(child));
  const level = variantProps.level ?? "l1";

  return (
    <MannerTempLevelContext.Provider value={level}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(classes.root, className)}
      >
        <text className={classes.label}>{labelChildren}</text>
        {emoteChildren}
      </view>
    </MannerTempLevelContext.Provider>
  );
});

MannerTemp.displayName = "MannerTemp";
