import { camelCase } from "change-case";
import { match } from "ts-pattern";
import * as metadata from "../data/__generated__/component-sets";
import { createIconTagNameFromKey } from "../icon";
import { type ElementNode, createElement } from "../jsx";
import { findAll, findAllInstances, findOne } from "../node-util";
import type { NormalizedInstanceNode, NormalizedTextNode } from "../normalizer/types";
import { getLayoutVariableName } from "../variable";
import { handleSize } from "./properties";
import type {
  ActionButtonProperties,
  ActionChipProperties,
  ActionSheetItemProperties,
  ActionSheetProperties,
  AppBarLeftProperties,
  AppBarMainProperties,
  AppBarProperties,
  AppBarRightProperties,
  AvatarProperties,
  AvatarStackProperties,
  BadgeProperties,
  CalloutProperties,
  CheckboxProperties,
  ChipTabsItemProperties,
  ChipTabsProperties,
  ControlChipProperties,
  ErrorStateProperties,
  ExtendedActionSheetGroupProperties,
  ExtendedActionSheetItemProperties,
  ExtendedActionSheetProperties,
  ExtendedFabProperties,
  FabProperties,
  HelpBubbleProperties,
  IdentityPlaceholderProperties,
  InlineBannerProperties,
  MannerTempBadgeProperties,
  MultilineTextFieldProperties,
  ProgressCircleProperties,
  ReactionButtonProperties,
  SegmentedControlItemProperties,
  SegmentedControlProperties,
  SelectBoxGroupProperties,
  SelectBoxProperties,
  SkeletonProperties,
  SnackbarProperties,
  SwitchProperties,
  TabsFillItemProperties,
  TabsHugItemProperties,
  TabsProperties,
  TextButtonProperties,
  TextFieldProperties,
  ToggleButtonProperties,
} from "./type";

export interface ComponentHandler<
  T extends
    NormalizedInstanceNode["componentProperties"] = NormalizedInstanceNode["componentProperties"],
> {
  key: string;
  codegen: (node: NormalizedInstanceNode & { componentProperties: T }) => Promise<ElementNode>;
}

const actionButtonHandler: ComponentHandler<ActionButtonProperties> = {
  key: metadata.actionButton.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const { layout, children } = await match(props.Layout.value)
      .with("Icon Only", async () => ({
        layout: "iconOnly",
        children: [
          createElement("Icon", {
            svg: createElement(createIconTagNameFromKey(props["Icon#7574:0"].componentKey)),
          }),
        ],
      }))
      .with("Icon First", async () => ({
        layout: "withText",
        children: [
          createElement("PrefixIcon", {
            svg: createElement(
              createIconTagNameFromKey(props["Prefix Icon#5987:305"].componentKey),
            ),
          }),
          props["Label#5987:61"].value,
        ],
      }))
      .with("Icon Last", async () => ({
        layout: "withText",
        children: [
          props["Label#5987:61"].value,
          createElement("SuffixIcon", {
            svg: createElement(
              createIconTagNameFromKey(props["Suffix Icon#5987:244"].componentKey),
            ),
          }),
        ],
      }))
      .with("Text Only", () => ({
        layout: "withText",
        children: props["Label#5987:61"].value,
      }))
      .exhaustive();

    const commonProps = {
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
      ...(states.includes("Loading") && {
        loading: true,
      }),
      size: handleSize(props.Size.value),
      variant: camelCase(props.Variant.value),
      layout,
    };

    return createElement("ActionButton", commonProps, children);
  },
};

const actionChipHandler: ComponentHandler<ActionChipProperties> = {
  key: metadata.actionChip.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const { layout, children } = await match(props.Layout.value)
      .with("Icon Only", async () => ({
        layout: "iconOnly",
        children: [
          createElement("Icon", {
            svg: createElement(createIconTagNameFromKey(props["Icon#8714:0"].componentKey)),
          }),
        ],
      }))
      .with("Icon First", async () => ({
        layout: "withText",
        children: [
          createElement("PrefixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Prefix Icon#8711:0"].componentKey)),
          }),
          props["Label#7185:0"].value,
        ],
      }))
      .with("Icon Last", async () => ({
        layout: "withText",
        children: [
          props["Label#7185:0"].value,
          createElement("SuffixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Suffix Icon#8711:3"].componentKey)),
          }),
        ],
      }))
      .with("Icon Both", async () => ({
        layout: "withText",
        children: [
          createElement("PrefixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Prefix Icon#8711:0"].componentKey)),
          }),
          props["Label#7185:0"].value,
          createElement("SuffixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Suffix Icon#8711:3"].componentKey)),
          }),
        ],
      }))
      .with("Text Only", () => ({
        layout: "withText",
        children: props["Label#7185:0"].value,
      }))
      .exhaustive();

    const commonProps = {
      size: handleSize(props.Size.value),
      layout,
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
      ...(props["Show Count#7185:42"].value && {
        count: Number(props["Count#7185:21"].value),
      }),
    };
    return createElement("ActionChip", commonProps, children);
  },
};

const actionSheetHandler: ComponentHandler<ActionSheetProperties> = {
  key: metadata.actionSheet.key,
  codegen: async (node) => {
    const { componentProperties: props } = node;

    const contentProps = match(props.Header.value)
      .with("None", () => ({
        title: undefined,
        description: undefined,
      }))
      .with("Title Only", () => ({
        title: props["Title#15641:37"].value,
        description: undefined,
      }))
      .with("Description Only", () => ({
        title: undefined,
        description: props["Description#15641:70"].value,
      }))
      .with("Title With Description", () => ({
        title: props["Title#15641:37"].value,
        description: props["Description#15641:70"].value,
      }))
      .exhaustive();

    const items = await findAllInstances<ActionSheetItemProperties>({
      node,
      key: actionSheetItemHandler.key,
    });

    const contentChildren = await Promise.all(items.map(actionSheetItemHandler.codegen));

    const content = createElement(
      "ActionSheetContent",
      contentProps,
      contentChildren,
      contentProps.title
        ? ""
        : "title을 제공하지 않는 경우 aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
    );

    const trigger = createElement(
      "ActionSheetTrigger",
      { asChild: true },
      createElement("ActionButton", undefined, "열기", "ActionSheet을 여는 요소를 제공해주세요."),
    );

    return createElement("ActionSheet", undefined, [trigger, content]);
  },
};

const actionSheetItemHandler: ComponentHandler<ActionSheetItemProperties> = {
  key: "c3cafd3a3fdcd45fecb6971019d88eaf39a2e381",
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      label: props["Label#15420:4"].value,
      tone: camelCase(props.Tone.value),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("ActionSheetItem", commonProps);
  },
};

const appBarHandler: ComponentHandler<AppBarProperties> = {
  key: metadata.standardNavigation.key,
  codegen: async (node) => {
    const props = node.componentProperties;

    const theme = (() => {
      switch (props.OS.value) {
        case "Android":
          return "android";
        case "iOS":
          return "cupertino";
      }
    })();

    const tone = (() => {
      switch (props.Variant.value) {
        case "Layer Default":
          return "layer";
        case "Transparent":
          return "transparent";
      }
    })();

    const mainNode = await findAllInstances<AppBarMainProperties>({
      key: appBarMainHandler.key,
      node,
    });
    const onlyMainNode = mainNode.length === 1 ? mainNode[0] : undefined;
    const main = onlyMainNode ? await appBarMainHandler.codegen(onlyMainNode) : undefined;

    const leftNode = await findAllInstances<AppBarLeftProperties>({
      key: appBarLeftHandler.key,
      node,
    });
    const onlyLeftNode = leftNode.length === 1 ? leftNode[0] : undefined;
    const left = onlyLeftNode ? await appBarLeftHandler.codegen(onlyLeftNode) : undefined;

    const rightNode = await findAllInstances<AppBarRightProperties>({
      key: appBarRightHandler.key,
      node,
    });
    const onlyRightNode = rightNode.length === 1 ? rightNode[0] : undefined;
    const right = onlyRightNode ? await appBarRightHandler.codegen(onlyRightNode) : undefined;

    return createElement(
      "AppBar",
      { theme, tone },
      [left, main, right].filter(Boolean),
      tone === "transparent"
        ? `<AppScreen layerOffsetTop="none">으로 상단 패딩을 제거할 수 있습니다.`
        : undefined,
    );
  },
};

const appBarMainHandler: ComponentHandler<AppBarMainProperties> = {
  key: "336b49b26c3933485d87cc460b06c390976ea58e",
  codegen: async ({ componentProperties: props }) => {
    const { title, subtitle, layout } = match(props.Type.value)
      .with("Title", () => ({
        title: props["Title#16944:0"].value,
        subtitle: undefined,
        layout: undefined,
      }))
      .with("Title-Subtitle", () => ({
        title: props["Title#16944:0"].value,
        subtitle: props["Subtitle#16958:9"].value,
        layout: "withSubtitle",
      }))
      .otherwise(() => ({
        title: undefined,
        subtitle: undefined,
        layout: undefined,
      }));

    const commonProps = {
      title,
      subtitle,
      layout,
    };

    return createElement(
      "AppBarMain",
      commonProps,
      undefined,
      title === undefined ? "Title을 제공해주세요." : undefined,
    );
  },
};

const appBarLeftHandler: ComponentHandler<AppBarLeftProperties> = {
  key: "e5d2e47052a22395db79f195a0991a570dc1b6c9",
  codegen: async (node) => {
    const props = node.componentProperties;

    const children = await (async () => {
      switch (props.Action.value) {
        case "Back":
          return createElement("AppBarBackButton", undefined);
        case "Close":
          return createElement("AppBarCloseButton", undefined);
        case "Other": {
          const iconNode = findOne(
            node,
            (child) => child.type === "INSTANCE" && child.name === "Icon",
          ) as NormalizedInstanceNode | null;

          const iconComponentKey = iconNode?.componentKey ?? undefined;

          return createElement(
            "AppBarIconButton",
            undefined,
            iconComponentKey
              ? createElement(createIconTagNameFromKey(iconComponentKey))
              : undefined,
            iconComponentKey === undefined
              ? "아이콘과, aria-label 또는 aria-labelledby를 제공해주세요."
              : "aria-label 또는 aria-labelledby를 제공해주세요.",
          );
        }
      }
    })();

    return createElement("AppBarLeft", undefined, children);
  },
};

const appBarRightHandler: ComponentHandler<AppBarRightProperties> = {
  key: "9e157fc2d1f89ffee938a5bc62f4a58064fec44e",
  codegen: async (node) => {
    const props = node.componentProperties;

    const children = await (async () => {
      switch (props.Type.value) {
        case "1 Text": {
          const textNode = findOne(
            node,
            (child) => child.type === "TEXT",
          ) as NormalizedTextNode | null;

          return textNode?.characters;
        }
        default: {
          const iconNodes = findAll(
            node,
            (child) => child.type === "INSTANCE" && child.name === "Icon",
          ) as NormalizedInstanceNode[];

          const iconComponentKeys = iconNodes.map((iconNode) => iconNode.componentKey);

          return iconComponentKeys.map((iconComponentKey) =>
            createElement(
              "AppBarIconButton",
              undefined,
              iconComponentKey
                ? createElement(createIconTagNameFromKey(iconComponentKey))
                : undefined,
              iconComponentKey === undefined
                ? "아이콘과, aria-label 또는 aria-labelledby를 제공해주세요."
                : "aria-label 또는 aria-labelledby를 제공해주세요.",
            ),
          );
        }
      }
    })();

    return createElement("AppBarRight", undefined, children);
  },
};

const avatarHandler: ComponentHandler<AvatarProperties> = {
  key: metadata.avatar.key,
  codegen: async (node) => {
    const [placeholder] = await findAllInstances<IdentityPlaceholderProperties>({
      node,
      key: identityPlaceholderHandler.key,
    });
    const { componentProperties: props } = node;

    const avatarHasSrc = props["Show Image#71850:57"].value;

    const commonProps = {
      ...(avatarHasSrc && {
        // Placeholder
        src: `https://placehold.co/${props.Size.value}x${props.Size.value}`,
      }),
      ...(placeholder && {
        fallback: await identityPlaceholderHandler.codegen(placeholder),
      }),
      size: props.Size.value,
    };

    return createElement(
      "Avatar",
      commonProps,
      props["Show Badge#1398:26"].value ? createElement("AvatarBadge", {}) : undefined,
      avatarHasSrc ? "alt 텍스트를 제공해야 합니다." : undefined,
    );
  },
};

const avatarStackHandler: ComponentHandler<AvatarStackProperties> = {
  key: metadata.avatarStack.key,
  codegen: async (node) => {
    const avatarNodes = await findAllInstances<AvatarProperties>({
      node,
      key: avatarHandler.key,
    });

    const { componentProperties: props } = node;

    const commonProps = {
      size: props.Size.value,
      // TODO: 구현될 예정
      // topItem: camelCase(props["Top Item"].value),
    };

    const avatarStackChildren = (await Promise.all(avatarNodes.map(avatarHandler.codegen))).map(
      (avatar) => {
        return {
          ...avatar,
          props: { ...avatar.props, size: undefined },
        };
      },
    );

    return createElement("AvatarStack", commonProps, avatarStackChildren);
  },
};

const badgeHandler: ComponentHandler<BadgeProperties> = {
  key: metadata.badge.key,
  codegen: async ({ componentProperties: props }) => {
    const commonProps = {
      size: handleSize(props.Size.value),
      tone: camelCase(props.Tone.value),
      variant: camelCase(props.Variant.value),
      shape: camelCase(props.Shape.value),
    };

    return createElement("Badge", commonProps, props["Label#1584:0"].value);
  },
};

const calloutHandler: ComponentHandler<CalloutProperties> = {
  key: metadata.callout.key,
  codegen: async ({ componentProperties: props, children }) => {
    const tag = (() => {
      switch (props.Interaction.value) {
        case "Default":
          return "Callout";
        case "Actionable":
          return "ActionableCallout";
        case "Dismissible":
          return "DismissibleCallout";
        default:
          return "Callout";
      }
    })();

    const textNode = children.find((child) => child.type === "TEXT") as NormalizedTextNode | null;

    if (!textNode) {
      return createElement(tag, undefined, undefined, "내용을 제공해주세요.");
    }

    const slices = textNode.segments;

    let title: string | undefined;
    let description: string | undefined;
    let linkLabel: string | undefined;

    switch (slices.length) {
      case 1: {
        description = slices[0]?.characters.trim();

        break;
      }
      case 2: {
        const firstSlice = slices[0];
        const secondSlice = slices[1];

        if (firstSlice?.style.fontWeight === 700) {
          title = firstSlice?.characters.trim();
          description = secondSlice?.characters.trim();
          break;
        }

        description = firstSlice?.characters.trim();

        if (tag !== "ActionableCallout") {
          linkLabel = secondSlice?.characters.trim();
        }

        break;
      }
      case 3: {
        title = slices[0]?.characters.trim();
        description = slices[1]?.characters.trim();

        if (tag !== "ActionableCallout") {
          linkLabel = slices[2]?.characters.trim();
        }

        break;
      }
    }

    const commonProps = {
      tone: camelCase(props.Tone.value),
      title,
      description,
      linkProps: {
        children: linkLabel,
      },
      ...(props["Icon#12598:210"].value && {
        prefixIcon: createElement(createIconTagNameFromKey(props["Icon#12598:210"].componentKey)),
      }),
    };

    return createElement(tag, commonProps);
  },
};

const checkboxHandler: ComponentHandler<CheckboxProperties> = {
  key: metadata.checkbox.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      label: props["Label#49990:0"].value,
      weight: camelCase(props.Weight.value),
      variant: camelCase(props.Shape.value),
      size: handleSize(props.Size.value),
      ...(states.includes("Selected") && {
        defaultChecked: true,
      }),
      ...(states.includes("Indeterminate") && {
        defaultChecked: true,
        indeterminate: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("Checkbox", commonProps);
  },
};

const chipTabsHandler: ComponentHandler<ChipTabsProperties> = {
  key: metadata.chipTablist.key,
  codegen: async (node) => {
    const chipTabsItems = await findAllInstances<ChipTabsItemProperties>({
      node,
      key: chipTabsItemHandler.key,
    });

    const selectedChipTabsItem = chipTabsItems.find((chipTabsItem) =>
      chipTabsItem.componentProperties.State.value.split("-").includes("Selected"),
    );

    const chipTabsList = createElement(
      "ChipTabsList",
      undefined,
      await Promise.all(chipTabsItems.map(chipTabsItemHandler.codegen)),
    );

    const commonProps = {
      variant: camelCase(node.componentProperties.Variant.value),
      ...(selectedChipTabsItem && {
        defaultValue: selectedChipTabsItem.componentProperties["Label#8876:0"].value,
      }),
    };

    return createElement("ChipTabs", commonProps, chipTabsList);
  },
};

const chipTabsItemHandler: ComponentHandler<ChipTabsItemProperties> = {
  key: "fa80168b02051fbb0ba032238bd76d840dbe2e15",
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      value: props["Label#8876:0"].value,
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("ChipTabsTrigger", commonProps, props["Label#8876:0"].value);
  },
};

const controlChipHandler: ComponentHandler<ControlChipProperties> = {
  key: metadata.controlChip.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const { layout, children } = await match(props.Layout.value)
      .with("Icon Only", async () => ({
        layout: "iconOnly",
        children: [
          createElement("Icon", {
            svg: createElement(createIconTagNameFromKey(props["Icon#8722:41"].componentKey)),
          }),
        ],
      }))
      .with("Icon First", async () => ({
        layout: "withText",
        children: [
          createElement("PrefixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Prefix Icon#8722:0"].componentKey)),
          }),
          props["Label#7185:0"].value,
        ],
      }))
      .with("Icon Last", async () => ({
        layout: "withText",
        children: [
          props["Label#7185:0"].value,
          createElement("SuffixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Suffix Icon#8722:82"].componentKey)),
          }),
        ],
      }))
      .with("Icon Both", async () => ({
        layout: "withText",
        children: [
          createElement("PrefixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Prefix Icon#8722:0"].componentKey)),
          }),
          props["Label#7185:0"].value,
          createElement("SuffixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Suffix Icon#8722:82"].componentKey)),
          }),
        ],
      }))
      .with("Text Only", () => ({
        layout: "withText",
        children: props["Label#7185:0"].value,
      }))
      .exhaustive();

    const commonProps = {
      size: handleSize(props.Size.value),
      layout,
      ...(states.includes("Selected") && {
        defaultChecked: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
      ...(props["Show Count#7185:42"].value && {
        count: Number(props["Count#7185:21"].value),
      }),
    };

    return createElement("ControlChip.Toggle", commonProps, children);
  },
};

const errorStateHandler: ComponentHandler<ErrorStateProperties> = {
  key: metadata.errorState.key,
  codegen: async (node) => {
    const props = node.componentProperties;

    const [actionButtonNode] = await findAllInstances<ActionButtonProperties>({
      node,
      key: actionButtonHandler.key,
    });

    const commonProps = {
      variant: camelCase(props.Variant.value),
      ...(props.Layout.value === "With Title" && {
        title: props["Title#16237:0"].value,
      }),
      description: props["Description#16237:5"].value,
      ...(actionButtonNode && {
        primaryActionProps: {
          children: (await actionButtonHandler.codegen(actionButtonNode)).children[0],
        },
        secondaryActionProps: {
          children: props["Secondary Action Label#17042:0"].value,
        },
      }),
    };

    return createElement("ErrorState", commonProps);
  },
};

const extendedActionSheetHandler: ComponentHandler<ExtendedActionSheetProperties> = {
  key: metadata.extendedActionSheet.key,
  codegen: async (node) => {
    const { componentProperties: props } = node;

    const groups = findAllInstances<ExtendedActionSheetGroupProperties>({
      node,
      key: extendedActionSheetGroupHandler.key,
    });

    const contentChildren = await Promise.all(groups.map(extendedActionSheetGroupHandler.codegen));

    const title = props["Show Title#17043:12"].value ? props["Title#14599:0"].value : undefined;

    const content = createElement(
      "ExtendedActionSheetContent",
      { title },
      contentChildren,
      title
        ? undefined
        : "title을 제공하지 않는 경우 aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
    );

    const trigger = createElement(
      "ExtendedActionSheetTrigger",
      { asChild: true },
      createElement(
        "ActionButton",
        undefined,
        "열기",
        "ExtendedActionSheet을 여는 요소를 제공해주세요.",
      ),
    );

    return createElement("ExtendedActionSheet", undefined, [trigger, content]);
  },
};

const extendedActionSheetGroupHandler: ComponentHandler<ExtendedActionSheetGroupProperties> = {
  key: "2a504a1c6b7810d5e652862dcba2cb7048f9eb16",
  codegen: async (node) => {
    const items = findAllInstances<ExtendedActionSheetItemProperties>({
      node,
      key: extendedActionSheetItemHandler.key,
    });

    const contentChildren = await Promise.all(items.map(extendedActionSheetItemHandler.codegen));

    return createElement("ExtendedActionSheetGroup", undefined, contentChildren);
  },
};

const extendedActionSheetItemHandler: ComponentHandler<ExtendedActionSheetItemProperties> = {
  key: "057083e95466da59051119eec0b41d4ad5a07f8f",
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      tone: camelCase(props.Tone.value),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("ExtendedActionSheetItem", commonProps, [
      props["Show Prefix Icon#17043:5"].value
        ? createElement("PrefixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Prefix Icon#55948:0"].componentKey)),
          })
        : undefined,
      props["Label#55905:8"].value,
    ]);
  },
};

const extendedFabHandler: ComponentHandler<ExtendedFabProperties> = {
  key: metadata.extendedFloatingActionButton.key,
  codegen: async ({ componentProperties: props }) => {
    const commonProps = {
      size: handleSize(props.Size.value),
      variant: camelCase(props.Variant.value),
    };

    return createElement("ExtendedFab", commonProps, [
      createElement("PrefixIcon", {
        svg: createElement(createIconTagNameFromKey(props["Icon#28796:0"].componentKey)),
      }),
      props["Label#28936:0"].value,
    ]);
  },
};

const fabHandler: ComponentHandler<FabProperties> = {
  key: metadata.floatingActionButton.key,
  codegen: async ({ componentProperties: props }) => {
    return createElement(
      "Fab",
      undefined,
      createElement(createIconTagNameFromKey(props["Icon#28796:0"].componentKey)),
      "aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
    );
  },
};

const helpBubbleHandler: ComponentHandler<HelpBubbleProperties> = {
  key: metadata.helpBubble.key,
  codegen: async ({ componentProperties: props }) => {
    const placement:
      | "top"
      | "right"
      | "bottom"
      | "left"
      | "top-end"
      | "top-start"
      | "right-end"
      | "right-start"
      | "bottom-end"
      | "bottom-start"
      | "left-end"
      | "left-start" = (() => {
      switch (props.Placement.value) {
        case "Bottom-Left":
          return "top-start";
        case "Bottom-Center":
          return "top";
        case "Bottom-Right":
          return "top-end";
        case "Left-Top":
          return "right-start";
        case "Left-Center":
          return "right";
        case "Left-Bottom":
          return "right-end";
        case "Top-Left":
          return "bottom-start";
        case "Top-Center":
          return "bottom";
        case "Top-Right":
          return "bottom-end";
        case "Right-Top":
          return "left-start";
        case "Right-Center":
          return "left";
        case "Right-Bottom":
          return "left-end";
      }
    })();

    const commonProps = {
      title: props["Title#62535:0"].value,
      ...(props["Show Description#62499:0"].value && {
        description: props["Description#62535:98"].value,
      }),
      showCloseButton: props["Show Close Button"].value === "True",
      defaultOpen: true,
      placement,
    };

    return createElement(
      "HelpBubbleTrigger",
      commonProps,
      createElement("ActionButton", undefined, "열기", "HelpBubble을 여는 요소를 제공해주세요."),
    );
  },
};

const identityPlaceholderHandler: ComponentHandler<IdentityPlaceholderProperties> = {
  key: metadata.identityPlaceholder.key,
  codegen: async ({ componentProperties: props }) => {
    const commonProps = {
      identity: camelCase(props.Identity.value),
    };

    return createElement("IdentityPlaceholder", commonProps);
  },
};

const inlineBannerHandler: ComponentHandler<InlineBannerProperties> = {
  key: metadata.inlineBanner.key,
  codegen: async (node) => {
    const { componentProperties: props } = node;

    const tag = (() => {
      switch (props.Interaction.value) {
        case "Default":
          return "InlineBanner";
        case "Actionable":
          return "ActionableInlineBanner";
        case "Dismissible":
          return "DismissibleInlineBanner";
        case "Link":
          return "InlineBanner";
        default:
          return "InlineBanner";
      }
    })();

    const textNode = findOne(
      node,
      (child) => child.type === "TEXT" && child.name === "Label",
    ) as NormalizedTextNode | null;

    if (!textNode) {
      return createElement(tag, undefined, undefined, "내용을 제공해주세요.");
    }

    const slices = textNode.segments;

    let title: string | undefined;
    let description: string | undefined;

    switch (slices.length) {
      case 1: {
        description = slices[0]?.characters.trim();

        break;
      }
      case 2: {
        title = slices[0]?.characters.trim();
        description = slices[1]?.characters.trim();

        break;
      }
    }

    const iconNode = findOne(
      node,
      (child) => child.type === "INSTANCE" && child.name === "icon",
    ) as NormalizedInstanceNode | null;

    const iconComponentKey =
      props["Show Icon#11840:27"] && iconNode ? iconNode.componentKey : undefined;
    const prefixIcon = iconComponentKey
      ? createElement(createIconTagNameFromKey(iconComponentKey))
      : undefined;

    const commonProps = {
      variant: camelCase(props.Variant.value),
      title,
      description,
      ...(props.Interaction.value === "Link" && {
        linkProps: {
          children: props["Link Label#1547:81"].value,
        },
      }),
      prefixIcon,
    };

    return createElement(tag, commonProps);
  },
};

const mannerTempBadgeHandler: ComponentHandler<MannerTempBadgeProperties> = {
  key: metadata.mannerTempBadge.key,
  codegen: async ({ children }) => {
    const textNode = children.find((child) => child.type === "TEXT");

    const commonProps = {
      temperature: Number(textNode?.characters.replace(/[^\d.-]/g, "") ?? "-1"),
    };

    return createElement("MannerTempBadge", commonProps);
  },
};

const multilineTextFieldHandler: ComponentHandler<MultilineTextFieldProperties> = {
  key: metadata.multilineTextField.key,
  codegen: async ({ componentProperties: props }) => {
    const {
      Size: { value: size },
      State: { value: state },
      Filled: { value: filled },
      "Show Header#870:0": { value: showHeader },
      "Label#15327:323": { value: label },
      "Show Indicator#1259:0": { value: showIndicator },
      "Indicator#15327:286": { value: indicator },
      "Placeholder#958:0": { value: placeholder },
      "Filled Text#1304:0": { value: defaultValue },
      "Show Footer#958:25": { value: showFooter },
      "Show Description#958:50": { value: showDescription },
      "Description#15327:212": { value: description },
      "Show Character count#958:75": { value: showCharacterCount },
      "Character Count#15327:360": { value: _characterCount },
      "Max Character Count#15327:175": { value: maxCharacterCount },
    } = props;

    const states = state.split("-");

    const commonProps = {
      size: handleSize(size),
      // header
      ...(showHeader && {
        label,
      }),
      ...(showHeader &&
        showIndicator && {
          indicator,
        }),
      // input
      ...(filled === "True" && {
        defaultValue,
      }),
      ...(states.includes("Invalid") && {
        invalid: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
      ...(states.includes("Read Only") && {
        readOnly: true,
      }),
      // footer
      ...(showFooter &&
        showDescription &&
        states.includes("Invalid") && {
          // invalid인 경우 description을 error로 사용
          errorMessage: description,
        }),
      ...(showFooter &&
        showDescription &&
        !states.includes("Invalid") && {
          // invalid가 아닌 경우 description을 description으로 사용
          description,
        }),
      ...(showFooter &&
        showCharacterCount && {
          maxGraphemeCount: Number(maxCharacterCount),
        }),
    };

    const inputProps = {
      placeholder,
    };

    const TextFieldChildren = createElement("TextFieldTextarea", inputProps);

    return createElement("TextField", commonProps, TextFieldChildren);
  },
};

const progressCircleHandler: ComponentHandler<ProgressCircleProperties> = {
  key: metadata.progressCircle.key,
  codegen: async ({ componentProperties: props }) => {
    const { value, minValue, maxValue } = match(props.Value.value)
      .with("Indeterminate", () => ({
        value: undefined,
        minValue: undefined,
        maxValue: undefined,
      }))
      .with("0%", () => ({
        value: 0,
        minValue: 0,
        maxValue: 100,
      }))
      .with("25%", () => ({
        value: 25,
        minValue: 0,
        maxValue: 100,
      }))
      .with("75%", () => ({
        value: 75,
        minValue: 0,
        maxValue: 100,
      }))
      .with("100%", () => ({
        value: 100,
        minValue: 0,
        maxValue: 100,
      }))
      .exhaustive();

    const commonProps = {
      value,
      minValue,
      maxValue,
      size: props.Size.value,
      tone: camelCase(props.Tone.value),
    };

    return createElement("ProgressCircle", commonProps);
  },
};

const reactionButtonHandler: ComponentHandler<ReactionButtonProperties> = {
  key: metadata.reactionButton.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      size: handleSize(props.Size.value),
      ...(states.includes("Loading") && {
        loading: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
      ...(states.includes("Selected") && {
        defaultPressed: true,
      }),
    };

    return createElement("ReactionButton", commonProps, [
      createElement("PrefixIcon", {
        svg: createElement(createIconTagNameFromKey(props["Icon#12379:0"].componentKey)),
      }),
      props["Label#6397:0"].value,
      props["Show Count#6397:33"].value
        ? createElement("Count", {}, props["Count#15816:0"].value)
        : undefined,
    ]);
  },
};

const segmentedControlHandler: ComponentHandler<SegmentedControlProperties> = {
  key: metadata.segmentedControl.key,
  codegen: async (node) => {
    const segments = await findAllInstances<SegmentedControlItemProperties>({
      node,
      key: segmentedControlItemHandler.key,
    });

    const selectedSegment = segments.find((segment) =>
      segment.componentProperties.State.value.split("-").includes("Selected"),
    );

    const segmentedControlChildren = await Promise.all(
      segments.map(segmentedControlItemHandler.codegen),
    );

    const commonProps = {
      ...(selectedSegment && {
        defaultValue: selectedSegment.componentProperties["Label#11366:15"].value,
      }),
    };

    return createElement(
      "SegmentedControl",
      commonProps,
      segmentedControlChildren,
      "aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
    );
  },
};

const segmentedControlItemHandler: ComponentHandler<SegmentedControlItemProperties> = {
  key: "9a7ba0d4c041ddbce84ee48881788434fd6bccc8",
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");
    const commonProps = {
      value: props["Label#11366:15"].value,
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("SegmentedControlItem", commonProps, props["Label#11366:15"].value);
  },
};

const selectBoxGroupHandler: ComponentHandler<SelectBoxGroupProperties> = {
  key: metadata.templateSelectBoxGroup.key,
  codegen: async (node) => {
    const props = node.componentProperties;

    const tag = (() => {
      switch (props.Control.value) {
        case "Checkbox":
          return "CheckSelectBoxGroup";
        case "Radio":
          return "RadioSelectBoxGroup";
      }
    })();

    const selectBoxes = await findAllInstances<SelectBoxProperties>({
      node,
      key: selectBoxHandler.key,
    });

    const selectedSelectBox = selectBoxes.find((selectBox) =>
      selectBox.componentProperties.State.value.split("-").includes("Selected"),
    );

    const stack = createElement(
      "Stack",
      { gap: "spacingY.componentDefault" },
      await Promise.all(selectBoxes.map(selectBoxHandler.codegen)),
    );

    const commonProps = {
      ...(tag === "RadioSelectBoxGroup" && {
        defaultValue: selectedSelectBox?.componentProperties["Label#3635:0"].value,
      }),
    };

    return createElement(tag, commonProps, stack);
  },
};

const selectBoxHandler: ComponentHandler<SelectBoxProperties> = {
  key: metadata.selectBox.key,
  codegen: async ({ componentProperties: props }) => {
    const tag = (() => {
      switch (props.Control.value) {
        case "Checkbox":
          return "CheckSelectBox";
        case "Radio":
          return "RadioSelectBox";
      }
    })();

    const states = props.State.value.split("-");

    const commonProps = {
      label: props["Label#3635:0"].value,
      ...(props["Show Description#3033:0"].value && {
        description: props["Description #3033:5"].value,
      }),
      ...(tag === "RadioSelectBox" && {
        value: props["Label#3635:0"].value,
      }),
      ...(tag === "CheckSelectBox" &&
        states.includes("Selected") && {
          defaultChecked: true,
        }),
    };

    return createElement(tag, commonProps);
  },
};

const skeletonHandler: ComponentHandler<SkeletonProperties> = {
  key: metadata.skeleton.key,
  codegen: async ({
    componentProperties: props,
    absoluteBoundingBox,
    layoutSizingHorizontal,
    layoutSizingVertical,
    boundVariables,
  }) => {
    const commonProps = {
      radius: camelCase(props.Radius.value),
      width: (() => {
        switch (layoutSizingHorizontal) {
          case "FIXED": {
            const variableId = boundVariables?.size?.x?.id;
            if (variableId) return getLayoutVariableName(variableId);

            return `${absoluteBoundingBox?.width}px`;
          }
          case "FILL":
            return "full";
          default:
            return "full";
        }
      })(),
      height: (() => {
        switch (layoutSizingVertical) {
          case "FIXED": {
            const variableId = boundVariables?.size?.y?.id;
            if (variableId) return getLayoutVariableName(variableId);

            return `${absoluteBoundingBox?.height}px`;
          }
          case "FILL":
            return "full";
          default:
            return "full";
        }
      })(),
    };

    return createElement("Skeleton", commonProps);
  },
};

const snackbarHandler: ComponentHandler<SnackbarProperties> = {
  key: metadata.snackbar.key,
  codegen: async ({ componentProperties: props }) => {
    const commonProps = {
      message: props["Message#1528:4"].value,
      variant: camelCase(props.Variant.value),
      ...(props["Show Action Button#1528:0"].value && {
        actionLabel: props["Action Button Label#1528:8"].value,
      }),
    };

    // TODO: adapter.create({ render })
    return createElement("Snackbar", commonProps);
  },
};

const tabsHandler: ComponentHandler<TabsProperties> = {
  key: metadata.tablist.key,
  codegen: async ({ componentProperties: props, children }) => {
    const tabsItems = children
      .map((child) => {
        if (child.type !== "INSTANCE") return null;

        const componentKey = child.componentSetKey ? child.componentSetKey : child.componentKey;

        if (componentKey === tabsHugItemHandler.key)
          return {
            triggerLayout: "hug" as const,
            node: child as NormalizedInstanceNode & { componentProperties: TabsHugItemProperties },
          };

        if (componentKey === tabsFillItemHandler.key)
          return {
            triggerLayout: "fill" as const,
            node: child as NormalizedInstanceNode & { componentProperties: TabsFillItemProperties },
          };

        return null;
      })
      .filter((tabsItem) => tabsItem !== null);

    const selectedTabsItem = tabsItems.find(({ node: { componentProperties } }) =>
      componentProperties.State.value.split("-").includes("Selected"),
    )?.node;

    const tabTriggerList = createElement(
      "TabsList",
      undefined,
      await Promise.all(
        tabsItems.map(({ triggerLayout, node }) => {
          switch (triggerLayout) {
            case "hug":
              return tabsHugItemHandler.codegen(node);
            case "fill":
              return tabsFillItemHandler.codegen(node);
          }
        }),
      ),
    );

    const tabContents = tabsItems.map(({ node }) => {
      const value = node.componentProperties["Label#4478:2"].value;

      return createElement("TabsContent", { value }, "{/* TODO: 컨텐츠 추가 */}");
    });

    const commonProps = {
      triggerLayout: camelCase(props.Layout.value),
      size: handleSize(props.Size.value),
      ...(selectedTabsItem && {
        defaultValue: selectedTabsItem.componentProperties["Label#4478:2"].value,
      }),
    };

    return createElement("TabsRoot", commonProps, [tabTriggerList, ...tabContents]);
  },
};

const tabsHugItemHandler: ComponentHandler<TabsHugItemProperties> = {
  key: "c242492543b327ceb84fa9933841512fc62a898c",
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      value: props["Label#4478:2"].value,
      ...(props.Notification.value === "True" && {
        alert: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("TabsTrigger", commonProps, props["Label#4478:2"].value);
  },
};

const tabsFillItemHandler: ComponentHandler<TabsFillItemProperties> = {
  key: "7275293344efb40ee9a3f5248ba2659b94a0b305",
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      value: props["Label#4478:2"].value,
      ...(props.Notification.value === "True" && {
        alert: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("TabsTrigger", commonProps, props["Label#4478:2"].value);
  },
};

const textButtonHandler: ComponentHandler<TextButtonProperties> = {
  key: metadata.textButton.key,
  codegen: async (node) => {
    const { componentProperties: props } = node;

    const states = props.State.value.split("-");

    const { prefixIcon, suffixIcon, children } = await match(props.Layout.value)
      .with("Icon First", async () => ({
        prefixIcon: createElement(
          createIconTagNameFromKey(props["Prefix Icon#7561:0"].componentKey),
        ),
        suffixIcon: undefined,
        children: props["Label#6148:0"].value,
      }))
      .with("Icon Last", () => {
        const suffixIconNode = findOne(
          node,
          (node) => node.type === "INSTANCE" && node.name === "Suffix Icon",
        ) as NormalizedInstanceNode | null;

        const suffixIconComponentKey = suffixIconNode?.componentKey;

        return {
          prefixIcon: undefined,
          suffixIcon: suffixIconComponentKey
            ? createElement(createIconTagNameFromKey(suffixIconComponentKey))
            : undefined,
          children: props["Label#6148:0"].value,
        };
      })
      .exhaustive();

    const commonProps = {
      tone: camelCase(props.Tone.value),
      size: handleSize(props.Size.value),
      prefixIcon,
      suffixIcon,
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("TextButton", commonProps, children);
  },
};

const textFieldHandler: ComponentHandler<TextFieldProperties> = {
  key: metadata.textField.key,
  codegen: async ({ componentProperties: props }) => {
    const {
      Size: { value: size },
      State: { value: state },
      Filled: { value: filled },
      "Show Header#870:0": { value: showHeader },
      "Label#14964:0": { value: label },
      "Show Indicator#1259:0": { value: showIndicator },
      "Indicator#15327:249": { value: indicator },
      "Show Prefix#958:125": { value: showPrefix },
      "Show Prefix Icon#1267:50": { value: showPrefixIcon },
      "Prefix Icon#1267:25": { value: prefixIcon },
      "Show Prefix Text#1267:0": { value: showPrefixText },
      "Prefix Text#15327:101": { value: prefix },
      "Placeholder#958:0": { value: placeholder },
      "Filled Text#1304:0": { value: defaultValue },
      "Show Suffix#958:100": { value: showSuffix },
      "Show Suffix Icon#1267:75": { value: showSuffixIcon },
      "Suffix Icon #1267:100": { value: suffixIcon },
      "Show Suffix Text#1267:125": { value: showSuffixText },
      "Suffix Text#15327:138": { value: suffix },
      "Show Footer#958:25": { value: showFooter },
      "Show Description#958:50": { value: showDescription },
      "Description#12626:5": { value: description },
      "Show Character Count#958:75": { value: showCharacterCount },
      "Character Count#15327:64": { value: _characterCount },
      "Max Character Count#15327:27": { value: maxCharacterCount },
    } = props;

    const states = state.split("-");

    const commonProps = {
      size: handleSize(size),
      // header
      ...(showHeader && {
        label,
      }),
      ...(showHeader &&
        showIndicator && {
          indicator,
        }),
      // input affixes
      ...(showPrefix &&
        showPrefixIcon && {
          prefixIcon: createElement(createIconTagNameFromKey(prefixIcon)),
        }),
      ...(showPrefix &&
        showPrefixText && {
          prefix,
        }),
      ...(showSuffix &&
        showSuffixIcon && {
          suffixIcon: createElement(createIconTagNameFromKey(suffixIcon)),
        }),
      ...(showSuffix &&
        showSuffixText && {
          suffix,
        }),
      // input
      ...(filled === "True" && {
        defaultValue,
      }),
      ...(states.includes("Invalid") && {
        invalid: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
      ...(states.includes("Read Only") && {
        readOnly: true,
      }),
      // footer
      ...(showFooter &&
        showDescription &&
        states.includes("Invalid") && {
          // invalid인 경우 description을 error로 사용
          errorMessage: description,
        }),
      ...(showFooter &&
        showDescription &&
        !states.includes("Invalid") && {
          // invalid가 아닌 경우 description을 description으로 사용
          description,
        }),
      ...(showFooter &&
        showCharacterCount && {
          maxGraphemeCount: Number(maxCharacterCount),
        }),
    };

    const inputProps = {
      placeholder,
    };

    const TextFieldChildren = createElement("TextFieldInput", inputProps);

    return createElement("TextField", commonProps, TextFieldChildren);
  },
};

const switchHandler: ComponentHandler<SwitchProperties> = {
  key: metadata.switch.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const size = handleSize(props.Size.value);

    const commonProps = {
      size,
      ...(size === "small" && {
        label: props["Label#15191:2"].value,
      }),
      ...(states.includes("Selected") && {
        defaultChecked: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("Switch", commonProps);
  },
};

const toggleButtonHandler: ComponentHandler<ToggleButtonProperties> = {
  key: metadata.toggleButton.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      variant: camelCase(props.Variant.value),
      size: handleSize(props.Size.value),
      ...(states.includes("Selected") && {
        defaultPressed: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
      ...(states.includes("Loading") && {
        loading: true,
      }),
    };

    return createElement("ToggleButton", commonProps, [
      props["Show Prefix Icon#6122:392"].value
        ? createElement("PrefixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Prefix Icon#6122:98"].componentKey)),
          })
        : undefined,
      props["Label#6122:49"].value,
      props["Show Suffix Icon#6122:147"].value
        ? createElement("SuffixIcon", {
            svg: createElement(
              createIconTagNameFromKey(props["Suffix Icon#6122:343"].componentKey),
            ),
          })
        : undefined,
    ]);
  },
};

const componentHandlers = [
  actionButtonHandler,
  actionChipHandler,
  actionSheetHandler,
  appBarHandler,
  avatarHandler,
  avatarStackHandler,
  badgeHandler,
  calloutHandler,
  checkboxHandler,
  chipTabsHandler,
  controlChipHandler,
  errorStateHandler,
  extendedActionSheetHandler,
  extendedFabHandler,
  fabHandler,
  helpBubbleHandler,
  identityPlaceholderHandler,
  inlineBannerHandler,
  mannerTempBadgeHandler,
  multilineTextFieldHandler,
  progressCircleHandler,
  reactionButtonHandler,
  segmentedControlHandler,
  selectBoxGroupHandler,
  selectBoxHandler,
  skeletonHandler,
  snackbarHandler,
  switchHandler,
  tabsHandler,
  textButtonHandler,
  textFieldHandler,
  toggleButtonHandler,
] as ComponentHandler[];

export const componentHandlerMap = new Map(
  componentHandlers.map((component) => [component.key, component]),
);

export const ignoredComponentKeys = new Set<string>([
  "1acdc7247c83a73a0504d6fad86d08783938cb1a",
  "b38b719b61cdf1a24458d7a7888bee74b7649084",
]);
