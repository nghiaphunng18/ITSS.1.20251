import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreatePresentationRequest } from "@/types/presentation";

// POST: Create a new lesson
export async function POST(req: NextRequest) {
  try {
    // 1. Validate Body
    const body: CreatePresentationRequest = await req.json();
    const { userId, name, fileUrl } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!name || !fileUrl) {
      return NextResponse.json(
        { error: "Missing name or fileUrl" },
        { status: 400 }
      );
    }

    // 3. Create Record
    const newPresentation = await prisma.presentation.create({
      data: {
        name,
        fileUrl,
        ownerId: userId,
      },
    });

    return NextResponse.json(newPresentation, { status: 201 });
  } catch (error) {
    console.error("Error creating presentation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
