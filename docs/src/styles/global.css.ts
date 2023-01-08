import { vars } from "@seed-design/design-token";
import { globalStyle } from "@vanilla-extract/css";

globalStyle("html, body", {
  margin: 0,
  padding: 0,

  // NOTE: TOC 컨텐츠 클릭 시 스크롤 위치 조정
  scrollPaddingTop: "90px",
});

globalStyle("body", {
  backgroundColor: vars.$semantic.color.paperDefault,
  color: vars.$semantic.color.inkText,
  lineHeight: "1.3",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",

  transition: "background-color 0.2s ease, color 0.2s ease",
});

globalStyle(
  "html, body, div, span, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, em, img, ins, kbd, q, s, samp, small, strike, strong, article, footer, header,main,nav, section",
  {
    margin: "0",
    padding: "0",
    border: "0",
    fontSize: "100%",
    verticalAlign: "baseline",
    fontFamily:
      'Pretendard, -apple-system, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
  },
);

globalStyle(
  "article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section",
  {
    display: "block",
  },
);

globalStyle("ol, ul", {
  listStyle: "none",
});

globalStyle("*, *:after, *:before", {
  boxSizing: "border-box",
});

globalStyle("a", {
  textDecoration: "none",
  color: "inherit",
});

globalStyle(
  "h1 .heading-anchor-icon, h2 .heading-anchor-icon, h3 .heading-anchor-icon, h4 .heading-anchor-icon",
  {
    opacity: 0,
    marginLeft: "10px",
    color: vars.$semantic.color.primary,
    transition: "all 0.2s ease-in-out",
  },
);

globalStyle(
  "h1:hover .heading-anchor-icon, h2:hover .heading-anchor-icon, h3:hover .heading-anchor-icon, h4:hover .heading-anchor-icon",
  {
    opacity: 1,
  },
);

globalStyle(".heading-anchor-icon", {});
