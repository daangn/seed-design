import { vars } from "@seed-design/design-token";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import PageLayout from "../../components/PageLayout";
import * as style from "../../styles/page-styles/color.page.css";

export const query = graphql`
  query FoundationColorPage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const ColorItem = ({ name, color }: { name: string; color: string }) => {
  return (
    <li className={style.listItem}>
      <span className={style.listItemText}>{name}</span>
      <div
        className={style.listItemBox}
        style={{
          backgroundColor: color,
        }}
      />
    </li>
  );
};

const FoundationColorPage = () => {
  return (
    <PageLayout>
      <h1 className={style.heading1}>Color</h1>

      <h2 className={style.heading2}>Scale Color</h2>
      <ul className={style.list}>
        {Object.entries(vars.$scale.color).map(([name, color]) => (
          <ColorItem key={name} name={name} color={color} />
        ))}
      </ul>

      <h2 className={style.heading2}>Semantic Color</h2>
      <ul className={style.list}>
        {Object.entries(vars.$semantic.color).map(([name, color]) => (
          <ColorItem key={name} name={name} color={color} />
        ))}
      </ul>

      <h2 className={style.heading2}>Static Color</h2>
      <ul className={style.list}>
        {Object.entries(vars.$static.color).map(([name, color]) => (
          <ColorItem key={name} name={name} color={color} />
        ))}
      </ul>
    </PageLayout>
  );
};

// TODO:
export const Head: HeadFC<Queries.FoundationColorPageQuery> = ({ data }) => {
  return (
    <>
      <title>Foundation - Color</title>
      <meta property="og:title" content={`Seed Design | Foundation | Color`} />
      <meta property="description" content="Color." />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default FoundationColorPage;
