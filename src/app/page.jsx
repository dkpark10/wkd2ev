import { getPosts } from '@/utils/get-posts';
import Link from 'next/link';

export default function Home() {
  const allPosts = getPosts();

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.title} className='post_item'>
          <Link href={`/post/${post.slug}`}>
            <div className='title'>
              {post.title}
            </div>
            <div>
              {post.description}
            </div>
            <time>
              {post.date}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
