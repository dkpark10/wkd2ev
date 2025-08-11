import { getPosts } from '@/utils/get-posts';
import Link from 'next/link';

export default function Home() {
  const allPosts = getPosts();
  // {
  //   slug: '타입 세이프하게 api를 호출해보자',
  //   title: '타입 세이프하게 api를 호출해보기',
  //   date: '2024-05-04',
  //   description: '오버 엔지니어링인 감이 없지 않아 있다.'
  // }

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.title}>
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
