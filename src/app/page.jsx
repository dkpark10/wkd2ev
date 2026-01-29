import { postHandler } from "@/utils/post-handler";
import Link from "next/link";

export default function Home() {
  const allPosts = postHandler.getPosts();

  return (
    <ul className="px-8">
      {allPosts.map((post) => (
        <li
          key={post.title}
          className="pb-11 [contain-intrinsic-size:0_120px] [content-visibility:auto]"
        >
          <Link href={`/post/${post.slug}`}>
            <div className="pb-5 text-3xl font-bold text-card-foreground">
              {post.title}
            </div>
            <div>{post.description}</div>
            <time className="text-muted-foreground">{post.date}</time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
