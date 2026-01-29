"use client";

import { useSubTitleList } from "@/provider/sub-title-context";
import { cn } from "@/lib/utils";

export default function TableContent() {
  const { subTitleList, headingRefs } = useSubTitleList();

  /** @param {import("@/provider/sub-title-context").SubTitle} item */
  const onClick = (item) => {
    window.history.pushState(null, "", `#${item.slug}`);
    headingRefs.current.get(item.slug)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ul className="sticky top-[115px] text-sm max-xl:hidden">
      {subTitleList.map((item) => (
        <li
          key={item.slug}
          className={cn(
            "cursor-pointer py-1 hover:text-primary",
            item.current && "text-primary",
            item.level === 3 && "pl-3",
            item.level === 4 && "pl-6",
            item.level === 5 && "pl-9",
            item.level === 6 && "pl-12"
          )}
          onClick={() => onClick(item)}
        >
          {item.textContent}
        </li>
      ))}
    </ul>
  );
}
