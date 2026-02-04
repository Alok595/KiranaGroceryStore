import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    {
      headers: {
        "User-Agent": "checkout-app/1.0",
      },
    },
  );

  const data = await res.json();
  return NextResponse.json(data);
}
