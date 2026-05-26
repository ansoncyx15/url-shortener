import ApplicationHeader from "@/app/_ui/sticky-header/ApplicationHeader";
import GuestBootstrap from "@/app/GuestBootstrap";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

export const metadata = {
  title: "Url Shortener",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <div
            data-slot="layout"
            className="isolate flex min-h-svh flex-col bg-[#f5f3ec] [--header-height:4rem]"
          >
            <GuestBootstrap />
            <ApplicationHeader />

            <main className="min-h-0 w-full flex-1 overflow-auto">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
