import { NextRequest, NextResponse } from "next/server";
import { getBookings, addBooking, getServices, getTherapists } from "@/lib/kv";
import { BookingSchema } from "@/lib/schemas";
import { Booking } from "@/lib/types";

export const dynamic = "force-dynamic";

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    let bookings = await getBookings();

    if (status && status !== "all") {
      bookings = bookings.filter((b) => b.status === status);
    }

    if (date) {
      bookings = bookings.filter((b) => b.date === date);
    }

    // Sort by createdAt descending
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, data: bookings });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = BookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { serviceId, therapistId, date, startTime, customerName, customerPhone, note } = validation.data;

    const services = await getServices();
    const service = services.find((s) => s.id === serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, error: "Dịch vụ không tồn tại" },
        { status: 400 }
      );
    }

    const therapists = (await getTherapists()).filter((t) => t.isActive);
    let assignedTherapistId = therapistId;

    // If requestedTherapist is "any", find the first available therapist for this slot
    if (therapistId === "any") {
      const existingBookings = (await getBookings()).filter(
        (b) => b.date === date && b.status !== "cancelled"
      );

      const candStartMins = timeToMinutes(startTime);
      const candBufEndMins = candStartMins + service.durationMinutes + (service.bufferMinutes || 15);

      const availableTherapist = therapists.find((t) => {
        const tBookings = existingBookings.filter((b) => b.therapistId === t.id);
        const hasOverlap = tBookings.some((b) => {
          const bStart = timeToMinutes(b.startTime);
          const bBufEnd = timeToMinutes(b.bufferEndTime);
          return Math.max(candStartMins, bStart) < Math.min(candBufEndMins, bBufEnd);
        });
        return !hasOverlap;
      });

      if (!availableTherapist) {
        return NextResponse.json(
          { success: false, error: "Khung giờ này hiện không còn KTV nào trống" },
          { status: 400 }
        );
      }
      assignedTherapistId = availableTherapist.id;
    }

    const startMins = timeToMinutes(startTime);
    const endMins = startMins + service.durationMinutes;
    const bufferEndMins = endMins + (service.bufferMinutes || 15);

    const dateStr = date.replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const bookingId = `bk_${dateStr}_${randomSuffix}`;

    const newBooking: Booking = {
      id: bookingId,
      serviceId,
      therapistId: assignedTherapistId,
      requestedTherapistId: therapistId,
      customerName,
      customerPhone,
      date,
      startTime,
      endTime: minutesToTime(endMins),
      bufferEndTime: minutesToTime(bufferEndMins),
      status: "pending",
      createdAt: new Date().toISOString(),
      note,
    };

    await addBooking(newBooking);

    return NextResponse.json({ success: true, data: newBooking });
  } catch {
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống khi tạo lịch đặt" },
      { status: 500 }
    );
  }
}
