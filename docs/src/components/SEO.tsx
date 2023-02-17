import { graphql, useStaticQuery } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

interface SEOProps {
  name?: string;
  description: string;
  children?: React.ReactNode;
}

const SEO = ({ name, description, children }: SEOProps) => {
  const data = useStaticQuery<GatsbyTypes.SEOQuery>(graphql`
    query SEO {
      ogImage: imageSharp(original: { src: { regex: "/ogimage/" } }) {
        gatsbyImageData(layout: FIXED)
      }
    }
  `);

  const nameWithPrefix = name ? `${name} | ` : "";

  return (
    <>
      <title>{nameWithPrefix}SEED Design</title>
      <meta property="og:title" content={`${nameWithPrefix}SEED Design`} />
      <meta property="description" content={description} />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
      {children}
    </>
  );
};

export default SEO;
