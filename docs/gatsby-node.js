const path = require("path");

const ComponentTemplate = path.resolve(`./src/templates/component.tsx`);

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    query {
      ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
        gatsbyImageData(layout: FIXED)
      }

      components: allMdx(
        filter: { frontmatter: { slug: { regex: "/components/" } } }
      ) {
        nodes {
          id
          internal {
            contentFilePath
          }
          frontmatter {
            slug
            description
            title
          }
          tableOfContents
        }
      }
    }
  `);

  const ogImage = result.data.ogImage.gatsbyImageData;

  result.data.components.nodes.forEach((node) => {
    createPage({
      path: node.frontmatter.slug,
      component: `${ComponentTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id,
        slug: node.frontmatter.slug,
        title: node.frontmatter.title,
        description: node.frontmatter.description,
        tableOfContents: node.tableOfContents,
        ogImage,
        activeTab:
          node.frontmatter.slug.split("/")[
            node.frontmatter.slug.split("/")?.length - 1
          ],
      },
    });
  });
};
