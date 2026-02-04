import { auth } from "@/auth";
import connectDb from "@/llib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 400 },
      );
    }
    const user = await User.findOne({ email: session.user.email }).select(
      "-password",
    );
    if (!user) {
      return NextResponse.json(
        { message: "User is not Found" },
        { status: 400 },
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Get me Error : ${error}` },
      { status: 500 },
    );
  }
}
