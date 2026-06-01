import { Suspense } from "react";
import { DemoLogin } from "@/components/demo-login";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <DemoLogin />
    </Suspense>
  );
}
