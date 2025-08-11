import { generateTitleSlug } from '@/utils/generate-title-slug';

export default async function Page({ params }) {
  const { slug } = await params;

  const { default: Post } = await import(`@/content/${decodeURIComponent(slug)}.mdx`);
  return <Post />
}

export function generateStaticParams() {
  return [{ slug: generateTitleSlug('타입 세이프하게 api를 호출해보자') }];
}

export const dynamicParams = false;
