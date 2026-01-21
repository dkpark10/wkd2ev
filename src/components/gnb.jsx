"use client";

import { useRef } from "react";
import Link from "next/link"
import { toast } from "react-strawberry-toast";

const placeHolder = [
  '공유하고 싶은 글을 게시합니다.',
  '배웠던 것을 기록합니다.',
];

export default function GNB() {
  const linkRef1 = useRef(null);

  const linkRef2 = useRef(null);

  const onMouseEnter = (placeHolder, toastId) => {
    if (toast.isActive(toastId)) return;
    toast(placeHolder, {
      toastId,
      timeOut: Infinity,
      target: {
        element: linkRef1.current,
        offset: [-100, 50],
      }
    });
  };

  const onMouseLeave = (toastId) => {
    if (toast.isActive(toastId)) {
      toast.remove(toastId, 0);
    }
  };

  return (
    <nav className="gnb">
      <ul>
        <li>
          <Link
            ref={linkRef1}
            href="/"
            onMouseEnter={() => onMouseEnter(placeHolder[0], '0')}
            onMouseLeave={() => onMouseLeave('0')}
          >
            글
          </Link>
        </li>
        <li>
          <Link
            ref={linkRef2}
            href="/trace"
            onMouseEnter={() => onMouseEnter(placeHolder[1], '1')}
            onMouseLeave={() => onMouseLeave('1')}
          >
            기록
          </Link>
        </li>
      </ul>
    </nav>
  )
}
