"use client";

import { BrushCleaningIcon } from "lucide-react";
import Link from "next/link";
import AvatarMenu from "@/app/_ui/sticky-header/AvatarMenu";
import LinkTabs from "@/app/_ui/sticky-header/LinkTabs";

export default function ApplicationHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center-safe justify-between border-b border-[#e6e2d4] bg-[#f5f3ec] p-2 drop-shadow">
      <Link href="/" className="flex items-center">
        <BrushCleaningIcon className="stroke-1.5" />
        <h1 className="hidden p-2 font-bold sm:inline">Url shortener</h1>
      </Link>

      <div className="flex justify-center-safe">
        <LinkTabs />
      </div>

      <AvatarMenu />
    </header>
  );
}
