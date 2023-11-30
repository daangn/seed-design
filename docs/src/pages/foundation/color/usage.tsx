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
    informativeColor: file(
      relativePath: { eq: "foundation/color/usage/informative-color.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }

    paperColor: file(
      relativePath: { eq: "foundation/color/usage/paper-color.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }

    staticColor: file(
      relativePath: { eq: "foundation/color/usage/static-color.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }

    semanticToken1: file(
      relativePath: { eq: "foundation/color/usage/semantic-token-1.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }

    statusColorAndroid: file(
      relativePath: { eq: "foundation/color/usage/status-color-android.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }

    statusColor: file(
      relativePath: { eq: "foundation/color/usage/status-color.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`;

const ColorUsagePage = ({ data }: PageProps) => {
  return (
    <article className={t.content}>
      <FoundationColorDocumentHeader currentPath="usage" />
      <h2 className={style.heading2}>Semantic Token</h2>
      <p className={style.paragraph}>
        시맨틱 토큰은 UI와 컬러가 전달하고자 하는 의도와 맥락을 담고 있습니다.
        디자인 요소의 색상을 특정 의미나 사용 맥락에 연결하여, 사용자에게
        디자인의 목적을 명확하게 전달하는 역할을 합니다. 제품의 의도를 컬러에
        적용함으로서 일관된 사용자 경험을 강화합니다. 이는 다양한 UI의 케이스를
        일관성있는 색상체계로 사용하는 디자인-개발간의 언어 약속이므로
        가이드라인에 맞게 사용해야합니다.
      </p>

      <h3 className={style.heading3}>Informative Color</h3>
      <p className={style.paragraph}>
        유저에게 전달하는 의도와 정보가 명확하기에, 유저와의 올바른 상호작용에
        중요한 역할을 합니다. 잘못된 용례로 사용되면 유저에게 오해를 제공할
        가능성이 있으니 가이드라인을 준수합니다.
      </p>
      <GatsbyImage
        image={data.informativeColor?.childImageSharp?.gatsbyImageData!}
        alt="Informative Color"
        className={style.image}
      />

      <h3 className={style.heading3}>Paper Color</h3>
      <p className={style.paragraph}>
        컨텐츠와 정보들을 감싸고있는 Background 레이어입니다. Z축의 가장 하위에
        위치합니다.
      </p>
      <GatsbyImage
        image={data.paperColor?.childImageSharp?.gatsbyImageData!}
        alt="Paper Color"
        className={style.image}
      />

      <h3 className={style.heading3}>Status Color</h3>
      <p className={style.paragraph}>
        UI 요소의 상호작용에 따른 상태를 나타냅니다.
      </p>
      <GatsbyImage
        image={data.statusColor?.childImageSharp?.gatsbyImageData!}
        alt="Status Color"
        className={style.image}
      />

      <h3 className={style.heading3}>Static Color - Android</h3>
      <p className={style.paragraph}>
        안드로이드에서 ripple 애니메이션을 표현합니다.
      </p>
      <GatsbyImage
        image={data.statusColorAndroid?.childImageSharp?.gatsbyImageData!}
        alt="Status Color Android"
        className={style.image}
      />

      <h2 className={style.heading2}>Static Token</h2>
      <p className={style.paragraph}>
        Light, Dark 테마에 영향을 받지않으며, 테마에 관계없이 고정되는
        컬러입니다. Component 자체가 Static인 경우와, Typography를 독립적으로
        쓰는 경우가 있습니다.
      </p>
      <GatsbyImage
        image={data.staticColor?.childImageSharp?.gatsbyImageData!}
        alt="Static Color"
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
