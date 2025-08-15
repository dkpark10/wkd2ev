import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { generateTitleSlug } from "@/utils/generate-title-slug";

const postsDirectory = path.join(process.cwd(), "/src/content");

function PostHandler() {
  /** @type {Array<{ slug: string, orgFileName: string }> | null} */
  let cache = null;

  /**
  * @returns {Array<{ slug: string, orgFileName: string, id: number, description: string, date: string }>}
  */
  this.getPosts = () => {
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
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((post, idx, self) => ({
        ...post,
        id: self.length - idx - 1,
      }));

    cache = results;
    return results;
  }

  /**
   * @param {number | string} slug 첫 번째 숫자
   * @returns {{ slug: string, orgFileName: string, id: number, description: string, date: string }}
   */
  this.getPost = (slug) => {
    if (isNaN(slug)) {
      if (cache) return cache.find((post) => post.slug === slug);
      return this.getPosts().find((post) => post.slug === slug);
    }
    if (cache) return cache.find((post) => post.id === Number(slug));
    return this.getPosts().find((post) => post.id === Number(slug));
  };
};

export const postHandler = new PostHandler();
