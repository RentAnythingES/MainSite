import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "This booking method is no longer available. Please use the secure checkout." },
    { status: 410 },
  );
}
