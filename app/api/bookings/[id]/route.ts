import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/kv";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Trạng thái không hợp lệ" },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(id, status);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy đơn đặt lịch" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống khi cập nhật trạng thái" },
      { status: 500 }
    );
  }
}
