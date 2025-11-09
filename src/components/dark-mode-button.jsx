'use client';

import { useLayoutEffect, useState } from "react";
import clsx from "clsx";
import Image from "@/components/image";

function Sun() {
  return (
    <Image src='/icons/sun.svg' width={16} height={16} alt='태양 아이콘' />
  );
}

function Moon() {
  return (
    <Image src='/icons/moon.svg' width={16} height={16} alt='달 아이콘' />
  )
}

const KEY = 'THEME';

export default function DarkModeButton() {
  /** @type {['light' | 'dark' | null, React.Dispatch<React.SetStateAction<'light' | 'dark'>>]} */
  const [theme, setTheme] = useState(null);

  useLayoutEffect(() => {
    const currentTheme = localStorage.getItem(KEY) || 'light';
    setTheme(currentTheme);
  }, []);

  const onClick = () => {
    const next = theme === "light" ? "dark" : "light";
    localStorage.setItem(KEY, next);
    document.body.dataset.theme = next;
    setTheme(next);
  }

  return (
    <div
      className="dark-container"
      onClick={onClick}
      role='button'
    >
      {theme === null ? <></> : (
        <button
          className={clsx(theme === 'dark' && 'active', 'fade_in')}
          type='button'
          role='switch'
        >
          {theme === 'dark' ? <Moon /> : <Sun />}
        </button>
      )}
    </div>
  )
}
