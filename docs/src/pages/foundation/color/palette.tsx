import { vars } from "@seed-design/design-token";
import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { useMemo } from "react";

import { FoundationColorDocumentHeader } from "../../../components/FoundationColorDocumentHeader";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableRow,
} from "../../../components/mdx/Table";
import SEO from "../../../components/SEO";
import {
  ColorPaletteProvider,
  useColorPaletteState,
} from "../../../contexts/ColorPaletteContext";
import * as style from "../../../styles/page-styles/color-palette.css";
import * as t from "../../../styles/token.css";

interface SemanticColor {
  token: string;
  tokenValue: string;
  scale: string;
  usage: string[];
}

const SEMANTIC_COLORS: {
  informative: SemanticColor[];
  paper: SemanticColor[];
  status: SemanticColor[];
  divider: SemanticColor[];
  overlay: SemanticColor[];
} = {
  informative: [
    {
      token: "$semantic/primary",
      tokenValue: vars.$semantic.color.primary,
      scale: "carrot-500",
      usage: [
        "화면에서 가장 중요한 요소에 사용하는 색입니다.",
        "브랜드 아이덴티티를 담고 있으며, 주로 CTA 버튼이나 중요한 기능을 강조하는 데 사용합니다.",
      ],
    },
    {
      token: "$semantic/primary-low",
      tokenValue: vars.$semantic.color.primaryLow,
      scale: "carrot-50",
      usage: [
        "Primary를 보조하는 색입니다.",
        "Primary와의 대비를 표현하기 위한 배경이나 부가적인 디자인 요소에 사용합니다.",
      ],
    },
    {
      token: "$semantic/secondary",
      tokenValue: vars.$semantic.color.secondary,
      scale: "gray-900",
      usage: [
        "중요도는 높지만 Primary보단 낮은 경우 사용합니다.",
        "주로 타이틀 텍스트나 아이콘에 사용합니다.",
      ],
    },
    {
      token: "$semantic/secondary-low",
      tokenValue: vars.$semantic.color.secondaryLow,
      scale: "gray-alpha-50",
      usage: [
        "Secondary-low를 보조하는 색입니다.",
        "Secondary-low와의 대비를 표현하기 위한 배경이나 부가적인 디자인 요소에 사용합니다.",
      ],
    },
    {
      token: "$semantic/success",
      tokenValue: vars.$semantic.color.success,
      scale: "green-500",
      usage: [
        "‘성공(완료)’ 혹은 ‘진행중’ 의미를 전달합니다.",
        "일반적으로 과업을 완료했을 경우나 긍정적인 상황에 사용합니다.",
      ],
    },
    {
      token: "$semantic/success-low",
      tokenValue: vars.$semantic.color.successLow,
      scale: "green-50",
      usage: [
        "Success를 보조하는 색입니다.",
        "Success와의 대비를 표현하기 위한 배경이나 부가적인 디자인 요소에 사용합니다.",
      ],
    },
    {
      token: "$semantic/accent",
      tokenValue: vars.$semantic.color.accent,
      scale: "blue-500",
      usage: [
        "특정 요소나 정보를 강조합니다.",
        "Primary와 Secondary보다 낮은 계층이며, 주로 작은 요소에 제한적으로 사용합니다.",
      ],
    },
    {
      token: "$semantic/warning",
      tokenValue: vars.$semantic.color.warning,
      scale: "yellow-300",
      usage: [
        "‘주의' 혹은 ‘경고' 의 의미를 전달합니다.",
        "텍스트로 쓰기엔 접근성이 낮으며, 일반적으로 Fill color 사용을 권장합니다.",
      ],
    },
    {
      token: "$semantic/warning-low",
      tokenValue: vars.$semantic.color.warningLow,
      scale: "yellow-50",
      usage: [
        "Warning를 보조하는 색입니다.",
        "Warning와의 대비를 표현하기 위한 배경이나 부가적인 디자인 요소에 사용합니다.",
      ],
    },
    {
      token: "$semantic/danger",
      tokenValue: vars.$semantic.color.danger,
      scale: "red-600",
      usage: [
        "유저가 꼭 알아야 하는 위험한 레벨의 경고입니다.",
        "데이터에 파괴적 변환이 있는 경우, 정책과 관련한 경고나 조치가 필요한 경우 사용합니다.",
      ],
    },
    {
      token: "$semantic/danger-low",
      tokenValue: vars.$semantic.color.dangerLow,
      scale: "red-50",
      usage: [
        "Danger를 보조하는 색입니다.",
        "Danger와의 대비를 표현하기 위한 배경이나 부가적인 디자인 요소에 사용합니다.",
      ],
    },
  ],
  paper: [
    {
      token: "$semantic/default",
      tokenValue: vars.$semantic.color.paperDefault,
      scale: "gray-00",
      usage: ["가장 기본이되는 배경 컬러 토큰입니다."],
    },
    {
      token: "$semantic/background",
      tokenValue: vars.$semantic.color.paperBackground,
      scale: "gray-100",
      usage: ["Paper-default 보다 아래 계층에 위치하는 토큰입니다."],
    },
    {
      token: "$semantic/sheet",
      tokenValue: vars.$semantic.color.paperSheet,
      scale: "gray-00",
      usage: [
        "Overlay 위에 위치하는 레이어 토큰입니다.",
        "주로 Bottom Sheet나 Action Sheet와 같은 Overlay 컴포넌트의 배경으로 사용합니다.",
      ],
    },
    {
      token: "$semantic/floating",
      tokenValue: vars.$semantic.color.paperFloating,
      scale: "gray-00",
      usage: [
        "Overlay 위에 위치하는 Floating 컴포넌트의 배경으로 사용하는 토큰입니다.",
        "주로 FAB 컴포넌트의 배경으로 사용합니다.",
      ],
    },
    {
      token: "$semantic/dialog",
      tokenValue: vars.$semantic.color.paperDialog,
      scale: "gray-00",
      usage: ["Alert Dialog 컴포넌트의 배경으로 사용하는 토큰입니다."],
    },
    {
      token: "$semantic/contents",
      tokenValue: vars.$semantic.color.paperContents,
      scale: "gray-50",
      usage: [
        "화면상의 정보나 디자인 요소들을 그룹핑하여 사용하는 토큰입니다.",
      ],
    },
    {
      token: "$semantic/accent",
      tokenValue: vars.$semantic.color.paperAccent,
      scale: "carrot-50",
      usage: [
        "특정 영역이나 Cell을 강조하는 경우 사용하는 토큰입니다.",
        "주로 알림함의 새로운 알림을 일시적으로 강조하기 위해 사용합니다.",
      ],
    },
  ],
  status: [
    {
      token: "$semantic/primary-hover",
      tokenValue: vars.$semantic.color.primaryHover,
      scale: "carrot-400",
      usage: ["Primary 토큰의 hover 상태를 표현하는 데 사용합니다."],
    },
    {
      token: "$semantic/primary-pressed",
      tokenValue: vars.$semantic.color.primaryPressed,
      scale: "carrot-400",
      usage: ["Primary 토큰의 pressed 상태를 표현하는 데 사용합니다."],
    },
    {
      token: "$semantic/primary-low-hover",
      tokenValue: vars.$semantic.color.primaryLowHover,
      scale: "carrot-100",
      usage: ["Primary-low 토큰의 hover 상태를 표현하는 데 사용합니다."],
    },
    {
      token: "$semantic/primary-low-active",
      tokenValue: vars.$semantic.color.primaryLowActive,
      scale: "carrot-100",
      usage: ["Primary-low 토큰의 active 상태를 표현하는 데 사용합니다."],
    },
    {
      token: "$semantic/primary-low-pressed",
      tokenValue: vars.$semantic.color.primaryLowPressed,
      scale: "carrot-100",
      usage: ["Primary-low 토큰의 pressed 상태를 표현하는 데 사용합니다."],
    },
    {
      token: "$semantic/gray-hover",
      tokenValue: vars.$semantic.color.grayHover,
      scale: "gray-100",
      usage: ["gray-00을 참조하는 토큰의 hover 상태를 표현하는 데 사용합니다."],
    },
    {
      token: "$semantic/gray-pressed",
      tokenValue: vars.$semantic.color.grayPressed,
      scale: "gray-100",
      usage: [
        "gray-00을 참조하는 토큰의 pressed 상태를 표현하는 데 사용합니다.",
      ],
    },
  ],
  divider: [
    {
      token: "$semantic/divider-1",
      tokenValue: vars.$semantic.color.divider1,
      scale: "gray-alpha-50",
      usage: [
        "투명도가 있어, 썸네일을 감싸는 Border나 콘텐츠 간 약한 구분을 위해 사용합니다.",
      ],
    },
    {
      token: "$semantic/divider-2",
      tokenValue: vars.$semantic.color.divider2,
      scale: "gray-200",
      usage: ["가장 기본이되는 Divider 컬러 토큰입니다."],
    },
    {
      token: "$semantic/divider-3",
      tokenValue: vars.$semantic.color.divider3,
      scale: "gray-300",
      usage: [
        "컨텐츠 간 강한 구분 혹은 디자인 요소를 강조해야 하는 경우 Border로 사용합니다.",
      ],
    },
  ],
  overlay: [
    {
      token: "$semantic/overlay-dim",
      tokenValue: vars.$semantic.color.overlayDim,
      scale: "gray-alpha-300",
      usage: [
        "가장 기본이되는 Overlay 컬러 토큰입니다.",
        "주로 Bottom Sheet나 Alert Dialog와 같이 컴포넌트의 주목도가 높은 경우 사용합니다.",
      ],
    },
    {
      token: "$semantic/overlay-low",
      tokenValue: vars.$semantic.color.overlayLow,
      scale: "gray-alpha-200",
      usage: [
        "Overlay-dim 보다 약하게 화면을 막는 경우 사용합니다.",
        "주로 Dropdown이나 FAB 같은 작은 요소와 함께 쓰이며, Bottom Sheet 위에 중첩되어 올라가는 경우에도 사용합니다.",
      ],
    },
  ],
};

// red-100 -> red100
// gray-alpha-50 -> grayAlpha50
// gray-00 -> gray00
// gray-100 -> gray100
function changeToCamelCase(str: string) {
  return str
    .split("-")
    .map((word, index) => {
      if (typeof word === "number") return String(word);
      if (index === 0) return word;
      return word[0].toUpperCase() + word.slice(1);
    })
    .join("");
}

const SemanticColorTable = ({
  semanticColors,
}: {
  semanticColors: SemanticColor[];
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableData>Token</TableData>
          <TableData>Scale</TableData>
          <TableData>Usage</TableData>
        </TableRow>
      </TableHead>
      <TableBody>
        {semanticColors.map((color) => (
          <TableRow key={color.token}>
            <TableData>
              <div className={style.tokenTableDataContent}>
                <div
                  style={{ backgroundColor: color.tokenValue }}
                  className={style.tokenTableDataColorPreview}
                />
                <code className={style.tokenTableDataColorText}>
                  {color.token}
                </code>
              </div>
            </TableData>
            <TableData>
              <a
                className={style.scaleTableAnchor}
                href={`#${changeToCamelCase(color.scale)}`}
              >
                {color.scale}
              </a>
            </TableData>
            <TableData className={style.tokenTableDataUsage}>
              {color.usage.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </TableData>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

function getScalePalette(target: string, colorObject: [string, string][]) {
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

const ScaleColorContainer = ({ palette }: { palette: [string, string][] }) => {
  const { computedStyle, hash } = useColorPaletteState();

  return (
    <div className={style.scaleColorContainer}>
      {palette.map(([key, value], index) => {
        const colorNumber = Number(key.replace(/[a-zA-Z]/g, ""));
        const hashValue = computedStyle?.getPropertyValue(
          value.replace("var(", "").replace(")", ""),
        );

        return (
          <>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.025, ease: "easeOut" }}
              className={style.scaleColorBox}
              style={{ backgroundColor: value }}
              key={value}
              id={key}
            >
              {key === hash && (
                <>
                  <motion.div
                    className={style.scaleColorFocusRing}
                    initial={{ opacity: 0, scale: 1.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ease: "easeOut" }}
                  />
                  <motion.div
                    className={style.scaleColorFocusRing}
                    initial={{ opacity: 0, scale: 1.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05, ease: "easeOut" }}
                  />
                  <motion.div
                    className={style.scaleColorFocusRing}
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, ease: "easeOut" }}
                  />
                </>
              )}
              <div
                className={style.colorDescription({
                  inversion: colorNumber >= 500,
                })}
              >
                <span>{key}</span>
                <span>{hashValue}</span>
              </div>
            </motion.div>
          </>
        );
      })}
    </div>
  );
};

const ColorPalettePage = () => {
  const colorObject = Object.entries(vars.$scale.color);
  const colorPalette = useMemo(() => {
    return {
      gray: getScalePalette("gray", colorObject),
      carrot: getScalePalette("carrot", colorObject),
      blue: getScalePalette("blue", colorObject),
      red: getScalePalette("red", colorObject),
      green: getScalePalette("green", colorObject),
      yellow: getScalePalette("yellow", colorObject),
      pink: getScalePalette("pink", colorObject),
      purple: getScalePalette("purple", colorObject),
      grayAlpha: getScalePalette("grayAlpha", colorObject),
      carrotAlpha: getScalePalette("carrotAlpha", colorObject),
      blueAlpha: getScalePalette("blueAlpha", colorObject),
      redAlpha: getScalePalette("redAlpha", colorObject),
      yellowAlpha: getScalePalette("yellowAlpha", colorObject),
      greenAlpha: getScalePalette("greenAlpha", colorObject),
    };
  }, []);

  return (
    <ColorPaletteProvider>
      <article className={t.content}>
        <FoundationColorDocumentHeader currentPath="palette" />

        <div className={style.titleContainer}>
          <h2 className={style.heading2}>Scale Token</h2>
          <p className={style.p1}>
            Scale Token은 프로덕트의 일관된 색상 체계를 정의하는 표준화된 컬러
            토큰입니다.
          </p>
          <p className={style.p1}>
            특별한 시맨틱한 성격이나 맥락을 갖고있지 않은 경우에 사용하며, 그
            어떤 경우에도 Scale Token을 사용할 수 있습니다.
          </p>
        </div>

        <div className={style.container}>
          <div>
            <h2 className={style.heading3}>Solid</h2>
            <p className={style.p2}>
              완전한 불투명한 색상으로, 투명도가 없는 색상입니다. Solid 컬러는
              HEX 값으로 정의합니다.
            </p>
          </div>
          <ScaleColorContainer palette={colorPalette.gray} />
          <ScaleColorContainer palette={colorPalette.carrot} />
          <ScaleColorContainer palette={colorPalette.blue} />
          <ScaleColorContainer palette={colorPalette.red} />
          <ScaleColorContainer palette={colorPalette.green} />
          <ScaleColorContainer palette={colorPalette.yellow} />
          <ScaleColorContainer palette={colorPalette.pink} />
          <ScaleColorContainer palette={colorPalette.purple} />
        </div>

        <div className={style.container}>
          <div>
            <h2 className={style.heading3}>Alpha</h2>
            <p className={style.p2}>
              투명도를 가진 색상으로, 컬러의 투명도를 조절하여 주로 배경이나
              다른 요소들과의 조합에 사용됩니다.
            </p>
          </div>
          <ScaleColorContainer palette={colorPalette.grayAlpha} />
          <ScaleColorContainer palette={colorPalette.carrotAlpha} />
          <ScaleColorContainer palette={colorPalette.blueAlpha} />
          <ScaleColorContainer palette={colorPalette.redAlpha} />
          <ScaleColorContainer palette={colorPalette.yellowAlpha} />
          <ScaleColorContainer palette={colorPalette.greenAlpha} />
        </div>

        <div className={style.titleContainer}>
          <h2 className={style.heading2}>Semantic Token</h2>
          <p className={style.p1}>
            시맨틱 토큰은 UI와 컬러가 전달하고자 하는 의도와 맥락을 담고
            있습니다.
          </p>
        </div>

        <div className={style.container}>
          <div>
            <h2 className={style.heading3}>Informative</h2>
            <p className={style.p2}>
              유저에게 정보를 전달하거나 의미를 부여하는 컬러 시스템입니다.
              정보의 중요도를 나타낼 수 있으며, 특정 작업이 진행중인지,
              완료되었는지, 혹은 오류가 발생했는지 등을 나타낼 때 사용됩니다.
            </p>
          </div>
          <SemanticColorTable semanticColors={SEMANTIC_COLORS.informative} />
        </div>

        <div className={style.container}>
          <div>
            <h2 className={style.heading3}>Paper (Background)</h2>
            <p className={style.p2}>
              컨텐츠와 정보들을 감싸고있는 Background 컬러입니다. Z축의 가장
              하위에 위치합니다.
            </p>
          </div>
          <SemanticColorTable semanticColors={SEMANTIC_COLORS.paper} />
        </div>

        <div className={style.container}>
          <div>
            <h2 className={style.heading3}>Status</h2>
            <p className={style.p2}>
              상호작용에 따른 UI 요소의 상태를 표현합니다.
            </p>
          </div>
          <SemanticColorTable semanticColors={SEMANTIC_COLORS.status} />
        </div>

        <div className={style.container}>
          <div>
            <h2 className={style.heading3}>Divider</h2>
            <p className={style.p2}>
              주로 섹션이나 항목 간에 구분을 위해 활용되거나, 디자인 요소를
              감싸는 Border에 사용합니다. 시각적으로 콘텐츠를 분리하는 데 도움을
              줍니다.
            </p>
          </div>
          <SemanticColorTable semanticColors={SEMANTIC_COLORS.divider} />
        </div>

        <div className={style.container}>
          <div>
            <h2 className={style.heading3}>Overlay</h2>
            <p className={style.p2}>
              모달 성격을 가진 컴포넌트를 사용할 때 화면 전체를 덮기 위해
              사용합니다. 컴포넌트에 강한 주목도가 필요한 경우 사용합니다.
            </p>
          </div>
          <SemanticColorTable semanticColors={SEMANTIC_COLORS.overlay} />
        </div>
      </article>
    </ColorPaletteProvider>
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
