import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // 정적 페이지이므로 서버가 없어 최적화 비활성화
  images: {
    unoptimized: true,
  },

  ...(process.env.NODE_ENV === "production" && {
    output: "export",
  }),

  basePath: process.env.NODE_ENV === "production" ? "/wkd2ev" : "",

  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      '@uidotdev/usehooks',
      'clsx',
      'react-syntax-highlighter',
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      remarkGfm,
      [remarkMdxFrontmatter, { name: "frontmatter" }],
    ],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
