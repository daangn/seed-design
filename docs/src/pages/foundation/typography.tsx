import { classNames } from "@seed-design/design-token";
import clsx from "clsx";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import type { CSSProperties } from "react";
import { useState } from "react";

import PageLayout from "../../components/PageLayout";
import * as style from "../../styles/page-styles/typography.page.css";

export const query = graphql`
  query FoundationTypographyPage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

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
    <PageLayout>
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
    </PageLayout>
  );
};

// TODO:
export const Head: HeadFC<Queries.FoundationTypographyPageQuery> = ({
  data,
}) => {
  return (
    <>
      <title>Foundation - Typography</title>
      <meta
        property="og:title"
        content={`Seed Design | Foundation | Typography`}
      />
      <meta property="description" content="Typography." />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default FoundationTypographyPage;
