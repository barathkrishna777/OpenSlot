import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-44px)]">
      <SignUp />
    </main>
  );
}
