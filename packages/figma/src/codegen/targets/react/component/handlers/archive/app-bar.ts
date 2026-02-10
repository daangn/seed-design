import type {
  AppBarProperties,
  AppBarMainProperties,
  AppBarRightIconButtonProperties,
  AppBarLeftIconButtonProperties,
} from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { match } from "ts-pattern";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("app-bar");

const APP_BAR_TITLE_KEY = "d2cc4f615b2b44098be89448ad1c573f94af0355";
const APP_BAR_LEFT_ICON_BUTTON_KEY = "5a953f7bafc0df744777517458396e9f6c915825";
const APP_BAR_RIGHT_ICON_BUTTON_KEY = "c08db793288077e53bd45ef11aa419a835e88fce";

const createAppBarMainHandler = (_ctx: ComponentHandlerDeps) => {
  return defineComponentHandler<AppBarMainProperties>(
    APP_BAR_TITLE_KEY,
    ({ componentProperties: props }) => {
      const { title, subtitle } = match(props.Type.value)
        .with("Title", () => ({
          title: props["Title#16944:0"].value,
          subtitle: undefined,
        }))
        .with("Title-Subtitle", () => ({
          title: props["Title#16944:0"].value,
          subtitle: props["Subtitle#16958:9"].value,
        }))
        .with("Logo (Figma Only)", () => ({
          title: undefined,
          subtitle: undefined,
        }))
        .exhaustive();

      if (title) {
        return createLocalSnippetElement("AppBarMain", { title, subtitle });
      }

      return createLocalSnippetElement("AppBarMain", undefined, undefined, {
        comment: "AppBarMain 내부를 직접 작성해주세요.",
      });
    },
  );
};

export const createAppBarHandler = (ctx: ComponentHandlerDeps) => {
  const appBarMainHandler = createAppBarMainHandler(ctx);

  return defineComponentHandler<AppBarProperties>(metadata.topNavigation.key, (node, traverse) => {
    const props = node.componentProperties;

    const { theme, tone } = {
      theme: match(props["OS (Figma Only)"].value)
        .with("Android", () => "android")
        .with("iOS", () => "cupertino")
        .exhaustive(),

      tone: match(props.Variant.value)
        .with("Layer Default", () => "layer")
        .with("Transparent", () => "transparent")
        .exhaustive(),
    };

    const main = (() => {
      if (!props["Show Title#33588:82"].value) {
        return undefined;
      }

      const [mainNode] = findAllInstances<AppBarMainProperties>({ node, key: APP_BAR_TITLE_KEY });

      if (!mainNode) {
        return undefined;
      }

      return appBarMainHandler.transform(mainNode, traverse);
    })();

    const leftChildren = match(props.Left.value)
      .with("None", () => undefined)
      .with("Back", () => [createLocalSnippetElement("AppBarBackButton")])
      .with("Close", () => [createLocalSnippetElement("AppBarCloseButton")])
      .with("Custom", () => {
        const buttons = findAllInstances<AppBarLeftIconButtonProperties>({
          node,
          key: APP_BAR_LEFT_ICON_BUTTON_KEY,
        });

        if (buttons.length > 0) {
          return buttons.map((button) =>
            createLocalSnippetElement(
              "AppBarIconButton",
              undefined,
              ctx.iconHandler.transform(button.componentProperties["Icon#33580:0"]),
              { comment: "AppBarIconButton에 aria-label 속성을 추가해주세요." },
            ),
          );
        }

        return undefined;
      })
      .exhaustive();

    const left =
      leftChildren && leftChildren.length > 0
        ? createLocalSnippetElement("AppBarLeft", {}, leftChildren)
        : undefined;

    const rightChildren = match(props.Right.value)
      .with("None", () => undefined)
      .with("1 Icon Button", "2 Icon Button", "3 Icon Button", () => {
        const buttons = findAllInstances<AppBarRightIconButtonProperties>({
          node,
          key: APP_BAR_RIGHT_ICON_BUTTON_KEY,
        });

        return buttons.map((button) =>
          createLocalSnippetElement(
            "AppBarIconButton",
            undefined,
            ctx.iconHandler.transform(button.componentProperties["Icon#6406:3"]),
            { comment: "AppBarIconButton에 aria-label 속성을 추가해주세요." },
          ),
        );
      })
      .with("Text Button", () => undefined)
      .exhaustive();

    const right =
      rightChildren && rightChildren.length > 0
        ? createLocalSnippetElement("AppBarRight", {}, rightChildren)
        : undefined;

    return createLocalSnippetElement(
      "AppBar",
      { theme, tone },
      [left, main, right].filter(Boolean),
      {
        comment:
          tone === "transparent"
            ? '<AppScreen layerOffsetTop="none">으로 상단 패딩을 제거할 수 있습니다.'
            : undefined,
      },
    );
  });
};
