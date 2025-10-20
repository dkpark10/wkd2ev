'use client';

import TableContent from "@/components/table-content";

export default function PostLayout({ children }) {
  return (
    <>
      {children}
      <TableContent />
    </>
  );
}
