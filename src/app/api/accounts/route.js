
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAccounts } from "@/lib/notion";


export async function GET() {
  try {
    const accounts = await getAccounts();
    return NextResponse.json({ ok: true, accounts });
  } catch (err) {
    console.error("GET /api/accounts error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
