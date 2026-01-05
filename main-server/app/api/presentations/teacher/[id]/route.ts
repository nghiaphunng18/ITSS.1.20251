import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get the teacher's lecture notes.
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Query DB
    const presentations = await prisma.presentation.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        _count: {
          select: { sessions: true, checkpoints: true },
        },
      },
    });

    return NextResponse.json(presentations);
  } catch (error) {
    console.error("Error fetching presentations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
