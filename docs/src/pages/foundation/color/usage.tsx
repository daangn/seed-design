import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import { FoundationColorDocumentHeader } from "../../../components/FoundationColorDocumentHeader";
import SEO from "../../../components/SEO";
import * as style from "../../../styles/page-styles/color-usage.css";
import * as t from "../../../styles/token.css";

interface PageProps {
  data: GatsbyTypes.ColorUsagePageQuery;
}

export const query = graphql`
  query ColorUsagePage {
    lightDark1: file(
      relativePath: { eq: "foundation/color/usage/light-dark-1.png" }
    ) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }

    lightDark2: file(
      relativePath: { eq: "foundation/color/usage/light-dark-2.png" }
    ) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }

    primary1: file(
      relativePath: { eq: "foundation/color/usage/primary-1.png" }
    ) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }
    primary2: file(
      relativePath: { eq: "foundation/color/usage/primary-2.png" }
    ) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }
    primary3: file(
      relativePath: { eq: "foundation/color/usage/primary-3.png" }
    ) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }

    gray1: file(relativePath: { eq: "foundation/color/usage/gray-1.png" }) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }
    gray2: file(relativePath: { eq: "foundation/color/usage/gray-2.png" }) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }
    gray3: file(relativePath: { eq: "foundation/color/usage/gray-3.png" }) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }

    paper1: file(relativePath: { eq: "foundation/color/usage/paper-1.png" }) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }
    paper2: file(relativePath: { eq: "foundation/color/usage/paper-2.png" }) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }

    interactive1: file(
      relativePath: { eq: "foundation/color/usage/interactive-1.png" }
    ) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }
    interactive2: file(
      relativePath: { eq: "foundation/color/usage/interactive-2.png" }
    ) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }

    combining1: file(
      relativePath: { eq: "foundation/color/usage/combining-1.png" }
    ) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }
    combining2: file(
      relativePath: { eq: "foundation/color/usage/combining-2.png" }
    ) {
      childImageSharp {
        gatsbyImageData(formats: PNG, pngOptions: { quality: 100 })
      }
    }
  }
`;

const ColorUsagePage = ({ data }: PageProps) => {
  return (
    <article className={t.content}>
      {/* ---------Light/ Dark Theme-------- */}

      <FoundationColorDocumentHeader currentPath="usage" />
      <h2 className={style.heading2}>Light/ Dark Theme</h2>
      <p className={style.paragraph1}>
        모든 토큰은 라이트/다크 테마를 제공합니다. 테마가 전환되면 HEX 값은
        전환되지만 토큰 이름은 동일하게 유지됩니다. 밝은 환경과 어두운 환경 모두
        유저에게 잘 보이도록 명암 대비를 고려하여 컬러를 사용해야합니다.
      </p>
      <GatsbyImage
        image={data.lightDark1?.childImageSharp?.gatsbyImageData!}
        alt="Light Dark 1"
        className={style.image}
      />
      <GatsbyImage
        image={data.lightDark2?.childImageSharp?.gatsbyImageData!}
        alt="Light Dark 2"
        className={style.image}
      />

      {/* ---------Primary-------- */}

      <div className={style.halfCardContainer}>
        <div className={style.halfCardLeft}>
          <h2 className={style.halfCardTitle}>Primary</h2>
          <p className={style.halfCardDescription}>
            UI 전체에서 가장 중요한 정보를 전달할 때 사용하는 시맨틱 입니다.
            브랜드 아이덴티티를 담고 있으며, 주로 CTA 버튼이나 FAB와 같이 중요한
            기능을 강조하는 데 사용합니다.
          </p>
          <ul className={style.halfCardList}>
            <li>
              <span className={style.halfCardListItemTitle}>on-primary : </span>
              <span>Primary 위 올라가는 UI 요소에 사용합니다.</span>
            </li>
            <li>
              <span className={style.halfCardListItemTitle}>
                primary-low :{" "}
              </span>
              <span>
                Primary 와의 대비를 표현하기 위한 배경이나 부가적인 디자인
                요소에 사용합니다.
              </span>
            </li>
            <li>
              <span className={style.halfCardListItemTitle}>
                Primary-hover, pressed :{" "}
              </span>
              <span>상호작용 상태를 표현합니다.</span>
            </li>
          </ul>
        </div>
        <div className={style.halfCardRight}>
          <GatsbyImage
            image={data.primary1?.childImageSharp?.gatsbyImageData!}
            alt="Primary 1"
            className={style.image}
          />
        </div>
      </div>
      <GatsbyImage
        image={data.primary2?.childImageSharp?.gatsbyImageData!}
        alt="Primary 2"
        className={style.image}
      />
      <GatsbyImage
        image={data.primary3?.childImageSharp?.gatsbyImageData!}
        alt="Primary 3"
        className={style.image}
      />

      {/* ---------Gray Color-------- */}

      <h2 className={style.heading2}>Gray Color</h2>
      <p className={style.paragraph1}>
        Text, Icon 과 Fill Type 을 사용할 땐 접근성 준수를 위해 아래
        가이드라인에 맞춰 사용하기를 권장합니다.
        <br /> gray-600에서 gray-900은 컨텐츠용 컬러이며, gray-00에서 gray-100은
        Background용 컬러입니다. Disabled 컬러는 공통적으로 gray-400를
        사용합니다.
      </p>
      <GatsbyImage
        image={data.gray1?.childImageSharp?.gatsbyImageData!}
        alt="Gray 1"
        className={style.image}
      />
      <GatsbyImage
        image={data.gray2?.childImageSharp?.gatsbyImageData!}
        alt="Gray 2"
        className={style.image}
      />
      <GatsbyImage
        image={data.gray3?.childImageSharp?.gatsbyImageData!}
        alt="Gray 3"
        className={style.image}
      />

      {/* --------Paper--------- */}

      <h2 className={style.heading2}>Paper</h2>
      <p className={style.paragraph1}>
        컨텐츠와 정보들을 감싸고있는 Background 컬러입니다. Z축의 가장 하위에
        위치합니다.
      </p>
      <GatsbyImage
        image={data.paper1?.childImageSharp?.gatsbyImageData!}
        alt="Paper 1"
        className={style.image}
      />
      <GatsbyImage
        image={data.paper2?.childImageSharp?.gatsbyImageData!}
        alt="Paper 2"
        className={style.image}
      />

      {/* ---------Interactive States-------- */}

      <h2 className={style.heading2}>Interactive States</h2>
      <p className={style.paragraph1}>
        상호작용 상태에 따른 시각적 변화는 인터랙션을 직관적으로 도와 사용자
        경험 향상에 도움을 줍니다.
        <br />
        유저에게 상태에 따른 명확한 피드백을 주어, 요소들 간의 상호작용 또는
        액션에 대한 힌트를 줄 수 있습니다.
      </p>
      <GatsbyImage
        image={data.interactive1?.childImageSharp?.gatsbyImageData!}
        alt="Interactive 1"
        className={style.image}
      />
      <GatsbyImage
        image={data.interactive2?.childImageSharp?.gatsbyImageData!}
        alt="Interactive 2"
        className={style.image}
      />

      {/* ---------Combining colors-------- */}

      <h2 className={style.heading2}>Combining colors</h2>
      <p className={style.paragraph1}>
        접근성 가이드라인에 준수하여 색상을 조합해 사용합니다.
      </p>
      <GatsbyImage
        image={data.combining1?.childImageSharp?.gatsbyImageData!}
        alt="Combining 1"
        className={style.image}
      />
      <GatsbyImage
        image={data.combining2?.childImageSharp?.gatsbyImageData!}
        alt="Combining 2"
        className={style.image}
      />
    </article>
  );
};

// TODO:
export const Head: HeadFC = () => {
  return (
    <SEO
      name={`Foundation | Color | Usage`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};

export default ColorUsagePage;
