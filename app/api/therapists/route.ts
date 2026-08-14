import { NextRequest, NextResponse } from "next/server";
import { getTherapists } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");

    let therapists = await getTherapists();
    therapists = therapists.filter((t) => t.isActive);

    if (specialty) {
      therapists = therapists.filter((t) =>
        t.specialties.includes(specialty)
      );
    }

    return NextResponse.json({ success: true, data: therapists });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch therapists" },
      { status: 500 }
    );
  }
}
