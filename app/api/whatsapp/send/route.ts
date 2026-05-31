import { NextResponse } from "next/server";

type Payload = {
  to: string;
  message: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as Payload;

  if (!payload.to || !payload.message) {
    return NextResponse.json({ error: "Informe to e message." }, { status: 400 });
  }

  const provider = process.env.WHATSAPP_PROVIDER ?? "evolution";

  if (provider === "cloud") {
    return sendWithCloudApi(payload);
  }

  return sendWithEvolution(payload);
}

async function sendWithEvolution(payload: Payload) {
  const baseUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE;

  if (!baseUrl || !apiKey || !instance) {
    return NextResponse.json({ error: "Evolution API nao configurada." }, { status: 500 });
  }

  const response = await fetch(`${baseUrl}/message/sendText/${instance}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey
    },
    body: JSON.stringify({
      number: payload.to,
      text: payload.message
    })
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json({ provider: "evolution", ok: response.ok, data }, { status: response.ok ? 200 : 502 });
}

async function sendWithCloudApi(payload: Payload) {
  const phoneNumberId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_CLOUD_TOKEN;

  if (!phoneNumberId || !token) {
    return NextResponse.json({ error: "WhatsApp Cloud API nao configurada." }, { status: 500 });
  }

  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: payload.to,
      type: "text",
      text: { body: payload.message }
    })
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json({ provider: "cloud", ok: response.ok, data }, { status: response.ok ? 200 : 502 });
}
