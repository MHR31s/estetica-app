export type Client = {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  birthDate?: string;
  photoUrl?: string;
  lastAppointmentAt?: string;
  totalSpent?: number;
  returnFrequencyDays?: number;
  tags?: string[];
  history: string;
  notes: string;
};

export type CompanyPlan = "start" | "pro" | "premium";

export type Company = {
  id: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  whatsapp: string;
  email: string;
  plan: CompanyPlan;
  monthlyGoal: number;
  active: boolean;
  automaticMessages: {
    confirmation: string;
    reminder24h: string;
    afterCare: string;
    inactiveClient: string;
  };
};

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "attended"
  | "finished"
  | "rescheduled"
  | "cancelled_by_client"
  | "cancelled_by_professional"
  | "no_show";

export type StatusHistoryEntry = {
  id: string;
  from: AppointmentStatus | "created";
  to: AppointmentStatus;
  changedAt: string;
};

export type Appointment = {
  id: string;
  clientName: string;
  service: string;
  startsAt: string;
  time: string;
  duration: number;
  price: number;
  status: AppointmentStatus;
  statusHistory: StatusHistoryEntry[];
};

export type Transaction = {
  id: string;
  kind: "income" | "expense";
  description: string;
  amount: number;
  occurredAt: string;
  category: string;
};
