import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { generateTitleSlug } from "@/utils/generate-title-slug";

const postsDirectory = path.join(process.cwd(), "/src/content");

/** @type {Array<{ slug: string, orgFileName: string }> | null} */
let cache = null;

/**
 * 사용자 객체를 생성합니다.
 * @returns {Array<{ slug: string, orgFileName: string }>}
 */
export const getPosts = () => {
  if (cache) return cache;
  const files = fs.readdirSync(postsDirectory);

  const results = files
    .filter((file) => file.endsWith(".mdx"))
    .map((fileName) => {
      const filePath = path.join(postsDirectory, fileName);

      const fileContents = fs.readFileSync(filePath, "utf-8");

      const { data } = matter(fileContents);

      return {
        slug: generateTitleSlug(fileName.replace(/\.mdx$/, "")),
        orgFileName: fileName,
        ...data,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순
  cache = results;
  return results;
};

/**
 * 사용자 객체를 생성합니다.
 * @returns {string}
 */
export const getOrgFileName = (slug) => {
  if (cache) return cache.find((post) => post.slug === slug).orgFileName;;
  return getPosts().find((post) => post.slug === slug).orgFileName;
};
