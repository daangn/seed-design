import { graphql, useStaticQuery } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

interface SEOProps {
  name: string;
  description: string;
}

const SEO = ({ name, description }: SEOProps) => {
  const data = useStaticQuery<GatsbyTypes.SEOQuery>(graphql`
    query SEO {
      ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
        gatsbyImageData(layout: FIXED)
      }
    }
  `);

  return (
    <>
      <title>{name} | SEED Design</title>
      <meta property="og:title" content={`${name} | SEED Design`} />
      <meta property="description" content={description} />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default SEO;
