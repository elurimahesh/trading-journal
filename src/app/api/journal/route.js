export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getJournal, createJournal, updateJournal } from "@/lib/notion";

/**
 * GET /api/accounts — list all accounts
 */
export async function GET() {
  try {
    const journal = await getJournal();
    return NextResponse.json({ ok: true, journal });
  } catch (err) {
    console.error("GET /api/journal error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

/**
 * POST /api/journal — create new account

 */
export async function POST(request) {
  try {
    const data = await request.json();
    const page = await createJournal(data);
    return NextResponse.json({ ok: true, page });
  } catch (err) {
    console.error("POST /api/journal error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
/**
 * PUT - update a trade by your record ID (the numeric 'ID' property inside Notion)
 * Body: { id: 22, ...fieldsToUpdate }
 */
export async function PUT(request) {
    try {
      const body = await request.json();
      console.log("body request", body);
      // Accept pageId from frontend OR fallback to hardcoded page id
      const pageIdFromClient = body?.pageId;
      const pageIdToUse = pageIdFromClient ;
  
      // Remove pageId from fields we pass to updateTrade
      const { pageId, ...fields } = body || {};
  
      if (!pageIdToUse) {
        return NextResponse.json({ ok: false, error: "pageId is required (none provided and no hardcoded fallback)" }, { status: 400 });
      }
  
      if (!fields || Object.keys(fields).length === 0) {
        return NextResponse.json({ ok: false, error: "no fields provided to update" }, { status: 400 });
      }
  
      // Perform update on the specific Notion page
      const updated = await updateJournal(pageIdToUse, fields);
  
      return NextResponse.json({ ok: true, updated }, { status: 200 });
    } catch (err) {
      console.error("PUT /api/journal ERROR:", err);
      return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
    }
  }

