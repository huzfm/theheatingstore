// import { NextResponse } from 'next/server';

// const BACKEND =
// 	process.env.NEXT_PUBLIC_API_URL ||
// 	'https://evulation-api-electrichamambackend.0psc8x.easypanel.host';

// export async function GET(req) {
// 	const phone = req.nextUrl.searchParams.get('phone');
// 	const warrantyId = req.nextUrl.searchParams.get('warrantyId');

// 	if (!phone && !warrantyId) {
// 		return NextResponse.json(
// 			{ message: 'Phone number or Warranty ID required' },
// 			{ status: 400 },
// 		);
// 	}

// 	try {
// 		let backendUrl;

// 		if (warrantyId) {
// 			// Warranty ID lookup - use same /lookup pattern as phone
// 			backendUrl = `${BACKEND}/api/warranty/lookup/${encodeURIComponent(warrantyId)}`;
// 		} else {
// 			// Phone lookup
// 			backendUrl = `${BACKEND}/api/warranty/lookup/${encodeURIComponent(phone)}`;
// 		}

// 		const backendRes = await fetch(backendUrl);

// 		const contentType = backendRes.headers.get('content-type');

// 		if (!backendRes.ok) {
// 			if (contentType && contentType.includes('application/json')) {
// 				const err = await backendRes.json();
// 				return NextResponse.json(err, { status: backendRes.status });
// 			} else {
// 				const text = await backendRes.text();

// 				console.error('Non-JSON error response:', text);

// 				return NextResponse.json(
// 					{
// 						message: 'Backend returned non-JSON response',
// 						details: text,
// 					},
// 					{ status: backendRes.status },
// 				);
// 			}
// 		}

// 		const data = await backendRes.json();
// 		return NextResponse.json(Array.isArray(data) ? data : [data], {
// 			status: 200,
// 		});
// 	} catch (err) {
// 		console.error('Warranty proxy error:', err);
// 		return NextResponse.json(
// 			{ message: 'Server error' },
// 			{ status: 500 },
// 		);
// 	}
// }


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