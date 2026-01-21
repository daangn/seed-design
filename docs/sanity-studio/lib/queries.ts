export const BLOG_QUERY = `*[_type == "blog"] {
  title,
  description,
  thumbnail,
  slug,
  publishedAt,
}`;

export const SINGLE_BLOG_QUERY = `*[_type == "blog" && slug.current == $slug][0] {
  title,
  description,
  thumbnail,
  slug,
  publishedAt,
  content,
  "toc": content[style in ["h1", "h2", "h3"]]
}`;

export const GUIDELINE_QUERY = `*[_type == "guideline" && path == $path][0] {
  title,
  content,
  publishedAt,
  "toc": content[style in ["h1", "h2", "h3"]]
}`;

export const COMPONENT_QUERY = `*[_type == "component" && id == $id][0] {
  id,
  name,
  deprecated,
  deprecatedMessage,
  iosStatus,
  iosUrl,
  iosNote,
  androidStatus,
  androidUrl,
  androidNote,
  reactStatus,
  reactUrl,
  reactNote,
  figmaStatus,
  figmaUrl,
  figmaNote,
}`;

export const ALL_COMPONENTS_QUERY = `*[_type == "component"] | order(name asc) {
  id,
  name,
  deprecated,
  deprecatedMessage,
  iosStatus,
  iosUrl,
  iosNote,
  androidStatus,
  androidUrl,
  androidNote,
  reactStatus,
  reactUrl,
  reactNote,
  figmaStatus,
  figmaUrl,
  figmaNote,
}`;
