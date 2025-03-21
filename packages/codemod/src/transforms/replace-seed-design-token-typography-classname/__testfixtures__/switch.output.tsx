// @ts-nocheck

import { text } from "@seed-design/css/recipes/text";

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
            ? text({ textStyle: "t3Bold" })
            : text({ textStyle: "t3Regular" });
        case "medium":
          return bold
            ? text({ textStyle: "t4Bold" })
            : text({ textStyle: "t4Regular" });
        case "large":
          return bold
            ? text({ textStyle: "t5Bold" })
            : text({ textStyle: "t5Regular" });
      }
  };
