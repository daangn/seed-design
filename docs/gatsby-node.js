const path = require("path");

const DocsTemplate = path.resolve(`./src/templates/docs.tsx`);

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

      components: allMdx(
        filter: { frontmatter: { slug: { regex: "/(?=.*/components)/" } } }
      ) {
        nodes {
          ...MdxContent
        }
      }
    }
  `);

  const ogImage = result.data.ogImage.gatsbyImageData;

  // NOTE: component-guideline-usage, component-spec-primitive, component-spec-style, etc...
  const components = result.data.components.nodes;

  components.forEach((component) => {
    createPage({
      path: component.frontmatter.slug,
      component: `${DocsTemplate}?__contentFilePath=${component.internal.contentFilePath}`,
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
