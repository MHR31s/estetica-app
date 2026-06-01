import { CompanyPlan, UserRole } from "@/lib/types";

export type DemoAccount = {
  email: string;
  password: string;
  label: string;
  role: UserRole;
  plan?: CompanyPlan;
  redirectTo: string;
};

export const demoAccounts: DemoAccount[] = [
  {
    email: "start@crmbeautypro.com",
    password: "Start@123",
    label: "Cliente Plano Start",
    role: "company_owner",
    plan: "start",
    redirectTo: "/dashboard/start"
  },
  {
    email: "pro@crmbeautypro.com",
    password: "Pro@123",
    label: "Cliente Plano Pro",
    role: "company_owner",
    plan: "pro",
    redirectTo: "/dashboard/pro"
  },
  {
    email: "premium@crmbeautypro.com",
    password: "Premium@123",
    label: "Cliente Plano Premium",
    role: "company_owner",
    plan: "premium",
    redirectTo: "/dashboard/premium"
  },
  {
    email: "admin@crmbeautypro.com",
    password: "Admin@123",
    label: "Admin Master",
    role: "master_admin",
    redirectTo: "/admin"
  }
];

export function authenticateDemo(email: string, password: string) {
  return demoAccounts.find((account) => account.email.toLowerCase() === email.toLowerCase().trim() && account.password === password);
}
