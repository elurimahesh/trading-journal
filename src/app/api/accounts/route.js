export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAccounts, updateAccount} from "@/lib/notion";

/**
 * GET /api/accounts — list all accounts
 */
export async function GET() {
  try {
    const accounts = await getAccounts();
    return NextResponse.json({ ok: true, accounts });
  } catch (err) {
    console.error("GET /api/accounts error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

/**
 * PUT
 * - Body: { pageId: string, name?: string, initialBalance?: number, currentBalance?: number }
 * - Updates only provided fields for the pageId
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const pageId = body?.pageId;
    const { name, initialBalance, currentBalance } = body || {};

    if (!pageId) {
      return NextResponse.json({ ok: false, error: "pageId is required" }, { status: 400 });
    }

    // ensure at least one field to update
    const hasUpdate = name !== undefined || initialBalance !== undefined || currentBalance !== undefined;
    if (!hasUpdate) {
      return NextResponse.json({ ok: false, error: "no updatable fields provided" }, { status: 400 });
    }

    const updated = await updateAccount(pageId, { name, initialBalance, currentBalance });
    return NextResponse.json({ ok: true, updated });
  } catch (err) {
    console.error("PUT /api/accounts ERROR:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
