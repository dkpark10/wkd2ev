import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below

  images: {
    unoptimized: true,
  },

  ...(process.env.NODE_ENV === 'production' && {
    output: "export",
  }),

  basePath:
    process.env.NODE_ENV === 'production'
      ? '/wkd2ev'
      : '',

  reactStrictMode: true,
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: "frontmatter" }],
    ],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
