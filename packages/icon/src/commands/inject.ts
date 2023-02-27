import findup from "findup-sync";
import fs from "fs";

const HTML = "index.html";
const htmlFile = findup(HTML)!;

const findHeadEnd = (html: string) => {
  const headEnd = html.indexOf("</head>");
  if (headEnd === -1) {
    throw new Error("Cannot find </head> in index.html");
  }
  return headEnd;
};

const injectSprite = (html: string, sprite: string) => {
  const headEnd = findHeadEnd(html);
  return html.slice(0, headEnd) + sprite + html.slice(headEnd);
};

const checkSpriteExist = (html: string) => {
  const headEnd = findHeadEnd(html);
  const head = html.slice(0, headEnd);
  return head.includes("seed-icon-injected-svg");
};

export const inject = (sprite: string) => {
  const htmlText = fs.readFileSync(htmlFile, "utf8");
  if (checkSpriteExist(htmlText)) {
    console.log("Sprite already injected");
    return;
  }

  const injectedHtml = injectSprite(htmlText, sprite);
  fs.writeFileSync(htmlFile, injectedHtml);
  console.log("Sprite injected");
};
