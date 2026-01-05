import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Validate file type (only accepts PDF)
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // 2. Create buffer from file.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Create a file save path (public/uploads/presentations)
    // // Give the file a unique name using a timestamp to avoid conflicts.
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase(); // sanitize tên file
    const fileName = `${timestamp}-${safeName}`;

    // Actual path on the hard drive
    const uploadDir = path.join(process.cwd(), "public/uploads/presentations");

    // Make sure the directory exists.
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    // 4. Save file
    await writeFile(filePath, buffer);

    // 5. Returns a public URL (accessible to the frontend).
    const publicUrl = `/uploads/presentations/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
