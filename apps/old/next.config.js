const { version } = require('./package.json');
const isRunBundleAnalyze = process.env.ANALYZE === "true";
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV === "development",
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  images: {
    domains: ['shop.zumst.com', 'localhost'],
  },
  experimental: {
    serverActions: true,
  },
  publicRuntimeConfig: {
    version,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

module.exports = isRunBundleAnalyze ? require("@next/bundle-analyzer")()(nextConfig) : nextConfig;
