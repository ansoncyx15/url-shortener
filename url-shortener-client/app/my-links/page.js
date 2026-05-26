import ShortenUrlHistory from "@/app/my-links/_ui/ShortenUrlHistory";
import RequireAuth from "@/src/components/RequireAuth";

export default function Page() {
  return (
    <RequireAuth>
      <div className="mx-auto min-h-full max-w-4xl space-y-4 bg-[#f5f3ec] p-4">
        <h1 className="text-2xl font-semibold">My links</h1>

        <ShortenUrlHistory />
      </div>
    </RequireAuth>
  );
}
