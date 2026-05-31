"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarPlus, Check, CheckCircle2, Clock, Edit3, Menu, TrendingDown, WalletCards, X } from "lucide-react";
import { appointments as initialAppointments } from "@/lib/mock-data";
import { Appointment, AppointmentStatus, StatusHistoryEntry } from "@/lib/types";
import { currency } from "@/lib/metrics";
import { Card, Pill, SectionTitle } from "@/components/ui";

const days = ["30", "31", "01", "02", "03", "04", "05"];

const statusOptions: { value: AppointmentStatus; label: string }[] = [
  { value: "scheduled", label: "Agendado" },
  { value: "confirmed", label: "Confirmado" },
  { value: "attended", label: "Atendido" },
  { value: "finished", label: "Finalizado" },
  { value: "rescheduled", label: "Reagendado" },
  { value: "cancelled_by_client", label: "Cancelado pela cliente" },
  { value: "cancelled_by_professional", label: "Cancelado pelo profissional" },
  { value: "no_show", label: "Nao compareceu" }
];

const quickStatuses: AppointmentStatus[] = ["confirmed", "attended", "finished", "rescheduled", "no_show", "cancelled_by_client"];

const statusLabel = Object.fromEntries(statusOptions.map((status) => [status.value, status.label])) as Record<AppointmentStatus, string>;

function normalizeAppointment(appointment: Appointment): Appointment {
  const legacyStatus = appointment.status as AppointmentStatus | "done" | "cancelled";
  const status: AppointmentStatus = legacyStatus === "done" ? "finished" : legacyStatus === "cancelled" ? "cancelled_by_client" : legacyStatus;
  return {
    ...appointment,
    status,
    statusHistory: appointment.statusHistory?.length
      ? appointment.statusHistory
      : [{ id: crypto.randomUUID(), from: "created", to: status, changedAt: new Date().toISOString() }]
  };
}

export function Schedule() {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (typeof window === "undefined") return initialAppointments.map(normalizeAppointment);
    const saved = window.localStorage.getItem("estetica.appointments");
    return saved ? (JSON.parse(saved) as Appointment[]).map(normalizeAppointment) : initialAppointments.map(normalizeAppointment);
  });
  const [selectedId, setSelectedId] = useState(appointments[0]?.id ?? "");
  const [showEditor, setShowEditor] = useState(false);
  const selectedAppointment = appointments.find((appointment) => appointment.id === selectedId) ?? appointments[0];

  useEffect(() => {
    window.localStorage.setItem("estetica.appointments", JSON.stringify(appointments));
  }, [appointments]);

  function updateSelected(field: keyof Appointment, value: string | number) {
    setAppointments((current) => current.map((appointment) => (appointment.id === selectedAppointment.id ? { ...appointment, [field]: value } : appointment)));
  }

  function changeStatus(appointmentId: string, nextStatus: AppointmentStatus) {
    setAppointments((current) =>
      current.map((appointment) => {
        if (appointment.id !== appointmentId || appointment.status === nextStatus) return appointment;
        const entry: StatusHistoryEntry = {
          id: crypto.randomUUID(),
          from: appointment.status,
          to: nextStatus,
          changedAt: new Date().toISOString()
        };
        return {
          ...appointment,
          status: nextStatus,
          statusHistory: [...appointment.statusHistory, entry]
        };
      })
    );
  }

  function addAppointment() {
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      clientName: "Novo atendimento",
      service: "",
      startsAt: "2026-05-30",
      time: "09:00",
      duration: 60,
      price: 0,
      status: "scheduled"
      ,
      statusHistory: [{ id: crypto.randomUUID(), from: "created", to: "scheduled", changedAt: new Date().toISOString() }]
    };
    setAppointments((current) => [newAppointment, ...current]);
    setSelectedId(newAppointment.id);
    setShowEditor(true);
  }

  return (
    <Card className="p-4">
      <SectionTitle
        eyebrow="Agenda"
        title="Calendario e horarios"
        action={<button onClick={addAppointment} className="flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white"><CalendarPlus size={16} /> Agendar</button>}
      />
      <div className="mb-4 rounded-lg bg-mist p-3 text-sm font-semibold text-moss">
        Clique em um horario para selecionar. Use Editar quando precisar alterar data, servico, valor ou status.
      </div>
      <ScheduleStats appointments={appointments} />
      <div className="mb-4 grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <button key={day} className={`rounded-lg border px-2 py-3 text-center ${index === 0 ? "border-jade bg-mist text-jade" : "border-black/5 bg-white text-moss"}`}>
            <span className="block text-xs">{["Sab", "Dom", "Seg", "Ter", "Qua", "Qui", "Sex"][index]}</span>
            <strong className="text-base">{day}</strong>
          </button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid gap-3">
          {appointments.map((appointment) => (
            <button
              key={appointment.id}
              onClick={() => {
                setSelectedId(appointment.id);
                setShowEditor(false);
              }}
              className={`rounded-lg border p-3 text-left transition ${appointment.id === selectedAppointment?.id ? "border-jade bg-mist" : "border-black/5 bg-cream hover:border-jade/40"}`}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-jade"><Clock size={15} /> {appointment.time} - {appointment.duration} min</p>
                  <h3 className="mt-1 font-semibold text-ink">{appointment.clientName}</h3>
                  <p className="text-sm text-moss">{appointment.service || "Servico nao informado"}</p>
                </div>
                <Pill tone={getStatusTone(appointment.status)}>{statusLabel[appointment.status]}</Pill>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickStatuses.map((status) => (
                  <span
                    key={status}
                    onClick={(event) => {
                      event.stopPropagation();
                      changeStatus(appointment.id, status);
                    }}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      appointment.status === status ? "bg-jade text-white" : "bg-white text-moss hover:bg-mist hover:text-jade"
                    }`}
                  >
                    {statusLabel[status]}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-moss">
                <span className="flex items-center gap-1"><CheckCircle2 size={14} /> Confirmacao automatica</span>
                <span className="flex items-center gap-1"><Bell size={14} /> Lembrete 24h</span>
                <strong className="ml-auto text-sm text-ink">{currency.format(appointment.price)}</strong>
              </div>
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedId(appointment.id);
                  setShowEditor(true);
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white"
              >
                <Edit3 size={15} /> Editar
              </span>
            </button>
          ))}
        </div>

        {selectedAppointment ? (
          <aside
            className={`min-h-72 overflow-hidden rounded-lg border border-jade/20 bg-white shadow-soft transition-all duration-300 ease-out ${
              showEditor ? "w-full xl:w-[430px]" : "w-full xl:w-[78px]"
            }`}
          >
            <div className={`flex h-full ${showEditor ? "flex-col" : "items-center justify-center xl:flex-col"}`}>
              <div className={`flex items-center gap-2 border-b border-black/5 p-3 ${showEditor ? "justify-between" : "justify-center xl:border-b-0"}`}>
                {showEditor ? (
                  <h3 className="flex min-w-0 items-center gap-2 text-lg font-semibold text-ink">
                    <Edit3 size={18} className="shrink-0" />
                    <span className="truncate">Editar horario</span>
                  </h3>
                ) : null}
                <button
                  onClick={() => setShowEditor((current) => !current)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-ink text-white transition hover:bg-jade"
                  type="button"
                  aria-label={showEditor ? "Recolher edicao" : "Expandir edicao"}
                  title={showEditor ? "Recolher edicao" : "Expandir edicao"}
                >
                  {showEditor ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

              {showEditor ? (
                <div className="grid gap-3 p-4 sm:grid-cols-2">
                  <EditField label="Cliente" value={selectedAppointment.clientName} onChange={(value) => updateSelected("clientName", value)} />
                  <EditField label="Servico" value={selectedAppointment.service} onChange={(value) => updateSelected("service", value)} />
                  <EditField label="Data" type="date" value={selectedAppointment.startsAt} onChange={(value) => updateSelected("startsAt", value)} />
                  <EditField label="Hora" type="time" value={selectedAppointment.time} onChange={(value) => updateSelected("time", value)} />
                  <EditField label="Duracao" type="number" value={String(selectedAppointment.duration)} onChange={(value) => updateSelected("duration", Number(value))} />
                  <EditField label="Valor" type="number" value={String(selectedAppointment.price)} onChange={(value) => updateSelected("price", Number(value))} />
                  <label className="grid gap-1 text-sm font-semibold text-moss sm:col-span-2">
                    Status
                    <select value={selectedAppointment.status} onChange={(event) => changeStatus(selectedAppointment.id, event.target.value as AppointmentStatus)} className="rounded-lg border border-black/10 bg-cream px-3 py-3 text-base text-ink outline-none focus:border-jade">
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </label>
                  <div className="rounded-lg bg-cream p-3 sm:col-span-2">
                    <h4 className="mb-2 text-sm font-semibold text-ink">Historico de status da cliente</h4>
                    <div className="grid gap-2">
                      {selectedAppointment.statusHistory.map((entry) => (
                        <div key={entry.id} className="rounded-lg bg-white px-3 py-2 text-xs text-moss">
                          <strong className="text-ink">{entry.from === "created" ? "Criado" : statusLabel[entry.from]}</strong>
                          {" -> "}
                          <strong className="text-jade">{statusLabel[entry.to]}</strong>
                          <span className="block">{new Date(entry.changedAt).toLocaleString("pt-BR")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setShowEditor(false)} className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-jade px-4 py-3 text-sm font-semibold text-white sm:col-span-2">
                    <Check size={16} /> Salvar e recolher
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowEditor(true)}
                  className="flex w-full items-center justify-center gap-2 p-4 text-sm font-semibold text-jade xl:h-full xl:flex-col xl:px-2"
                  type="button"
                >
                  <Edit3 size={20} />
                  <span className="xl:[writing-mode:vertical-rl]">Edicao</span>
                </button>
              )}
            </div>
          </aside>
        ) : null}
      </div>
    </Card>
  );
}

function ScheduleStats({ appointments }: { appointments: Appointment[] }) {
  const total = appointments.length;
  const attendance = appointments.filter((appointment) => ["attended", "finished"].includes(appointment.status)).length;
  const absences = appointments.filter((appointment) => appointment.status === "no_show").length;
  const cancellations = appointments.filter((appointment) => ["cancelled_by_client", "cancelled_by_professional"].includes(appointment.status)).length;
  const rescheduled = appointments.filter((appointment) => appointment.status === "rescheduled").length;
  const expectedRevenue = appointments
    .filter((appointment) => !["cancelled_by_client", "cancelled_by_professional", "no_show"].includes(appointment.status))
    .reduce((sum, appointment) => sum + appointment.price, 0);
  const realizedRevenue = appointments
    .filter((appointment) => ["attended", "finished"].includes(appointment.status))
    .reduce((sum, appointment) => sum + appointment.price, 0);
  const lostRevenue = appointments
    .filter((appointment) => appointment.status === "no_show")
    .reduce((sum, appointment) => sum + appointment.price, 0);

  const stats = [
    { label: "Total", value: String(total), icon: CalendarPlus },
    { label: "Comparecimento", value: String(attendance), icon: CheckCircle2 },
    { label: "Faltas", value: String(absences), icon: X },
    { label: "Cancelamentos", value: String(cancellations), icon: Bell },
    { label: "Reagendamentos", value: String(rescheduled), icon: Clock },
    { label: "Previsto", value: currency.format(expectedRevenue), icon: WalletCards },
    { label: "Realizado", value: currency.format(realizedRevenue), icon: Check },
    { label: "Perdido por faltas", value: currency.format(lostRevenue), icon: TrendingDown }
  ];

  return (
    <div className="mb-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-black/5 bg-white p-3">
          <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-mist text-jade">
            <stat.icon size={16} />
          </div>
          <p className="text-xs font-semibold uppercase text-moss">{stat.label}</p>
          <strong className="text-lg text-ink">{stat.value}</strong>
        </div>
      ))}
    </div>
  );
}

function getStatusTone(status: AppointmentStatus): "neutral" | "good" | "warn" {
  if (["confirmed", "attended", "finished"].includes(status)) return "good";
  if (["no_show", "cancelled_by_client", "cancelled_by_professional"].includes(status)) return "warn";
  return "neutral";
}

function EditField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-moss">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-black/10 bg-cream px-3 py-3 text-base text-ink outline-none focus:border-jade" />
    </label>
  );
}
