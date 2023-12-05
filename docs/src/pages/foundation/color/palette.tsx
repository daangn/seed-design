import { vars } from "@seed-design/design-token";
import type { HeadFC } from "gatsby";
import { useEffect, useMemo, useState } from "react";

import { FoundationColorDocumentHeader } from "../../../components/FoundationColorDocumentHeader";
import SEO from "../../../components/SEO";
import * as style from "../../../styles/page-styles/color-palette.css";
import * as t from "../../../styles/token.css";

function getPalette(target: string, colorObject: [string, string][]) {
  return (
    colorObject
      // NOTE: gray가 들어오면 grayAlpha도 들어오기 때문에 뒤에 바로 숫자가 붙는지 확인
      .filter(([key]) => key.match(target + "[0-9]"))
      .sort(
        (a, b) =>
          Number(a[0].replace(target, "")) - Number(b[0].replace(target, "")),
      )
  );
}

const ColorContainer = ({ palette }: { palette: [string, string][] }) => {
  const [computedStyle, setComputedStyle] = useState<CSSStyleDeclaration>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setComputedStyle(window.getComputedStyle(document.body));
  }, []);

  return (
    <div className={style.colorContainer}>
      {palette.map(([key, value]) => {
        const colorNumber = Number(key.replace(/[a-zA-Z]/g, ""));
        const hashValue = computedStyle?.getPropertyValue(
          value.replace("var(", "").replace(")", ""),
        );

        return (
          <div
            className={style.colorBox}
            style={{ backgroundColor: value }}
            key={`${key}-${value}`}
          >
            <div
              className={style.colorDescription({
                inversion: colorNumber >= 500,
              })}
            >
              <span>{key}</span>
              <span>{hashValue}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ColorPalettePage = () => {
  const colorObject = Object.entries(vars.$scale.color);
  const colorPalette = useMemo(() => {
    return {
      gray: getPalette("gray", colorObject),
      carrot: getPalette("carrot", colorObject),
      blue: getPalette("blue", colorObject),
      red: getPalette("red", colorObject),
      green: getPalette("green", colorObject),
      yellow: getPalette("yellow", colorObject),
      pink: getPalette("pink", colorObject),
      purple: getPalette("purple", colorObject),
      grayAlpha: getPalette("grayAlpha", colorObject),
      carrotAlpha: getPalette("carrotAlpha", colorObject),
      blueAlpha: getPalette("blueAlpha", colorObject),
      redAlpha: getPalette("redAlpha", colorObject),
      yellowAlpha: getPalette("yellowAlpha", colorObject),
      greenAlpha: getPalette("greenAlpha", colorObject),
    };
  }, []);

  return (
    <article className={t.content}>
      <FoundationColorDocumentHeader currentPath="palette" />

      <div className={style.container}>
        <h2 className={style.subtitle}>Solid</h2>
        <ColorContainer palette={colorPalette.gray} />
        <ColorContainer palette={colorPalette.carrot} />
        <ColorContainer palette={colorPalette.blue} />
        <ColorContainer palette={colorPalette.red} />
        <ColorContainer palette={colorPalette.green} />
        <ColorContainer palette={colorPalette.yellow} />
        <ColorContainer palette={colorPalette.pink} />
        <ColorContainer palette={colorPalette.purple} />
      </div>

      <div className={style.container}>
        <h2 className={style.subtitle}>Alpha</h2>
        <ColorContainer palette={colorPalette.grayAlpha} />
        <ColorContainer palette={colorPalette.carrotAlpha} />
        <ColorContainer palette={colorPalette.blueAlpha} />
        <ColorContainer palette={colorPalette.redAlpha} />
        <ColorContainer palette={colorPalette.yellowAlpha} />
        <ColorContainer palette={colorPalette.greenAlpha} />
      </div>
    </article>
  );
};

export default ColorPalettePage;

// TODO:
export const Head: HeadFC = () => {
  return (
    <SEO
      name={`Foundation | Color | Palette`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};
