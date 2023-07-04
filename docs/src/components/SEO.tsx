import { graphql, useStaticQuery } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import { useEffect, useState } from "react";

interface SEOProps {
  name?: string;
  description: string;
}

const SEO = ({ name, description }: SEOProps) => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const data = useStaticQuery<GatsbyTypes.SEOQuery>(graphql`
    query SEO {
      ogImage: imageSharp(original: { src: { regex: "/ogimage/" } }) {
        gatsbyImageData(layout: FIXED)
      }
      blackFavicon: file(
        name: { eq: "seed_favicon_black" }
        ext: { eq: ".svg" }
      ) {
        publicURL
      }
      whiteFavicon: file(
        name: { eq: "seed_favicon_white" }
        ext: { eq: ".svg" }
      ) {
        publicURL
      }
    }
  `);

  useEffect(() => {
    const mode = document.documentElement.getAttribute("data-seed-scale-color");
    setMode(mode === "light" ? "light" : "dark");
  }, []);

  const nameWithPrefix = name ? `${name} | ` : "";

  return (
    <>
      <title>{nameWithPrefix}SEED Design</title>
      <meta property="og:title" content={`${nameWithPrefix}SEED Design`} />
      <meta property="description" content={description} />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
      {mode === "light" ? (
        <link rel="icon" href={data.blackFavicon!.publicURL!} />
      ) : (
        <link rel="icon" href={data.whiteFavicon!.publicURL!} />
      )}
    </>
  );
};

export default SEO;
