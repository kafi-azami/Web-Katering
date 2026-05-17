import { getSheets, SHEET_ID } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sheets = await getSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "orders!A:L",
    });

    const rows = response.data.values || [];

    const orders = rows.slice(1).map((row) => ({
      id: row[0],
      name: row[1],
      phone: row[2],
      location: row[3],
      menu_id: row[4],
      menu_name: row[5],
      total_price: row[6],
      date: row[7],
      status: row[8],
      delivery_date: row[9],
      delivery_time: row[10],
      quantity: row[11],
    }));

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error fetching orders" });
  }
}

export async function POST(request: Request) {
  try {
    const sheets = await getSheets();
    const body = await request.json();

    const id = Date.now().toString();
    const date = new Date().toLocaleDateString("id-ID");

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "orders!A:L",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          id,
          body.name,
          body.phone,
          body.location,
          body.menu_id,
          body.menu_name,
          body.total_price,
          date,
          "pending",
          body.delivery_date,
          body.delivery_time,
          body.quantity,
        ]],
      },
    });

    return NextResponse.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error placing order" });
  }
}

export async function PUT(request: Request) {
  try {
    const sheets = await getSheets();
    const body = await request.json();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "orders!A:L",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === body.id);

    if (rowIndex === -1) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    const sheetRow = rowIndex + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `orders!A${sheetRow}:L${sheetRow}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          body.id,
          body.name,
          body.phone,
          body.location,
          body.menu_id,
          body.menu_name,
          body.total_price,
          body.date,
          body.status,
          body.delivery_date,
          body.delivery_time,
          body.quantity,
        ]],
      },
    });

    return NextResponse.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error updating order" });
  }
}

export async function DELETE(request: Request) {
  try {
    const sheets = await getSheets();
    const body = await request.json();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "orders!A:L",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === body.id);

    if (rowIndex === -1) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
    });

    const sheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === "orders"
    );

    const sheetId = sheet?.properties?.sheetId;

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

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error deleting order" });
  }
}