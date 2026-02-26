"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const today = format(new Date(), "yyyy년 M월 d일 (EEEE)", { locale: ko });

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      {/* Left */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-400">{today}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          시스템 정상
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
          MK
        </div>
      </div>
    </header>
  );
}
