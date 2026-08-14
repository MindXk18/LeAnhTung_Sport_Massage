import { NextRequest, NextResponse } from "next/server";
import { getTherapists, getServices, getBookings } from "@/lib/kv";
import { Therapist, Booking } from "@/lib/types";

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

// Check if candidate range [candStart, candBufEnd] overlaps with existing occupied [bStart, bBufEnd]
function isOverlapping(
  candStart: number,
  candBufEnd: number,
  bStart: number,
  bBufEnd: number
): boolean {
  return Math.max(candStart, bStart) < Math.min(candBufEnd, bBufEnd);
}

function isTherapistAvailableForSlot(
  therapistId: string,
  candStart: number,
  serviceDuration: number,
  bufferMinutes: number,
  dateBookings: Booking[]
): boolean {
  const candSessionEnd = candStart + serviceDuration;
  const candBufEnd = candSessionEnd + bufferMinutes;

  // 1. Check working hours & lunch break
  // Morning: 08:00 (480) to 12:00 (720)
  // Afternoon: 14:00 (840) to 20:00 (1200)
  const isMorningSlot = candStart >= 480 && candSessionEnd <= 720;
  const isAfternoonSlot = candStart >= 840 && candSessionEnd <= 1200;

  if (!isMorningSlot && !isAfternoonSlot) {
    return false;
  }

  // 2. Check overlap with existing active bookings of this therapist
  const therapistBookings = dateBookings.filter(
    (b) => b.therapistId === therapistId && b.status !== "cancelled"
  );

  for (const b of therapistBookings) {
    const bStart = timeToMinutes(b.startTime);
    const bBufEnd = timeToMinutes(b.bufferEndTime);
    if (isOverlapping(candStart, candBufEnd, bStart, bBufEnd)) {
      return false;
    }
  }

  return true;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId");
    const therapistId = searchParams.get("therapistId") || "any";
    const date = searchParams.get("date");

    if (!serviceId || !date) {
      return NextResponse.json(
        { success: false, error: "Missing serviceId or date parameter" },
        { status: 400 }
      );
    }

    const services = await getServices();
    const service = services.find((s) => s.id === serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    const therapists = (await getTherapists()).filter((t) => t.isActive);
    const bookings = await getBookings();
    const dateBookings = bookings.filter((b) => b.date === date);

    // Target therapists to evaluate
    let targetTherapists: Therapist[] = [];
    if (therapistId === "any") {
      targetTherapists = therapists;
    } else {
      const selected = therapists.find((t) => t.id === therapistId);
      if (selected) targetTherapists = [selected];
    }

    if (targetTherapists.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Generate candidate start times at 15-minute intervals
    // Morning: 08:00 (480) -> 12:00 (720)
    // Afternoon: 14:00 (840) -> 20:00 (1200)
    const availableSlots: string[] = [];
    const serviceDuration = service.durationMinutes;
    const bufferMinutes = service.bufferMinutes || 15;

    const candidateTimes: number[] = [];
    for (let t = 480; t <= 720 - serviceDuration; t += 15) {
      candidateTimes.push(t);
    }
    for (let t = 840; t <= 1200 - serviceDuration; t += 15) {
      candidateTimes.push(t);
    }

    for (const candStart of candidateTimes) {
      if (therapistId === "any") {
        // Available if AT LEAST ONE target therapist is available
        const hasAvailableTherapist = targetTherapists.some((t) =>
          isTherapistAvailableForSlot(
            t.id,
            candStart,
            serviceDuration,
            bufferMinutes,
            dateBookings
          )
        );
        if (hasAvailableTherapist) {
          availableSlots.push(minutesToTime(candStart));
        }
      } else {
        // Specific therapist
        const isFree = isTherapistAvailableForSlot(
          targetTherapists[0].id,
          candStart,
          serviceDuration,
          bufferMinutes,
          dateBookings
        );
        if (isFree) {
          availableSlots.push(minutesToTime(candStart));
        }
      }
    }

    return NextResponse.json({ success: true, data: availableSlots });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to calculate availability" },
      { status: 500 }
    );
  }
}
