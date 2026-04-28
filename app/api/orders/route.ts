import { getSheets, SHEET_ID } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sheets = await getSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "orders!A:I",
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
      range: "orders!A:I",
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
        ]],
      },
    });

    return NextResponse.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error placing order" });
  }
}