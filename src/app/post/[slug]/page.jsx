import React from "react";
import { postHandler } from '@/utils/get-posts';

export default async function Page({ params }) {
  const { slug } = await params;

  const currentPost = postHandler.getPost(decodeURIComponent(slug));

  const { default: Post } = await import(`@/content/${currentPost.orgFileName}`);
  return (
    <React.Fragment>
      <h1>{currentPost.title}</h1>
      <Post />
    </React.Fragment>
  );
}

export function generateStaticParams() {
  const slugArray1 = postHandler.getPosts().map((post) => ({
    slug: String(post.id),
  }));
  const slugArray2 = postHandler.getPosts().map((post) => ({
    slug: post.slug,
  }));

  return [
    ...slugArray1,
    ...slugArray2,
  ];
}

export const dynamicParams = false;
