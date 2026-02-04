import connectDb from "@/llib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { userId, location } = await req.json();
    if (!userId || !location) {
      return NextResponse.json(
        { message: "User and Location Not Found" },
        { status: 400 },
      );
    }

    const user = await User.findByIdAndUpdate(userId, { location });

    if (!user) {
      return NextResponse.json({ message: "User  Not Found" }, { status: 400 });
    }

    return NextResponse.json({ message: "Location Updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Update Location Error ${error}` },
      { status: 500 },
    );
  }
}
