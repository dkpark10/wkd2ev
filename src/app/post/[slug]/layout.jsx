'use client';

import TableContent from "@/components/table-content";

export default function PostLayout({ children }) {
  return (
    <div className="post-layout">
      <div className="post-spacer" />
      <article className="post-content">
        {children}
      </article>
      <aside className="post-toc">
        <TableContent />
      </aside>
    </div>
  );
}
