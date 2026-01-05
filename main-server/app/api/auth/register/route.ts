import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, studentCode } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["STUDENT", "TEACHER"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be STUDENT or TEACHER" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Validate student code if provided
    if (studentCode) {
      if (!/^\d{8,9}$/.test(studentCode)) {
        return NextResponse.json(
          { error: "Student code must be 8-9 digits" },
          { status: 400 }
        );
      }

      // Check if student code already exists
      const existingStudentCode = await prisma.user.findUnique({
        where: { studentCode },
      });

      if (existingStudentCode) {
        return NextResponse.json(
          { error: "Student code already exists" },
          { status: 409 }
        );
      }
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Create new user
    // Note: In production, password should be hashed using bcrypt
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Should be hashed in production
        role,
        ...(studentCode ? { studentCode } : {}),
        status: "ACTIVE",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        studentCode: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
