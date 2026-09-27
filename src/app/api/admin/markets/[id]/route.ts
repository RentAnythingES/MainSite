import { NextRequest } from "next/server";
import { saveAdminMarket } from "@/lib/admin-markets";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return saveAdminMarket(request, (await context.params).id);
}
