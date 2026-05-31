import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const tables = ["clients", "appointments", "transactions", "financial_allocations"];

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json({ error: "Supabase service role nao configurada." }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey);
  const backup: Record<string, unknown> = {
    generatedAt: new Date().toISOString()
  };

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      return NextResponse.json({ error: error.message, table }, { status: 500 });
    }
    backup[table] = data;
  }

  const webhookUrl = process.env.BACKUP_WEBHOOK_URL;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backup)
    });
  }

  return NextResponse.json({ ok: true, backup });
}
