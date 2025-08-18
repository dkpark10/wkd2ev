import { postHandler } from "@/utils/post-handler";
import Link from "next/link";

/**
 * @param {{ index: number }}
 */
export default function PostNav({ index }) {
  const prevPost = postHandler.prev(index);
  const nextPost = postHandler.next(index);

  return (
    <nav>
      {prevPost ? (
        <Link className="item" href={`/post/${prevPost.slug}`}>
          {prevPost.slug}
        </Link>
      ) : (
        <div className="item" />
      )}
      {nextPost ? (
        <Link className="item" href={`/post/${nextPost.slug}`}>
          {nextPost.slug}
        </Link>
      ) : (
        <div className="item" />
      )}
    </nav>
  );
}
