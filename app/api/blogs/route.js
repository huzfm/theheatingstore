import { NextResponse } from "next/server";

// const BACKEND = "https://evulation-api-electrichamambackend.0psc8x.easypanel.host";
const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://evulation-api-electrichamambackend.0psc8x.easypanel.host";

export async function GET() {
  try {
    const backendRes = await fetch(`${BACKEND}/api/blogs`, {
      // Cache upstream blog data for 60s instead of re-fetching on every request.
      // Content stays current (refreshes within a minute) while cutting backend round-trips.
      next: { revalidate: 60 },
    });

    if (!backendRes.ok) {
      return NextResponse.json([], { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
