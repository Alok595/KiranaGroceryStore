import { auth } from "@/auth";
import connectDb from "@/llib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { role, mobile } = await req.json();

    const session = await auth();

    const user = await User.findOneAndUpdate(
      { email: session?.user?.email },
      {
        role,
        mobile,
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ message: "User Not Find!" }, { status: 400 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Role And Mobile Edit Error ${error}` },
      { status: 500 },
    );
  }
}
