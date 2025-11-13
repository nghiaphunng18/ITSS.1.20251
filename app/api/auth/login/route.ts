import { NextRequest, NextResponse } from "next/server";

// Mock user database - Replace with your actual database
const MOCK_USERS = [
  {
    id: 1,
    email: "user@example.com",
    password: "password123", // In production, use hashed passwords!
    name: "John Doe",
  },
  {
    id: 2,
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user - In production, query your database
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // In production:
    // 1. Verify password hash (e.g., using bcrypt)
    // 2. Generate JWT token or session
    // 3. Set secure httpOnly cookies
    // 4. Return user data (without password)

    // Mock successful login response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        // In production, include a JWT token
        token: "mock-jwt-token-" + Date.now(),
      },
      { status: 200 }
    );

    // Set a mock session cookie (in production, use secure settings)
    response.cookies.set("session", "mock-session-" + user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
