'use client';

import { useEffect, useState } from "react";
import clsx from "clsx";

function Sun() {
  return (
    <img src='/icons/sun.svg' width={16} height={16} alt='태양 아이콘' />
  );
}

function Moon() {
  return (
    <img src='/icons/moon.svg' width={16} height={16} alt='달 아이콘' />
  )
}

const KEY = 'THEME';

export default function DarkModeButton() {
  /** @type {['light' | 'dark' | null, React.Dispatch<React.SetStateAction<'light' | 'dark'>>]} */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const currentTheme = localStorage.getItem(KEY) || 'light';
    setTheme(currentTheme);
    document.body.dataset.theme = currentTheme;
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
        className={clsx(theme === 'dark' && 'active')}
        type='button'
        role='switch'
      >
        {theme === 'dark' ? <Moon /> : <Sun />}
      </button>
    </div>
  )
}
