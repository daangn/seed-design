import type {
  FieldFooterProperties,
  FieldHeaderProperties,
  SelectBoxGroupFieldProperties,
  SelectBoxGroupProperties,
  SelectBoxHorizontalProperties,
  SelectBoxPrefixIconProperties,
  SelectBoxVerticalProperties,
} from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import * as components from "@/entities/data/__generated__/components";
import { findAllInstances } from "@/utils/figma-node";
import { match } from "ts-pattern";
import { createLocalSnippetHelper, createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import {
  createFieldFooterHandler,
  createFieldHeaderHandler,
  type FieldFooterProps,
  type FieldHeaderProps,
} from "@/codegen/targets/react/component/handlers/field";

const PREFIX_KEYS = [
  components.componentSelectBoxItemPrefixIcon.key,
  components.componentSelectBoxItemPrefixAvatar.key,
  components.componentSelectBoxItemPrefixImage.key,
  components.componentSelectBoxItemPrefixBadge.key,
  components.componentSelectBoxItemPrefixCustom.key,
];

const { createLocalSnippetElement } = createLocalSnippetHelper("select-box");

const createSelectBoxHorizontalHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<SelectBoxHorizontalProperties>(
    metadata.componentSelectBoxItemHorizontal.key,
    (node) => {
      const { componentProperties: props } = node;

      const { tag, suffix } = match(props.Control.value)
        .with("Checkmark", () => ({
          tag: "CheckSelectBox" as const,
          suffix: createLocalSnippetElement("CheckSelectBoxCheckmark"),
        }))
        .with("Radiomark", () => ({
          tag: "RadioSelectBoxItem" as const,
          suffix: createLocalSnippetElement("RadioSelectBoxRadiomark"),
        }))
        .with("None", () => ({
          tag: "UnknownSelectBox" as const,
          suffix: undefined,
        }))
        .exhaustive();

      const prefixNode = (() => {
        if (props["Has Prefix#28452:85"].value === false) return null;

        for (const key of PREFIX_KEYS) {
          const [found] = findAllInstances<SelectBoxPrefixIconProperties | {}>({ node, key });

          if (found) return found;
        }

        return null;
      })();

      const prefixIcon = (() => {
        if (!prefixNode) return undefined;

        if ("Icon#2475:0" in prefixNode.componentProperties) {
          return ctx.iconHandler.transform(prefixNode.componentProperties["Icon#2475:0"]);
        }

        // React Select Box only supports icon for now
        // return undefined if not icon

        return undefined;
      })();

      const commonProps = {
        // layout: "horizontal",

        ...(prefixIcon && { prefixIcon }),

        label: props["Title#28452:21"].value,

        ...(props["Show Description#28469:1"].value && {
          description: props["Description#56540:0"].value,
        }),

        ...(suffix && { suffix }),

        ...(props["Show Custom Content#56903:0"].value && {
          footer: createSeedReactElement("Box", undefined, "Footer Placeholder"),
        }),

        ...(tag === "RadioSelectBoxItem" && {
          value: props["Title#28452:21"].value,
        }),

        ...(tag === "CheckSelectBox" &&
          props.Selected.value === "True" && {
            defaultChecked: true,
          }),

        ...(props.State.value === "Disabled" && {
          disabled: true,
        }),
      };

      return createLocalSnippetElement(tag, commonProps, undefined);
    },
  );

const createSelectBoxVerticalHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<SelectBoxVerticalProperties>(
    metadata.componentSelectBoxItemVertical.key,
    (node) => {
      const { componentProperties: props } = node;

      const { tag, suffix } = match(props.Control.value)
        .with("Checkmark", () => ({
          tag: "CheckSelectBox" as const,
          suffix: createLocalSnippetElement("CheckSelectBoxCheckmark"),
        }))
        .with("Radiomark", () => ({
          tag: "RadioSelectBoxItem" as const,
          suffix: createLocalSnippetElement("RadioSelectBoxRadiomark"),
        }))
        .with("None", () => ({
          tag: "UnknownSelectBox" as const,
          suffix: undefined,
        }))
        .exhaustive();

      const prefixNode = (() => {
        if (props["Has Prefix#58766:115"].value === false) return null;

        for (const key of PREFIX_KEYS) {
          const [found] = findAllInstances<SelectBoxPrefixIconProperties | {}>({ node, key });

          if (found) return found;
        }

        return null;
      })();

      const prefixIcon = (() => {
        if (!prefixNode) return undefined;

        if ("Icon#2475:0" in prefixNode.componentProperties) {
          return ctx.iconHandler.transform(prefixNode.componentProperties["Icon#2475:0"]);
        }

        // React Select Box only supports icon for now
        // return undefined if not icon

        return undefined;
      })();

      const commonProps = {
        // layout: "vertical",

        ...(prefixIcon && { prefixIcon }),

        label: props["Title#58766:114"].value,

        ...(props["Show Description#58766:117"].value && {
          description: props["Description#58766:118"].value,
        }),

        ...(suffix && { suffix }),

        ...(props["Show Custom Content#58766:119"].value && {
          footer: createSeedReactElement("Box", undefined, "Footer Placeholder"),
        }),

        ...(tag === "RadioSelectBoxItem" && {
          value: props["Title#58766:114"].value,
        }),

        ...(tag === "CheckSelectBox" &&
          props.Selected.value === "True" && {
            defaultChecked: true,
          }),

        ...(props.State.value === "Disabled" && {
          disabled: true,
        }),
      };

      return createLocalSnippetElement(tag, commonProps, undefined);
    },
  );

export const createSelectBoxGroupHandler = (ctx: ComponentHandlerDeps) => {
  const horizontalHandler = createSelectBoxHorizontalHandler(ctx);
  const verticalHandler = createSelectBoxVerticalHandler(ctx);

  return defineComponentHandler<SelectBoxGroupProperties>(
    metadata.componentSelectBoxGroup.key,
    (node, traverse) => {
      const props = node.componentProperties;

      const horizontalBoxes = findAllInstances<SelectBoxHorizontalProperties>({
        node,
        key: horizontalHandler.key,
      });

      const verticalBoxes = findAllInstances<SelectBoxVerticalProperties>({
        node,
        key: verticalHandler.key,
      });

      const boxes = [...horizontalBoxes, ...verticalBoxes];

      const selectedSelectBox = boxes.find(
        (selectBox) => selectBox.componentProperties.Selected.value === "True",
      );

      const { tag, comment } = match([
        boxes.every((box) => box.componentProperties.Control.value === "Radiomark"),
        boxes.every((box) => box.componentProperties.Control.value === "Checkmark"),
      ])
        .with([true, false], () => ({ tag: "RadioSelectBoxRoot" as const, comment: undefined }))
        .with([false, true], () => ({ tag: "CheckSelectBoxGroup" as const, comment: undefined }))
        .otherwise(() => ({
          tag: "UnknownSelectBoxGroup" as const,
          comment:
            "모든 SelectBox의 Control 프로퍼티가 동일하지 않거나 None이 포함되어 있기 때문에 코드에서 어떻게 사용될지 파악할 수 없습니다. 모든 children 요소들을 CheckSelectBox 또는 RadioSelectBoxItem으로 변경하고 CheckSelectBoxGroup 또는 RadioSelectBoxRoot로 묶어 사용하세요.",
        }));

      const selectedSelectBoxProperties = selectedSelectBox?.componentProperties;

      const commonProps = {
        columns: Number(props.Column.value[0]),

        ...(selectedSelectBoxProperties &&
          tag === "RadioSelectBoxRoot" && {
            defaultValue:
              "Title#28452:21" in selectedSelectBoxProperties
                ? selectedSelectBoxProperties["Title#28452:21"].value
                : selectedSelectBoxProperties["Title#58766:114"].value,
          }),
      };

      const children = [
        ...horizontalBoxes.map((box) => horizontalHandler.transform(box, traverse)),
        ...verticalBoxes.map((box) => verticalHandler.transform(box, traverse)),
      ];

      return createLocalSnippetElement(tag, commonProps, children, { comment });
    },
  );
};

export const createSelectBoxGroupFieldHandler = (ctx: ComponentHandlerDeps) => {
  const fieldHeaderHandler = createFieldHeaderHandler(ctx);
  const fieldFooterHandler = createFieldFooterHandler(ctx);
  const selectBoxGroupHandler = createSelectBoxGroupHandler(ctx);

  return defineComponentHandler<SelectBoxGroupFieldProperties>(
    metadata.templateSelectBoxField.key,
    (node, traverse) => {
      const { componentProperties: props } = node;

      const [group] = findAllInstances<SelectBoxGroupProperties>({
        node,
        key: selectBoxGroupHandler.key,
      });

      const [fieldHeader] = findAllInstances<FieldHeaderProperties>({
        node,
        key: fieldHeaderHandler.key,
      });
      const [fieldFooter] = findAllInstances<FieldFooterProperties>({
        node,
        key: fieldFooterHandler.key,
      });

      const __headerProps =
        props["Show Header#40606:8"].value && fieldHeader
          ? (fieldHeaderHandler.transform(fieldHeader, traverse).props as FieldHeaderProps)
          : {};
      const __footerProps =
        props["Show Footer#40606:9"].value && fieldFooter
          ? (fieldFooterHandler.transform(fieldFooter, traverse).props as FieldFooterProps)
          : {};

      const groupResult = selectBoxGroupHandler.transform(group, traverse);

      const { headerProps, footerProps } = match(
        groupResult.tag as "RadioSelectBoxRoot" | "CheckSelectBoxGroup" | "UnknownSelectBoxGroup",
      )
        .with("RadioSelectBoxRoot", () => {
          const { required: _required, ...headerProps } = __headerProps;
          const { maxGraphemeCount: _maxGraphemeCount, ...footerProps } = __footerProps;

          return { headerProps, footerProps };
        })
        .with("CheckSelectBoxGroup", () => {
          const { required: _required, ...headerProps } = __headerProps;
          const {
            maxGraphemeCount: _maxGraphemeCount,
            invalid: _invalid,
            ...footerProps
          } = __footerProps;

          return { headerProps, footerProps };
        })
        .with("UnknownSelectBoxGroup", () => {
          const { required: _required, ...headerProps } = __headerProps;
          const {
            maxGraphemeCount: _maxGraphemeCount,
            invalid: _invalid,
            ...footerProps
          } = __footerProps;

          return { headerProps, footerProps };
        })
        .exhaustive();

      return {
        ...groupResult,
        props: {
          ...groupResult.props,
          ...headerProps,
          ...footerProps,
        },
      };
    },
  );
};
