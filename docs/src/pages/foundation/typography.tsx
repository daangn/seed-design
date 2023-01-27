import { classNames } from "@seed-design/design-token";
import clsx from "clsx";
import type { HeadFC } from "gatsby";
import type { CSSProperties } from "react";
import { useState } from "react";

import SEO from "../../components/SEO";
import * as style from "../../styles/page-styles/typography.page.css";
import * as t from "../../styles/token.css";

const FONT_SIZE = {
  10: {
    name: "$scale.dimension.font-size-10",
    value: "10px",
  },
  25: {
    name: "$scale.dimension.font-size-25",
    value: "11px",
  },
  50: {
    name: "$scale.dimension.font-size-50",
    value: "12px",
  },
  75: {
    name: "$scale.dimension.font-size-75",
    value: "13px",
  },
  100: {
    name: "$scale.dimension.font-size-100",
    value: "14px",
  },
  150: {
    name: "$scale.dimension.font-size-150",
    value: "15px",
  },
  200: {
    name: "$scale.dimension.font-size-200",
    value: "16px",
  },
  300: {
    name: "$scale.dimension.font-size-300",
    value: "18px",
  },
  400: {
    name: "$scale.dimension.font-size-400",
    value: "20px",
  },
  500: {
    name: "$scale.dimension.font-size-500",
    value: "24px",
  },
  600: {
    name: "$scale.dimension.font-size-600",
    value: "26px",
  },
  700: {
    name: "$scale.dimension.font-size-700",
    value: "32px",
  },
  800: {
    name: "$scale.dimension.font-size-800",
    value: "34px",
  },
  900: {
    name: "$scale.dimension.font-size-900",
    value: "42px",
  },
  1000: {
    name: "$scale.dimension.font-size-1000",
    value: "48px",
  },
  1100: {
    name: "$scale.dimension.font-size-1100",
    value: "54px",
  },
  1200: {
    name: "$scale.dimension.font-size-1200",
    value: "60px",
  },
  1300: {
    name: "$scale.dimension.font-size-1300",
    value: "72px",
  },
};
const FONT_WEIGHT = {
  regular: {
    name: "$static.font-weight.regular",
    value: "regular",
  },
  bold: {
    name: "$static.font-weight.bold",
    value: "bold",
  },
};
const LINE_HEIGHT = {
  small: {
    name: "$static.line-height.static-small",
    value: "135%",
  },
  medium: {
    name: "$static.line-height.static-medium",
    value: "150%",
  },
  large: {
    name: "$static.line-height.static-large",
    value: "162%",
  },
};
const LETTER_SPACING = {
  none: {
    name: "$scale.letter-spacing.none",
    value: "0",
  },
  200: {
    name: "$scale.letter-spacing.narrow-200",
    value: "-0.02em",
  },
  300: {
    name: "$scale.letter-spacing.narrow-300",
    value: "-0.03em",
  },
  400: {
    name: "$scale.letter-spacing.narrow-400",
    value: "-0.04em",
  },
};

type Typography = keyof typeof classNames.$semantic.typography;
interface TypoDescriptionProps {
  typography: Typography;
  fontSize: keyof typeof FONT_SIZE;
  fontWeight: keyof typeof FONT_WEIGHT;
  lineHeight: keyof typeof LINE_HEIGHT;
  letterSpacing: keyof typeof LETTER_SPACING;
}

const TextArea = ({ typography }: { typography: Typography }) => {
  const [value, setValue] = useState(
    "당신 근처의 당근마켓 가깝고 \n따듯한 당신의 근처를 만들어요.",
  );
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  return (
    <textarea
      rows={2}
      spellCheck={false}
      className={clsx(
        classNames.$semantic.typography[typography],
        style.textArea,
      )}
      value={value}
      onChange={handleChange}
    />
  );
};

const SemanticTypoGraphy = ({
  typography,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
}: TypoDescriptionProps) => {
  return (
    <div className={style.typographyContainer}>
      <div className={style.textContainer}>
        <p className={style.textLabel}>$semantic.typography.{typography}</p>
        <div className={style.descriptionContainer}>
          <p className={style.descriptionItemTitle}>Font Size</p>
          <p className={style.descriptionItemName}>
            {FONT_SIZE[fontSize].name}
          </p>
          <p className={style.descriptionItemValue}>
            {FONT_SIZE[fontSize].value}
          </p>
        </div>
        <div className={style.descriptionContainer}>
          <p className={style.descriptionItemTitle}>Font Weight</p>
          <p className={style.descriptionItemName}>
            {FONT_WEIGHT[fontWeight].name}
          </p>
          <p className={style.descriptionItemValue}>
            {FONT_WEIGHT[fontWeight].value}
          </p>
        </div>
        <div className={style.descriptionContainer}>
          <p className={style.descriptionItemTitle}>Line Height</p>
          <p className={style.descriptionItemName}>
            {LINE_HEIGHT[lineHeight].name}
          </p>
          <p className={style.descriptionItemValue}>
            {LINE_HEIGHT[lineHeight].value}
          </p>
        </div>
        <div className={style.descriptionContainer}>
          <p className={style.descriptionItemTitle}>Letter Spacing</p>
          <p className={style.descriptionItemName}>
            {LETTER_SPACING[letterSpacing].name}
          </p>
          <p className={style.descriptionItemValue}>
            {LETTER_SPACING[letterSpacing].value}
          </p>
        </div>
      </div>
      <TextArea typography={typography} />
    </div>
  );
};

const ScaleTypography = ({
  name,
  value,
  inputInitValue,
  customStyle,
  rows = 1,
}: {
  name: string;
  value: string;
  inputInitValue: string;
  customStyle: CSSProperties;
  rows?: number;
}) => {
  const [inputValue, setInputValue] = useState(inputInitValue);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={style.scaleTokenContainer}>
      <p className={style.scaleTokenName}>{name}</p>
      <p className={style.scaleTokenValue}>{value}</p>
      <textarea
        rows={rows}
        spellCheck={false}
        className={clsx(style.textArea)}
        style={customStyle}
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
};

const FoundationTypographyPage = () => {
  return (
    <article className={t.content}>
      <h1 className={style.heading1}>Semantic Typography Token</h1>

      <h2 className={style.heading2}>Heading</h2>
      <p className={style.documentCaption1}>
        대제목(표제)의 역할을 해요. 사용자에게 다른 폰트들보다 크게 보여요.
      </p>
      <SemanticTypoGraphy
        typography="h1"
        fontSize={1000}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing="none"
      />
      <SemanticTypoGraphy
        typography="h2"
        fontSize={900}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing="none"
      />
      <SemanticTypoGraphy
        typography="h3"
        fontSize={800}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing="none"
      />
      <SemanticTypoGraphy
        typography="h4"
        fontSize={700}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing="none"
      />

      <h2 className={style.heading2}>Title</h2>
      <p className={style.documentCaption1}>
        하위 항목의 제목의 역할을 해요, 주로 하나의 섹션, 챕터를 나타내요.
      </p>
      <SemanticTypoGraphy
        typography="title1Regular"
        fontSize={500}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing="none"
      />
      <SemanticTypoGraphy
        typography="title1Bold"
        fontSize={500}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing="none"
      />
      <SemanticTypoGraphy
        typography="title2Regular"
        fontSize={400}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing="none"
      />
      <SemanticTypoGraphy
        typography="title2Bold"
        fontSize={400}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing="none"
      />
      <SemanticTypoGraphy
        typography="title3Regular"
        fontSize={300}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing="none"
      />
      <SemanticTypoGraphy
        typography="title3Bold"
        fontSize={300}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing="none"
      />

      <h2 className={style.heading2}>Subtitle</h2>
      <p className={style.documentCaption1}>
        부가제목을 표기하고, Title의 보조 역할을 할 수 있어요.
      </p>
      <SemanticTypoGraphy
        typography="subtitle1Regular"
        fontSize={200}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="subtitle1Bold"
        fontSize={200}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="subtitle2Regular"
        fontSize={100}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="subtitle2Bold"
        fontSize={100}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing={200}
      />

      <h2 className={style.heading2}>Body-L</h2>
      <p className={style.documentCaption1}>넓은 행간값을 가지고 있어요.</p>
      <p className={style.documentCaption1}>
        본문의 모든 내용과 정보를 포함하여 전달해야 하는 글에 사용해요.
      </p>
      <p className={style.documentCaption1}>
        요약되지 않은 장문의 글일 경우에 사용하는 게 가장 좋아요.
      </p>
      <SemanticTypoGraphy
        typography="bodyL1Regular"
        fontSize={200}
        fontWeight="regular"
        lineHeight="large"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="bodyL1Bold"
        fontSize={200}
        fontWeight="bold"
        lineHeight="large"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="bodyL2Regular"
        fontSize={100}
        fontWeight="regular"
        lineHeight="medium"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="bodyL2Bold"
        fontSize={100}
        fontWeight="bold"
        lineHeight="medium"
        letterSpacing={200}
      />

      <h2 className={style.heading2}>Body-M</h2>
      <p className={style.documentCaption1}>본문의 간단한 내용을 나타내요. </p>
      <p className={style.documentCaption1}>
        요약된 정보거나, 요약해서 전달할 수 있는 정보 글에 사용할 수 있어요.
      </p>
      <SemanticTypoGraphy
        typography="bodyM1Regular"
        fontSize={200}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="bodyM1Bold"
        fontSize={200}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="bodyM2Regular"
        fontSize={100}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="bodyM2Bold"
        fontSize={100}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing={200}
      />

      <h2 className={style.heading2}>Caption</h2>
      <p className={style.documentCaption1}>
        부가설명을 위한 작은 텍스트를 표기할 때 사용해요.
      </p>
      <SemanticTypoGraphy
        typography="caption1Regular"
        fontSize={75}
        fontWeight="regular"
        lineHeight="medium"
        letterSpacing={400}
      />
      <SemanticTypoGraphy
        typography="caption1Bold"
        fontSize={75}
        fontWeight="bold"
        lineHeight="medium"
        letterSpacing={400}
      />
      <SemanticTypoGraphy
        typography="caption2Regular"
        fontSize={50}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing={400}
      />
      <SemanticTypoGraphy
        typography="caption2Bold"
        fontSize={50}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing={400}
      />

      <h2 className={style.heading2}>Label</h2>
      <p className={style.documentCaption1}>
        Button, Chip, Tag같은 UI에서 범용적으로 사용해요.
      </p>
      <p className={style.documentCaption1}>
        ~을 붙이다는 의미를 가지고 사용자가 확인해야는 정보의 구분을 위한
        키워드를 제공하거나 분류할 수 있도록 하는 역할을 해요.
      </p>
      <SemanticTypoGraphy
        typography="label1Regular"
        fontSize={300}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="label1Bold"
        fontSize={300}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="label2Regular"
        fontSize={200}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="label2Bold"
        fontSize={200}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="label3Regular"
        fontSize={100}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="label3Bold"
        fontSize={100}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="label4Regular"
        fontSize={50}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="label4Bold"
        fontSize={50}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="label5Regular"
        fontSize={25}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="label5Bold"
        fontSize={25}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing={200}
      />
      <SemanticTypoGraphy
        typography="label6Regular"
        fontSize={10}
        fontWeight="regular"
        lineHeight="small"
        letterSpacing="none"
      />
      <SemanticTypoGraphy
        typography="label6Bold"
        fontSize={10}
        fontWeight="bold"
        lineHeight="small"
        letterSpacing="none"
      />

      <h1 className={style.heading1WithMargin}>Scale Typography Token</h1>
      <h2 className={style.heading2}>Font Size</h2>
      {Object.entries(FONT_SIZE).map(([key, { name, value }]) => {
        return (
          <ScaleTypography
            key={key}
            name={name}
            value={value}
            inputInitValue="안녕, 세상아"
            customStyle={{ fontSize: value }}
          />
        );
      })}
      <h2 className={style.heading2}>Font Weight</h2>
      {Object.entries(FONT_WEIGHT).map(([key, { name, value }]) => {
        return (
          <ScaleTypography
            key={key}
            name={name}
            value={value}
            inputInitValue="안녕, 세상아"
            customStyle={{ fontSize: "25px", fontWeight: value }}
          />
        );
      })}
      <h2 className={style.heading2}>Line Height</h2>
      {Object.entries(LINE_HEIGHT).map(([key, { name, value }]) => {
        return (
          <ScaleTypography
            key={key}
            name={name}
            value={value}
            rows={2}
            inputInitValue={"안녕, \n세상아"}
            customStyle={{ fontSize: "25px", lineHeight: value }}
          />
        );
      })}
      <h2 className={style.heading2}>Letter Spacing</h2>
      {Object.entries(LETTER_SPACING).map(([key, { name, value }]) => {
        return (
          <ScaleTypography
            key={key}
            name={name}
            value={value}
            inputInitValue={"안녕, 세상아"}
            customStyle={{ fontSize: "25px", letterSpacing: value }}
          />
        );
      })}
    </article>
  );
};

// TODO:
export const Head: HeadFC = () => {
  return (
    <SEO
      name={`Typography`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};

export default FoundationTypographyPage;
