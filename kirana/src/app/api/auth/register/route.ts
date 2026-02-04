import connectDb from "@/llib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return NextResponse.json(
        { message: "email already exists!" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Pasword Must Be Atleast 6 Charater!" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `register error${error}` },
      { status: 500 },
    );
  }
}
