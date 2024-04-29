
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/zum/Desktop/editor-blog/.cache/dev-404-page.js")),
  "component---src-pages-404-jsx": preferDefault(require("/Users/zum/Desktop/editor-blog/src/pages/404.jsx")),
  "component---src-pages-index-jsx": preferDefault(require("/Users/zum/Desktop/editor-blog/src/pages/index.jsx")),
  "component---src-pages-post-markdown-remark-frontmatter-slug-jsx": preferDefault(require("/Users/zum/Desktop/editor-blog/src/pages/post/{markdownRemark.frontmatter__slug}.jsx"))
}

