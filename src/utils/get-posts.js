import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { generateTitleSlug } from '@/utils/generate-title-slug';

const postsDirectory = path.join(process.cwd(), '/src/content');

export const getPosts = () => {
  const files = fs.readdirSync(postsDirectory);

  return files
    .filter(file => file.endsWith('.mdx'))
    .map(fileName => {
      const filePath = path.join(postsDirectory, fileName);

      const fileContents = fs.readFileSync(filePath, 'utf-8');

      const { data } = matter(fileContents);

      return {
        slug: generateTitleSlug(fileName.replace(/\.mdx$/, '')),
        orgFileName: fileName,
        ...data,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순
}

export const getOrgFileName = (slug) => {
  return getPosts().find((post) => post.slug === slug).orgFileName;
}
