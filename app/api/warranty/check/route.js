
import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://evulation-api-electrichamambackend.0psc8x.easypanel.host";

export async function GET(req) {
  const phone      = req.nextUrl.searchParams.get("phone");
  const warrantyId = req.nextUrl.searchParams.get("warrantyId");

  if (!phone && !warrantyId) {
    return NextResponse.json(
      { message: "Phone number or warranty ID is required" },
      { status: 400 }
    );
  }

  try {
 
    const param = phone
      ? `phone=${encodeURIComponent(phone)}`
      : `warrantyId=${encodeURIComponent(warrantyId)}`;

    const backendRes = await fetch(
      `${BACKEND}/api/warranty/check?${param}`,
      { cache: "no-store" }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }


    return NextResponse.json(
      { results: Array.isArray(data.results) ? data.results : [] },
      { status: 200 }
    );

  } catch (err) {
    console.error("Warranty proxy error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}