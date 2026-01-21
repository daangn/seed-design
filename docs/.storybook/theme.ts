import { create } from "storybook/theming/create";

const color = {
  white: "rgba(255, 255, 255, 1)",
  carrot100: "rgba(255, 242, 236, 1)",
  carrot1000: "rgba(71, 22, 1, 1)",
  carrot200: "rgba(255, 232, 219, 1)",
  carrot300: "rgba(255, 213, 192, 1)",
  carrot400: "rgba(255, 185, 153, 1)",
  carrot500: "rgba(255, 147, 100, 1)",
  carrot600: "rgba(255, 102, 0, 1)",
  carrot700: "rgba(232, 69, 0, 1)",
  carrot800: "rgba(185, 57, 1, 1)",
  carrot900: "rgba(134, 43, 0, 1)",
  gray00: "rgba(255, 255, 255, 1)",
  gray100: "rgba(247, 248, 249, 1)",
  gray200: "rgba(243, 244, 245, 1)",
  gray300: "rgba(238, 239, 241, 1)",
  gray400: "rgba(220, 222, 227, 1)",
  gray500: "rgba(209, 211, 216, 1)",
  gray600: "rgba(176, 179, 186, 1)",
  gray700: "rgba(134, 139, 148, 1)",
  gray800: "rgba(88, 96, 112, 1)",
  gray900: "rgba(26, 28, 32, 1)",
};

export default create({
  base: "light",
  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: "monospace",

  brandTitle: "Seed Design Storybook",

  brandImage: "/logo.webp",
  brandTarget: "_self",

  //
  colorPrimary: color.carrot900,
  colorSecondary: color.carrot600,

  // UI
  appBg: color.white,
  appContentBg: color.white,
  appPreviewBg: color.white,
  appBorderColor: color.carrot100,
  appBorderRadius: 12,

  // Text colors
  textColor: color.carrot1000,
  textInverseColor: color.carrot100,
  textMutedColor: color.carrot500,

  // Toolbar default and active colors
  barTextColor: color.carrot1000,
  barSelectedColor: color.carrot600,
  barHoverColor: color.carrot700,
  barBg: color.white,

  buttonBg: color.carrot200,
  buttonBorder: color.carrot300,

  // Form colors
  inputBg: color.white,
  inputBorder: color.carrot200,
  inputTextColor: color.carrot1000,
  inputBorderRadius: 10,

  booleanBg: color.white,
  booleanSelectedBg: color.carrot200,
});
