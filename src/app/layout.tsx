import type { Metadata } from "next";
import { ClerkProvider, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalendarFree — Free Slots from Google Calendar",
  description:
    "Connect your Google Calendar and instantly see your free meeting slots in any timezone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="text-apple-gray-dark antialiased">
          <nav className="bg-apple-nav/90 backdrop-blur-xl">
            <div className="max-w-[980px] mx-auto px-6 h-11 flex items-center justify-between">
              <span className="text-[14px] font-normal text-white/90 tracking-[-0.01em]">
                CalendarFree
              </span>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <a
                  href="/sign-in"
                  className="text-[13px] text-white/70 hover:text-white/90 transition-colors"
                >
                  Sign in
                </a>
              </SignedOut>
            </div>
          </nav>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
