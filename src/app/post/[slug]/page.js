import { generateTitleSlug } from '@/utils/generate-title-slug';
import { getOrgFileName } from '@/utils/get-posts';

export default async function Page({ params }) {
  const { slug } = await params;

  const fileName = getOrgFileName(decodeURIComponent(slug));

  const { default: Post } = await import(`@/content/${fileName}`);
  return <Post />
}

export function generateStaticParams() {
  return [{ slug: generateTitleSlug('타입 세이프하게 api를 호출해보자') }];
}

export const dynamicParams = false;
