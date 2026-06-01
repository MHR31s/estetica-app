import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CompanyPlan } from "@/lib/types";

const plans = ["start", "pro", "premium"];

export default async function PlanDashboardPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan } = await params;

  if (!plans.includes(plan)) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <AppShell forcedPlan={plan as CompanyPlan} />
    </Suspense>
  );
}
