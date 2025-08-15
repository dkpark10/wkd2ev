import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { generateTitleSlug } from "@/utils/generate-title-slug";

const postsDirectory = path.join(process.cwd(), "/src/content");

/** @type {Array<{ slug: string, orgFileName: string }> | null} */
let cache = null;

/**
 * 사용자 객체를 생성합니다.
 * @returns {Array<{ slug: string, orgFileName: string, id: number, description: string, date: string }>}
 */
export const getPosts = () => {
  if (cache) return cache;
  const files = fs.readdirSync(postsDirectory);

  const results = files
    .filter((file) => file.endsWith(".mdx"))
    .map((fileName, idx) => {
      const filePath = path.join(postsDirectory, fileName);

      const fileContents = fs.readFileSync(filePath, "utf-8");

      const { data } = matter(fileContents);

      return {
        id: idx,
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
 * @param {number | string} slug 첫 번째 숫자
 * @returns {{ slug: string, orgFileName: string, id: number, description: string, date: string }}
 * 
 */
export const getPost = (slug) => {
  if (isNaN(slug)) {
    if (cache) return cache.find((post) => post.slug === slug);
    return getPosts().find((post) => post.slug === slug);
  }
  if (cache) return cache.find((post) => post.id === Number(slug));
  return getPosts().find((post) => post.id === Number(slug));
};
