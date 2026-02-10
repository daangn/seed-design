import type { BottomSheetProperties } from "@/codegen/component-properties.archive";
import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { match } from "ts-pattern";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { findAllInstances } from "@/utils/figma-node";

const { createLocalSnippetElement } = createLocalSnippetHelper("bottom-sheet");
const { createLocalSnippetElement: createLocalSnippetElementTrigger } =
  createLocalSnippetHelper("action-button");

// TODO: Bottom Action Bar (WIP) handler의 키. 해당 컴포넌트(템플릿) 핸들러 작성 시 handler.transform()으로 대체
const BOTTOM_SHEET_FOOTER_KEY = "de6c65d34cc4a01c18c9a7c0ded34635170ca11f";
const BOTTOM_SHEET_BODY_KEY = "aa9ffdd60fbfdea42f0d11162cd64f4b4389ddcc";

export const createBottomSheetHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<BottomSheetProperties>(metadata.bottomSheet.key, (node, traverse) => {
    const props = node.componentProperties;
    const headerAlign = match(props["Header Layout"].value)
      .with("Bottom Left", "Top Left", () => "left")
      .with("Bottom Center", "Top Center", () => "center")
      .with("None", () => undefined)
      .exhaustive();

    const contentProps = {
      title: props["Title#19787:3"].value,
      ...(props["Show Description#25192:0"].value === true && {
        description: props["Description#19787:7"].value,
      }),
      showHandle: props["Show Handle#49774:6"].value,
      showCloseButton: props["Show Close Button#19787:11"].value,
    };

    const bodyNodes = findAllInstances({
      node,
      key: BOTTOM_SHEET_BODY_KEY,
    });

    const bottomSheetBody =
      bodyNodes.length === 1
        ? createLocalSnippetElement("BottomSheetBody", {}, bodyNodes[0].children.map(traverse))
        : createLocalSnippetElement(
            "BottomSheetBody",
            {},
            createElement("div", undefined, "No content available"),
          );

    const footerNodes = findAllInstances({
      node,
      key: BOTTOM_SHEET_FOOTER_KEY,
    });

    const bottomSheetFooter =
      props["Show Footer#25162:14"].value && footerNodes.length === 1
        ? createLocalSnippetElement("BottomSheetFooter", {}, footerNodes[0].children.map(traverse))
        : undefined;

    return createLocalSnippetElement("BottomSheetRoot", { defaultOpen: true, headerAlign }, [
      createLocalSnippetElement(
        "BottomSheetTrigger",
        { asChild: true },
        createLocalSnippetElementTrigger("ActionButton", {}, "BottomSheet 열기"),
      ),
      createLocalSnippetElement("BottomSheetContent", contentProps, [
        bottomSheetBody,
        bottomSheetFooter,
      ]),
    ]);
  });
