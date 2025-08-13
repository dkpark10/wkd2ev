import { getPosts } from '@/utils/get-posts';
import Link from 'next/link';

export default function Home() {
  const allPosts = getPosts();

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.title}>
          <Link href={`/post/${post.slug}`}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
