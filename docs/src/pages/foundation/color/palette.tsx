import { vars } from "@seed-design/design-token";
import type { HeadFC } from "gatsby";
import { useMemo } from "react";

import { FoundationColorDocumentHeader } from "../../../components/FoundationColorDocumentHeader";
import SEO from "../../../components/SEO";
import * as style from "../../../styles/page-styles/color-palette.css";
import * as t from "../../../styles/token.css";

const colorObject = Object.entries(vars.$scale.color);
function getPalette(target: string) {
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
  return (
    <div className={style.colorContainer}>
      {palette.map(([key, value]) => {
        const colorNumber = Number(key.replace(/[a-zA-Z]/g, ""));
        const hashValue = getComputedStyle(document.body).getPropertyValue(
          value.replace("var(", "").replace(")", ""),
        );

        return (
          <div
            className={style.colorBox}
            style={{ backgroundColor: value }}
            key={key}
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
  const colorPalette = useMemo(() => {
    return {
      gray: getPalette("gray"),
      carrot: getPalette("carrot"),
      blue: getPalette("blue"),
      red: getPalette("red"),
      green: getPalette("green"),
      yellow: getPalette("yellow"),
      pink: getPalette("pink"),
      purple: getPalette("purple"),
      grayAlpha: getPalette("grayAlpha"),
      carrotAlpha: getPalette("carrotAlpha"),
      blueAlpha: getPalette("blueAlpha"),
      redAlpha: getPalette("redAlpha"),
      yellowAlpha: getPalette("yellowAlpha"),
      greenAlpha: getPalette("greenAlpha"),
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
