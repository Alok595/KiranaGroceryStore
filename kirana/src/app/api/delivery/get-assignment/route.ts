import { auth } from "@/auth";
import connectDb from "@/llib/db";
import Delivery from "@/models/delivery.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    const assignments = await Delivery.find({
      brodcastedTo: session?.user?.id,
      status: "brodcasted",
    }).populate("order");

    

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `get assignments error ${error}` },
      { status: 200 },
    );
  }
}
