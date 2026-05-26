"use client";

import Recent5ShortenUrls from "@/app/_ui/Recent5ShortenUrls";
import ShortenUrlForm from "@/app/_ui/ShortenUrlForm";
import HelpText from "@/src/components/HelpText";

export default function Page() {
  return (
    <div className="mx-auto min-h-full max-w-3xl space-y-6 bg-[#f5f3ec] p-4">
      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-semibold">Shorten your link</h1>
          <HelpText text="Paste a long url. Add a custom alias if you want it memorable." />
        </div>
        <ShortenUrlForm />
      </div>
      <Recent5ShortenUrls />
    </div>
  );
}
