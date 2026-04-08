import { NextResponse } from "next/server";

import { searchConference } from "@/lib/data";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const conference = searchParams.get("conference");
	const query = searchParams.get("query") ?? "";

	if (!conference) {
		return NextResponse.json([], { status: 200 });
	}

	const results = await searchConference(conference, query);

	return NextResponse.json(results);
}
