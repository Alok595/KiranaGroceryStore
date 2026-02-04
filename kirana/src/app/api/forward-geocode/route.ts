import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json([], { status: 400 });
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      q,
    )}&addressdetails=1&limit=5`,
    {
      headers: {
        "User-Agent": "nextjs-checkout-app",
      },
    },
  );

  const data = await res.json();
  return NextResponse.json(data);
}
