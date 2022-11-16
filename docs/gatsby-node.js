const path = require("path");

const SpecTemplate = path.resolve(`./src/templates/spec.tsx`);
const GuidelineTemplate = path.resolve(`./src/templates/guideline.tsx`);

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    query {
      ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
        gatsbyImageData(layout: FIXED)
      }

      guidelines: allMdx(
        filter: {
          frontmatter: {
            slug: { regex: "/(?=.*/components)(?=.*/guideline)/" }
          }
        }
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
      specs: allMdx(
        filter: {
          frontmatter: { slug: { regex: "/(?=.*/components)(?=.*/spec)/" } }
        }
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
  const guidelines = result.data.guidelines.nodes;
  const specs = result.data.specs.nodes;

  guidelines.forEach((guideline) => {
    createPage({
      path: guideline.frontmatter.slug,
      component: `${GuidelineTemplate}?__contentFilePath=${guideline.internal.contentFilePath}`,
      context: {
        id: guideline.id,
        slug: guideline.frontmatter.slug,
        title: guideline.frontmatter.title,
        description: guideline.frontmatter.description,
        tableOfContents: guideline.tableOfContents,
        activeTab:
          guideline.frontmatter.slug.split("/")[
            guideline.frontmatter.slug.split("/")?.length - 1
          ],
        ogImage,
      },
    });
  });

  specs.forEach((spec) => {
    createPage({
      path: spec.frontmatter.slug,
      component: `${SpecTemplate}?__contentFilePath=${spec.internal.contentFilePath}`,
      context: {
        id: spec.id,
        slug: spec.frontmatter.slug,
        title: spec.frontmatter.title,
        description: spec.frontmatter.description,
        tableOfContents: spec.tableOfContents,
        ogImage,
        activeTab:
          spec.frontmatter.slug.split("/")[
            spec.frontmatter.slug.split("/")?.length - 1
          ],
      },
    });
  });
};
