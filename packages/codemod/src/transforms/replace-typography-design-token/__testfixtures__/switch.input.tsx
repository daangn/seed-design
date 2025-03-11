// @ts-nocheck

import { classNames } from "@seed-design/design-token";

const getTypographyClassName = ({
  size,
  bold,
}: {
    size: Required<SeedCheckboxProps>["size"];
    bold: Required<SeedCheckboxProps>["bold"];
  }) => {
    switch (size) {
        case "small":
          return bold
            ? classNames.$semantic.typography.caption1Bold
            : classNames.$semantic.typography.caption1Regular;
        case "medium":
          return bold
            ? classNames.$semantic.typography.label3Bold
            : classNames.$semantic.typography.label3Regular;
        case "large":
          return bold
            ? classNames.$semantic.typography.label2Bold
            : classNames.$semantic.typography.label2Regular;
      }
  };
