import { postHandler } from '@/utils/post-handler';
import { NextResponse } from "next/server";

export async function GET() {
  const allPosts = postHandler.getPosts();

  const urls = allPosts.map((post) => `
    <url>
      <loc>https://dkpark10.github.io/wkd2ev/post/${post.slug}</loc>
      <lastmod>${post.date}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>${post.priority}</priority>
    </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
