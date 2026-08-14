import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập mật khẩu" },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD || "123456789";

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: "Sai mật khẩu. Vui lòng thử lại." },
        { status: 401 }
      );
    }

    // Generate session token
    const secret = process.env.ADMIN_SESSION_SECRET || "default-secret";
    const token = btoa(secret).slice(0, 32);

    const response = NextResponse.json({ success: true });

    // Set HttpOnly cookie, 7 days expiry
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
