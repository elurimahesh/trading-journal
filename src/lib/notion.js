import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Get Account Info API

export async function getAccounts() {
    const dbId = process.env.NOTION_ACCOUNT_DB_ID;
    if (!dbId) throw new Error("Missing NOTION_ACCOUNT_DB_ID");

    // Step 1: Retrieve database metadata
    const database = await notion.databases.retrieve({ database_id: dbId });

    // Step 2: Find the data_source ID (assuming first one)
    const dataSourceId = database.data_sources?.[0]?.id;
    if (!dataSourceId) {
        throw new Error("Data source ID not found. Make sure your database has a data source.");
    }

    // Step 3: Query the data source (this is the new method)
    const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        page_size: 100,
    });
console.log("response", response);
    // Response contains pages (rows)
    return response.results.map((page) => {
        const props = page.properties;
        const name = props?.Name?.title?.[0]?.plain_text ?? "No Name";
        const initialBalance = props?.["Initial Balance"]?.number ?? 0;
        const currentBalance = props?.["Current Balance"]?.number ?? 0;
        return { id: page.id, name, initialBalance, currentBalance };
    });
}

function buildTitleForUpdate(value) {
    if (value === undefined || value === null) return undefined;
    return {
      title: [
        {
          type: "text",
          text: { content: String(value) }
        }
      ]
    };
  }
  
  function buildNumberForUpdate(value) {
    if (value === undefined || value === null) return undefined;
    return { number: Number(value) };
  }
  
  export async function updateAccount(pageId, data = {}) {
    if (!pageId) throw new Error("pageId is required");
  
    const { name, initialBalance, currentBalance } = data;
  
    const props = {};
  
    const titleBuilt = buildTitleForUpdate(name);
    if (titleBuilt !== undefined) props.Name = titleBuilt;
  
    const initialBuilt = buildNumberForUpdate(initialBalance);
    if (initialBuilt !== undefined) props["Initial Balance"] = initialBuilt;
  
    const currentBuilt = buildNumberForUpdate(currentBalance);
    if (currentBuilt !== undefined) props["Current Balance"] = currentBuilt;
  
    if (Object.keys(props).length === 0) {
      throw new Error("No fields provided for account update");
    }
  
    const updated = await notion.pages.update({
      page_id: pageId,
      properties: props,
    });
  
    return { id: updated.id, updatedProperties: Object.keys(props) };
  }


//   Get Journal Data API

export async function getJournal() {
    const dbId = process.env.NOTION_JOURNAL_DB_ID;
    if (!dbId) throw new Error("Missing NOTION_JOURNAL_DB_ID");

    // Step 1: Retrieve database metadata
    const database = await notion.databases.retrieve({ database_id: dbId });

    // Step 2: Find the data_source ID (assuming first one)
    const dataSourceId = database.data_sources?.[0]?.id;
    if (!dataSourceId) {
        throw new Error("Data source ID not found. Make sure your database has a data source.");
    }

    // Step 3: Query the data source (this is the new method)
    const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        page_size: 100,
    });

    // Response contains pages (rows)
    return response.results.map((page) => {
        console.log("data", page)
        const props = page.properties;

        const remarks = props?.Remarks?.rich_text?.[0]?.plain_text ?? "";
        const lotSize = props?.["Lot Size"]?.rich_text?.[0]?.plain_text ?? "";
        const entryTime = props?.["Entry Time"]?.rich_text?.[0]?.plain_text ?? "";
        const duration = props?.Duration?.rich_text?.[0]?.plain_text ?? "";
        const session = props?.Session?.rich_text?.[0]?.plain_text ?? "";
        const outcome = props?.Outcome?.rich_text?.[0]?.plain_text ?? "";
        const balance = props?.Balance?.rich_text?.[0]?.plain_text ?? "";
        const fees = props?.Fees?.rich_text?.[0]?.plain_text ?? "";
        const charts = props?.Charts?.rich_text?.[0]?.plain_text ?? "";
        const entryPrice = props?.["Entry Price"]?.rich_text?.[0]?.plain_text ?? "";
        const symbol = props?.Symbol?.rich_text?.[0]?.plain_text ?? "";
        const exitTime = props?.["Exit Time"]?.rich_text?.[0]?.plain_text ?? "";
        const risk = props?.Risk?.rich_text?.[0]?.plain_text ?? "";
        const result = props?.Result?.rich_text?.[0]?.plain_text ?? "";
        const rR = props?.["R : R"]?.rich_text?.[0]?.plain_text ?? "";
        const exitPrice = props?.["Exit Price"]?.rich_text?.[0]?.plain_text ?? "";
        const netPL = props?.["Net P&L"]?.rich_text?.[0]?.plain_text ?? "";
        const pL = props?.["P&L"]?.rich_text?.[0]?.plain_text ?? "";
        const date = props?.Date?.rich_text?.[0]?.plain_text ?? "";
        const createdTime = props?.["Created Time"]?.created_time ?? "";
        const position = props?.Position?.select?.name ?? "";
        const tradeId = props?.ID?.unique_id?.number ?? 0;


        return {
            id: page.id,
            remarks,
            lotSize,
            entryTime,
            duration,
            session,
            outcome,
            balance,
            fees,
            charts,
            entryPrice,
            symbol,
            exitTime,
            risk,
            result,
            rR,
            exitPrice,
            netPL,
            pL,
            date,
            createdTime,
            position,
            tradeId,
        };
    });
}
function safeText(v) {
    // ensure we always send a string (Notion rejects undefined)
    if (v === undefined || v === null) return "";
    return String(v);
}
export async function createJournal(data) {
    const {
        remarks,
        lotSize,
        entryTime,
        duration,
        session,
        outcome,
        balance,
        fees,
        charts,
        entryPrice,
        symbol,
        exitTime,
        risk,
        result,
        rR,
        exitPrice,
        netPL,
        pL,
        date,
        position, } = data;
    await notion.pages.create({
        parent: { database_id: process.env.NOTION_JOURNAL_DB_ID },
        properties: {
            Remarks: { rich_text: [{ type: "text", text: { content: safeText(remarks) } }] },
            "Lot Size": { rich_text: [{ type: "text", text: { content: safeText(lotSize) } }] },
            "Entry Time": { rich_text: [{ type: "text", text: { content: safeText(entryTime) } }] },
            Duration: { rich_text: [{ type: "text", text: { content: safeText(duration) } }] },
            Session: { rich_text: [{ type: "text", text: { content: safeText(session) } }] },
            Outcome: { rich_text: [{ type: "text", text: { content: safeText(outcome) } }] },
            Balance: { rich_text: [{ type: "text", text: { content: safeText(balance) } }] },
            Fees: { rich_text: [{ type: "text", text: { content: safeText(fees) } }] },
            Charts: { rich_text: [{ type: "text", text: { content: safeText(charts) } }] },
            "Entry Price": { rich_text: [{ type: "text", text: { content: safeText(entryPrice) } }] },
            Symbol: { rich_text: [{ type: "text", text: { content: safeText(symbol) } }] },
            "Exit Time": { rich_text: [{ type: "text", text: { content: safeText(exitTime) } }] },
            Risk: { rich_text: [{ type: "text", text: { content: safeText(risk) } }] },
            Result: { rich_text: [{ type: "text", text: { content: safeText(result) } }] },
            "R : R": { rich_text: [{ type: "text", text: { content: safeText(rR) } }] },
            "Exit Price": { rich_text: [{ type: "text", text: { content: safeText(exitPrice) } }] },
            "Net P&L": { rich_text: [{ type: "text", text: { content: safeText(netPL) } }] },
            "P&L": { rich_text: [{ type: "text", text: { content: safeText(pL) } }] },
            Date: { rich_text: [{ type: "text", text: { content: safeText(date) } }] },
            Position: { rich_text: [{ type: "text", text: { content: safeText(position) } }] },
        },
    });
}

/* -------------------- Find page by record ID (robust) -------------------- */
/**
 * findTradePageByRecordId(recordId)
 * - Tries number filter, then rich_text filter, then scans first 100 pages as a fallback.
 * - Returns either { pageId, foundBy } or null if not found.
 */
export async function findTradePageByRecordId(recordId) {
    if (recordId === undefined || recordId === null) return null;
    const wanted = String(recordId);
    const asNumber = Number(recordId);
  
    // 1) Try number filter (common case when ID is Number property)
    if (!Number.isNaN(asNumber)) {
      try {
        const resp = await notion.databases.query({
          database_id: TRADE_DB_ID,
          filter: {
            property: "ID",
            number: { equals: asNumber },
          },
          page_size: 1,
        });
        if (resp?.results?.length) {
          return { pageId: resp.results[0].id, foundBy: "number" };
        }
      } catch (e) {
        console.warn("findTradePageByRecordId: number-filter error:", e?.message ?? e);
      }
    }
  
    // 2) Try rich_text equals (if ID stored as text)
    try {
      const respText = await notion.databases.query({
        database_id: TRADE_DB_ID,
        filter: {
          property: "ID",
          rich_text: { equals: wanted },
        },
        page_size: 1,
      });
      if (respText?.results?.length) {
        return { pageId: respText.results[0].id, foundBy: "rich_text" };
      }
    } catch (e) {
      console.warn("findTradePageByRecordId: rich_text-filter error:", e?.message ?? e);
    }
  
    // 3) Fallback scan: fetch first 100 pages and inspect the property shapes manually
    try {
      const respAll = await notion.databases.query({
        database_id: TRADE_DB_ID,
        page_size: 100,
      });
      for (const page of respAll.results || []) {
        const props = page.properties || {};
        const idProp = props.ID;
  
        // number type
        if (idProp?.number !== undefined && String(idProp.number) === wanted) {
          return { pageId: page.id, foundBy: "scan_number" };
        }
  
        // rich_text type
        if (Array.isArray(idProp?.rich_text) && idProp.rich_text[0]?.plain_text === wanted) {
          return { pageId: page.id, foundBy: "scan_rich_text" };
        }
  
        // unique_id or nested shapes
        if (idProp?.unique_id?.number !== undefined && String(idProp.unique_id.number) === wanted) {
          return { pageId: page.id, foundBy: "scan_unique_id" };
        }
  
        // other possible shapes: check plain_text on first rich_text entry
        if (Array.isArray(idProp?.rich_text) && idProp.rich_text[0]?.plain_text && idProp.rich_text[0].plain_text === wanted) {
          return { pageId: page.id, foundBy: "scan_rich_text_2" };
        }
      }
    } catch (e) {
      console.warn("findTradePageByRecordId: scan error:", e?.message ?? e);
    }
  
    return null;
  }
  function buildRichTextForUpdate(value) {
    // If undefined/null → do NOT overwrite the property
    if (value === undefined || value === null) {
      return undefined;
    }
  
    // Otherwise convert to Notion rich_text
    return {
      rich_text: [
        {
          type: "text",
          text: {
            content: String(value)
          }
        }
      ]
    };
  }
  
  /* -------------------- Update Trade -------------------- */
  /**
   * updateTrade(pageId, fields)
   * - pageId: Notion page id (string)
   * - fields: partial object with trade keys (only provided keys will be updated)
   * - Returns { id, updatedProperties: [...] }
   */
  export async function updateJournal(pageId, fields = {}) {
    if (!pageId) throw new Error("pageId is required");
  
    const propsToUpdate = {};
  
    const addIf = (keyName, value) => {
      const built = buildRichTextForUpdate(value);
      if (built !== undefined) propsToUpdate[keyName] = built;
    };
  
    addIf("Remarks", fields.remarks);
    addIf("Lot Size", fields.lotSize);
    addIf("Entry Time", fields.entryTime);
    addIf("Duration", fields.duration);
    addIf("Session", fields.session);
    addIf("Outcome", fields.outcome);
    addIf("Balance", fields.balance);
    addIf("Fees", fields.fees);
    addIf("Charts", fields.charts);
    addIf("Entry Price", fields.entryPrice);
    addIf("Symbol", fields.symbol);
    addIf("Exit Time", fields.exitTime);
    addIf("Risk", fields.risk);
    addIf("Result", fields.result);
    addIf("R : R", fields.rR);
    addIf("Exit Price", fields.exitPrice);
    addIf("Net P&L", fields.netPL);
    addIf("P&L", fields.pL);
    addIf("Date", fields.date);
    addIf("Position", fields.position);
  
    if (Object.keys(propsToUpdate).length === 0) {
      throw new Error("No fields provided to update");
    }
  
    const resp = await notion.pages.update({
      page_id: pageId,
      properties: propsToUpdate,
    });
  
    return { id: resp.id, updatedProperties: Object.keys(propsToUpdate) };
  }

export async function archiveJournal(pageId) {
    await notion.pages.update({
        page_id: pageId,
        archived: true,
    });
}