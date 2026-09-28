import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { emailField, field, json, limited, sameOrigin } from "@/lib/agent-auth";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  try {
    if (await limited(request, "agent-application", 5)) return json({ error: "Please try again later." }, 429);
    const body = await request.json();
    if (body.website) return json({ ok: true });
    if (body.consent !== true) throw new Error("Please consent to being contacted about your application.");
    const country = field(body.country_code, 2).toUpperCase();
    if (!/^[A-Z]{2}$/.test(country)) throw new Error("Enter a two-letter country code, such as ES.");
    const { error } = await createAdminClient().from("agent_applications").insert({ full_name: field(body.full_name), email: emailField(body.email), phone: field(body.phone, 50), country_code: country, city: field(body.city, 100), business_name: field(body.business_name || "", 200, false), area_of_operations: field(body.area_of_operations, 1000), experience: field(body.experience || "", 3000, false), equipment: field(body.equipment || "", 3000, false) });
    if (error) return json({ error: "We could not save your application. Please try again." }, 500);
    return json({ ok: true }, 201);
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Check the form and try again." }, 400); }
}
