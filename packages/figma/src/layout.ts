export interface LayoutComponentProps {
  flexDirection: string | number | boolean;
  alignItems: string | number | boolean;
  justifyContent: string | number | boolean;
  flexWrap: string | number | boolean;
}

export function inferLayoutComponent(props: LayoutComponentProps) {
  if (
    props.flexDirection === "row" &&
    props.alignItems === "flexStart" &&
    props.justifyContent === "flexStart" &&
    props.flexWrap === "wrap"
  ) {
    return "Inline";
  }

  if (
    props.flexDirection === "row" &&
    props.justifyContent === "flexStart" &&
    props.flexWrap === "nowrap"
  ) {
    return "Columns";
  }

  if (props.flexDirection === "column") {
    return "Stack";
  }

  return "Flex";
}
