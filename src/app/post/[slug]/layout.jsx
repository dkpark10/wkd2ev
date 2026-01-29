"use client";

import TableContent from "@/components/table-content";

export default function PostLayout({ children }) {
  return (
    <div className="post-layout flex justify-center gap-10 max-lg:gap-5 max-md:flex-col">
      <div className="w-[200px] shrink-0 max-lg:hidden" />
      <article className="w-full min-w-0 max-w-[874px] px-8 max-xs:px-5 [&_.space]:block [&_.space]:h-5 [&_p]:mb-5 [&_p_a]:underline [&_p_strong]:text-card-foreground [&_p_em]:text-card-foreground [&_p:has(>:is(strong,em):first-child:last-child)]:mb-0">
        {children}
      </article>
      <aside className="w-[200px] shrink-0 max-md:hidden">
        <TableContent />
      </aside>
    </div>
  );
}
