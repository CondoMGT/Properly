import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file temporarily
    const tempPath = join("/tmp", file.name);
    await writeFile(tempPath, new Uint8Array(buffer));

    let jsonData: any[];

    if (file.name.endsWith(".csv")) {
      // Parse CSV
      const csvContent = buffer.toString();
      jsonData = parse(csvContent, { columns: true, skip_empty_lines: true });
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      // Parse Excel
      // const workbook = XLSX.readFile(tempPath);
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet);
    } else {
      return NextResponse.json(
        { error: "Unsupported file format" },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: jsonData });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Error processing file" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
