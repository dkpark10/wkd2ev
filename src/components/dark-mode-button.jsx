'use client';

import { useState } from "react";
import cookie from 'js-cookie';
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

/** @param {{ initTheme: 'light' | 'dark' }} */
export default function DarkModeButton({ initTheme }) {
  /** @type {['light' | 'dark' | null, React.Dispatch<React.SetStateAction<'light' | 'dark'>>]} */
  const [theme, setTheme] = useState(initTheme);

  const onClick = () => {
    const next = theme === "light" ? "dark" : "light";
    document.body.dataset.theme = next;
    cookie.set('wkd2ev_theme', next);
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
