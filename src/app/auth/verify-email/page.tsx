import { Suspense } from "react";
import { EmailVerificationForm } from "@/components/auth/email-verification-form";
import { BeatLoader } from "react-spinners";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <BeatLoader />
        </div>
      }
    >
      <EmailVerificationForm />
    </Suspense>
  );
}
