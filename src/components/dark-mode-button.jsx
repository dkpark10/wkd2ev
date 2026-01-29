"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useLayoutEffect, useState, useRef } from "react";

export default function DarkModeButton() {
  const { setTheme, resolvedTheme } = useTheme();

  const [isDark, setIsDark] = useState("light");

  useLayoutEffect(() => {
    setIsDark(resolvedTheme);
  }, []);

  const onClick = () => {
    const value = resolvedTheme === "light" ? "dark" : "light";
    setTheme(value);
    setIsDark(value);
  };

  return (
    <div
      className="flex h-6 w-12 cursor-pointer items-center rounded-full bg-card-foreground p-[3px] transition-colors duration-300"
      onClick={onClick}
      role="button"
    >
      <button
        className={cn(
          "flex h-5 w-5 items-center cursor-pointer justify-center rounded-full border-none bg-background transition-transform duration-300 ease-in-out",
          isDark === 'dark' && "translate-x-[22px]"
        )}
        type="button"
        role="switch"
        aria-checked={isDark}
      >
        <span className="h-4 w-4 bg-contain bg-center bg-no-repeat [background-image:var(--dark-toggle)]" />
      </button>
    </div>
  );
}
