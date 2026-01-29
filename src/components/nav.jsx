import { postHandler } from "@/utils/post-handler";
import Link from "next/link";

/**
 * @param {{ index: number }}
 */
export default function PostNav({ index }) {
  const prevPost = postHandler.prev(index);
  const nextPost = postHandler.next(index);

  return (
    <nav className="flex justify-between gap-5 pb-8 pt-11 max-xs:flex-col max-xs:gap-3">
      {prevPost ? (
        <Link
          href={`/post/${prevPost.slug}`}
          className="max-w-[360px] overflow-hidden text-ellipsis whitespace-nowrap text-xl font-medium text-primary max-xs:max-w-full"
        >
          {prevPost.slug}
        </Link>
      ) : (
        <div />
      )}
      {nextPost ? (
        <Link
          href={`/post/${nextPost.slug}`}
          className="max-w-[360px] overflow-hidden text-ellipsis whitespace-nowrap text-xl font-medium text-primary max-xs:max-w-full"
        >
          {nextPost.slug}
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
