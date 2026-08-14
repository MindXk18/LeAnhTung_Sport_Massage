import { NextRequest, NextResponse } from "next/server";
import { getPrograms } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("issueTag");

    let programs = await getPrograms();

    if (tag) {
      programs = programs.filter((p) => p.issueTags.includes(tag));
    }

    return NextResponse.json({ success: true, data: programs });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
