import { NextResponse } from 'next/server';

// In-memory analytics store (resets on server restart)
// In production, connect this to your database
let sizeSelections = {
	'50 sq ft': 0,
	'70 sq ft': 0,
	'80 sq ft': 0,
};

// Track a size selection (called from the calculator)
export async function POST(request) {
	try {
		const body = await request.json();
		const { size } = body;
		if (size && size in sizeSelections) {
			sizeSelections[size] += 1;
		}
		return NextResponse.json({ success: true, selections: sizeSelections });
	} catch {
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}
}

// Get current size analytics
export async function GET() {
	return NextResponse.json(sizeSelections);
}
