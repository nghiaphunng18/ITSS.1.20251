/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SaveCheckpointRequest } from "@/types/presentation";

// POST: Tạo mới hoặc Cập nhật Checkpoint
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const presentationId = (await params).id;
    const body: SaveCheckpointRequest = await request.json();
    const { userId, pageNumber, question, options, correctAnswer, timeLimit } =
      body;

    // 1. Kiểm tra quyền sở hữu
    const presentation = await prisma.presentation.findUnique({
      where: { id: presentationId },
    });

    if (!presentation || presentation.ownerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 2. Tìm xem trang này đã có checkpoint chưa
    const existingCheckpoint = await prisma.presentationCheckpoint.findFirst({
      where: {
        presentationId: presentationId,
        pageNumber: pageNumber,
      },
    });

    let result;

    if (existingCheckpoint) {
      // A. Nếu có rồi -> UPDATE
      result = await prisma.presentationCheckpoint.update({
        where: { id: existingCheckpoint.id },
        data: {
          question,
          options: options as any,
          correctAnswer: correctAnswer as any,
          timeLimit,
        },
      });
    } else {
      // B. Nếu chưa có -> CREATE
      result = await prisma.presentationCheckpoint.create({
        data: {
          presentationId,
          pageNumber,
          question,
          options: options as any,
          correctAnswer: correctAnswer as any,
          timeLimit,
        },
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error saving checkpoint:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Xóa Checkpoint tại trang cụ thể
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const presentationId = (await params).id;

    // Lấy pageNumber từ query param (VD: ?page=1)
    const { searchParams } = new URL(request.url);
    const pageNumber = searchParams.get("page");
    const userId = searchParams.get("userId"); // Cần check quyền

    if (!pageNumber || !userId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // Check quyền
    const presentation = await prisma.presentation.findUnique({
      where: { id: presentationId },
    });

    if (!presentation || presentation.ownerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Tìm checkpoint cần xóa
    const checkpoint = await prisma.presentationCheckpoint.findFirst({
      where: {
        presentationId,
        pageNumber: parseInt(pageNumber),
      },
    });

    if (!checkpoint) {
      return NextResponse.json(
        { error: "Checkpoint not found" },
        { status: 404 }
      );
    }

    // Thực hiện xóa
    await prisma.presentationCheckpoint.delete({
      where: { id: checkpoint.id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting checkpoint:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
