import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

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

  // Response contains pages (rows)
  return response.results.map((page) => {
    console.log("data");
    const props = page.properties;
    const name = props?.Name?.title?.[0]?.plain_text ?? "No Name";
    const initialBalance = props?.["Initial Balance"]?.number ?? 0;
    const currentBalance = props?.["Current Balance"]?.number ?? 0;
    return { id: page.id, name, initialBalance, currentBalance };
  });
}
