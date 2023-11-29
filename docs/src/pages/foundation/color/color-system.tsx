import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import { FoundationColorDocumentHeader } from "../../../components/FoundationColorDocumentHeader";
import SEO from "../../../components/SEO";
import * as style from "../../../styles/page-styles/color-system.css";
import * as t from "../../../styles/token.css";

interface PageProps {
  data: GatsbyTypes.ColorSystemPageQuery;
}

export const query = graphql`
  query ColorSystemPage {
    system: file(
      relativePath: { eq: "foundation/color/color-system/system.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }

    scaleToken1: file(
      relativePath: { eq: "foundation/color/color-system/scale-token-1.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }

    scaleToken2: file(
      relativePath: { eq: "foundation/color/color-system/scale-token-2.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }

    semanticToken1: file(
      relativePath: { eq: "foundation/color/color-system/semantic-token-1.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }

    semanticToken2: file(
      relativePath: { eq: "foundation/color/color-system/semantic-token-2.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }

    staticToken1: file(
      relativePath: { eq: "foundation/color/color-system/static-token-1.png" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`;

const ColorSystemPage = ({ data }: PageProps) => {
  return (
    <article className={t.content}>
      <FoundationColorDocumentHeader currentPath="color-system" />
      <h2 className={style.heading2}>SEED Color System</h2>
      <p className={style.paragraph}>
        SEED Color는 토큰 시스템을 사용합니다. 토큰은 컬러 시스템을 효과적으로
        관리하고 활용할 수 있게하는 핵심 요소입니다. 토큰 시스템은 일관된 색상
        팔레트를 정의하고, 이를 프로덕트에 적용함으로서 시각적 일관성을
        확립합니다. 또한 공통된 토큰 언어를 사용해 디자이너, 개발자 간의 협업과
        커뮤니케이션이 원활히 이루어질 수 있도록 합니다.
      </p>

      <GatsbyImage
        image={data.system?.childImageSharp?.gatsbyImageData!}
        alt="SEED Color System"
        className={style.image}
      />

      <h2 className={style.heading2}>Scale Token</h2>
      <p className={style.paragraph}>
        Scale Token은 프로덕트의 일관된 색상 체계를 정의하는 표준화된 컬러
        토큰입니다. 특별한 시맨틱한 성격이나 맥락을 갖고있지 않은 경우에
        사용하며, 그 어떤 경우에도 Scale Token을 사용할 수 있습니다.
      </p>

      <GatsbyImage
        image={data.scaleToken1?.childImageSharp?.gatsbyImageData!}
        alt="Scale Token 1"
        className={style.image}
      />

      <GatsbyImage
        image={data.scaleToken2?.childImageSharp?.gatsbyImageData!}
        alt="Scale Token 2"
        className={style.image}
      />

      <h2 className={style.heading2}>Semantic Token</h2>
      <p className={style.paragraph}>
        시맨틱 토큰은 UI와 컬러가 전달하고자 하는 의도와 맥락을 담고 있습니다.
        디자인 요소의 색상을 특정 의미나 사용 맥락에 연결하여, 사용자에게
        디자인의 목적을 명확하게 전달하는 역할을 합니다. 제품의 의도를 컬러에
        적용함으로서 일관된 사용자 경험을 강화합니다. 이는 다양한 UI의 케이스를
        일관성있는 색상체계로 사용하는 디자인-개발간의 언어 약속이므로
        가이드라인에 맞게 사용해야합니다.
      </p>

      <GatsbyImage
        image={data.semanticToken1?.childImageSharp?.gatsbyImageData!}
        alt="Semantic Token 1"
        className={style.image}
      />

      <GatsbyImage
        image={data.semanticToken2?.childImageSharp?.gatsbyImageData!}
        alt="Semantic Token 2"
        className={style.image}
      />

      <h2 className={style.heading2}>Static Token</h2>
      <p className={style.paragraph}>
        라이트, 다크 테마에 영향을 받지않으며, 항상 raw값을 유지하는 컬러입니다.
        주로 Overlay 위에 올라가는 요소에 사용됩니다.
      </p>

      <GatsbyImage
        image={data.staticToken1?.childImageSharp?.gatsbyImageData!}
        alt="Static Token 1"
        className={style.image}
      />
    </article>
  );
};

// TODO:
export const Head: HeadFC = () => {
  return (
    <SEO
      name={`Foundation | Color | Color System`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};

export default ColorSystemPage;
