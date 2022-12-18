const path = require("path");

const PrimitiveDocsTemplate = path.resolve(
  `./src/templates/docs-primitive.tsx`,
);
const ComponentDocsTemplate = path.resolve(
  `./src/templates/docs-component.tsx`,
);

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    fragment MdxContent on Mdx {
      frontmatter {
        slug
        description
        title
      }
      id
      internal {
        contentFilePath
      }
      tableOfContents
    }

    query {
      ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
        gatsbyImageData(layout: FIXED)
      }

      component: allMdx(
        filter: { frontmatter: { slug: { regex: "/(?=.*/component)/" } } }
      ) {
        nodes {
          ...MdxContent
        }
      }

      primitive: allMdx(
        filter: { frontmatter: { slug: { regex: "/(?=.*/primitive)/" } } }
      ) {
        nodes {
          ...MdxContent
        }
      }
    }
  `);

  const ogImage = result.data.ogImage.gatsbyImageData;

  const componentNodes = result.data.component.nodes;
  const primitiveNodes = result.data.primitive.nodes;

  componentNodes.forEach((component) => {
    createPage({
      path: component.frontmatter.slug,
      component: `${ComponentDocsTemplate}?__contentFilePath=${component.internal.contentFilePath}`,
      context: {
        id: component.id,
        slug: component.frontmatter.slug,
        title: component.frontmatter.title,
        description: component.frontmatter.description,
        tableOfContents: component.tableOfContents,
        activeTab: component.frontmatter.slug,
        ogImage,
      },
    });
  });

  primitiveNodes.forEach((component) => {
    createPage({
      path: component.frontmatter.slug,
      component: `${PrimitiveDocsTemplate}?__contentFilePath=${component.internal.contentFilePath}`,
      context: {
        id: component.id,
        slug: component.frontmatter.slug,
        title: component.frontmatter.title,
        description: component.frontmatter.description,
        tableOfContents: component.tableOfContents,
        activeTab: component.frontmatter.slug,
        ogImage,
      },
    });
  });
};
