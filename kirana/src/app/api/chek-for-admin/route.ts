import connectDb from "@/llib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await User.find({ role: "admin" });
    if (user.length > 0) {
      return NextResponse.json({ adminExist: true }, { status: 200 });
    } else {
      return NextResponse.json({ adminExist: false }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Chek Admin Error${error}` },
      { status: 500 },
    );
  }
}
