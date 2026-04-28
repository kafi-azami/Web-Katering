import { getSheets, SHEET_ID } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sheets = await getSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "menus!A:H",
    });

    const rows = response.data.values || [];
    console.log("rows:", rows)

    // Skip header row
    const menus = rows.slice(1).map((row) => ({
      id: row[0],
      name: row[1],
      description: row[2],
      price: row[3],
      category: row[4],
      image: row[5],
      is_periodic: row[6],
      day: row[7],
    }));

    return NextResponse.json({ success: true, data: menus });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error fetching menus" });
  }
}

export async function POST(request: Request) {
  try {
    const sheets = await getSheets();
    const body = await request.json();

    const id = Date.now().toString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "menus!A:H",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          id,
          body.name,
          body.description,
          body.price,
          body.category,
          body.image || "",
          body.is_periodic || "false",
          body.day || "",
        ]],
      },
    });

    return NextResponse.json({ success: true, message: "Menu added successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error adding menu" });
  }
}

export async function PUT(request: Request) {
  try {
    const sheets = await getSheets();
    const body = await request.json();

    // Find the row with matching id
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "menus!A:H",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === body.id);

    if (rowIndex === -1) {
      return NextResponse.json({ success: false, message: "Menu not found" });
    }

    // +1 because sheets are 1-indexed, +1 for header row
    const sheetRow = rowIndex + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `menus!A${sheetRow}:H${sheetRow}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          body.id,
          body.name,
          body.description,
          body.price,
          body.category,
          body.image || "",
          body.is_periodic || "false",
          body.day || "",
        ]],
      },
    });

    return NextResponse.json({ success: true, message: "Menu updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error updating menu" });
  }
}

export async function DELETE(request: Request) {
  try {
    const sheets = await getSheets();
    const body = await request.json();

    // Find the row with matching id
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "menus!A:H",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === body.id);

    if (rowIndex === -1) {
      return NextResponse.json({ success: false, message: "Menu not found" });
    }

    // Get spreadsheet info to find sheet id
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    const sheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === "menus"
    );

    const sheetId = sheet?.properties?.sheetId;

    // Delete the row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        }],
      },
    });

    return NextResponse.json({ success: true, message: "Menu deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error deleting menu" });
  }
}