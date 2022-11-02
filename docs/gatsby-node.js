const path = require("path");

const componentsContentTemplate = path.resolve(
  `./src/templates/ComponentsContentTemplate.tsx`,
);
const overviewContentTemplate = path.resolve(
  `./src/templates/OverviewContentTemplate.tsx`,
);

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    query {
      ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
        gatsbyImageData(layout: FIXED)
      }

      overviews: allMdx(
        filter: { internal: { contentFilePath: { regex: "/overview/" } } }
      ) {
        edges {
          node {
            internal {
              contentFilePath
            }
            frontmatter {
              slug
              title
              description
            }
            tableOfContents
          }
        }
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

  result.data.overviews.edges.forEach(({ node }) => {
    const { slug, title, description } = node.frontmatter;
    const { contentFilePath } = node.internal;

    createPage({
      path: slug,
      component: `${overviewContentTemplate}?__contentFilePath=${contentFilePath}`,
      context: {
        slug,
        title,
        description,
        ogImage,
        tableOfContents: node.tableOfContents,
      },
    });
  });

  result.data.components.nodes.forEach((node) => {
    createPage({
      path: node.frontmatter.slug,
      component: `${componentsContentTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
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
