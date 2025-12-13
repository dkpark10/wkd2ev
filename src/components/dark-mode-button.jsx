'use client';

import { useLayoutEffect, useState } from "react";
import clsx from "clsx";

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
      <button
        className={clsx(theme === 'dark' && 'active', 'fade_in')}
        type='button'
        role='switch'
      >
        <span className="toggle" />
      </button>
    </div>
  )
}
