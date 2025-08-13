import { getPosts } from "@/utils/get-posts";
import Link from "next/link";

export default function Home() {
  const allPosts = getPosts();

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.title}>
          <Link href={`/post/${post.slug}`}>
            <h3>{post.title}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
