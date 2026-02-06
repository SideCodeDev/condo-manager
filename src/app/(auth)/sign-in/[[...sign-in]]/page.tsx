import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="w-dvw h-dvh grid place-items-center">
      <SignIn signUpForceRedirectUrl="/onboarding" fallbackRedirectUrl="/" />;
    </main>
  );
}
