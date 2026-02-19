import type { Metadata } from "next";
import { ClerkProvider, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenSlot — Know when you're free",
  description:
    "Instantly find available meeting slots from every Google Calendar you have, in any timezone.",
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
          <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-2xl backdrop-saturate-180 border-b border-black/[0.06]">
            <div className="max-w-[980px] mx-auto px-6 h-12 flex items-center justify-between">
              <span className="text-[22px] font-bold tracking-[-0.04em] text-apple-gray-dark">
                Open<span className="text-apple-blue">Slot</span>
              </span>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <a
                  href="/sign-in"
                  className="text-[13px] font-medium text-apple-blue hover:text-apple-blue-hover transition-colors duration-150"
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
