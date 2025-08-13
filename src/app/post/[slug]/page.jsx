import { getOrgFileName, getPosts } from "@/utils/get-posts";

export default async function Page({ params }) {
  const { slug } = await params;

  const fileName = getOrgFileName(decodeURIComponent(slug));

  const { default: Post } = await import(`@/content/${fileName}`);
  return <Post />;
}

export function generateStaticParams() {
  const slugArray1 = getPosts().map((post) => ({
    slug: String(post.id),
  }));
  const slugArray2 = getPosts().map((post) => ({
    slug: post.slug,
  }));

  return [
    ...slugArray1,
    ...slugArray2,
  ];
}

export const dynamicParams = false;
