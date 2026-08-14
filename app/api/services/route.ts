import { NextResponse } from "next/server";
import { getServices } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json({ success: true, data: services });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
