import { auth } from "@/auth";
import connectDb from "@/llib/db";
import Order from "@/models/order.modal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    const orders = await Order.find({ user: session?.user?.id })
      .populate("user assignedDeliveryBoy")
      .sort({ createdAt: -1 });
    if (!orders) {
      return NextResponse.json(
        { message: "Orders Not Found" },
        { status: 400 },
      );
    }
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `get all orders error ${error}` },
      { status: 500 },
    );
  }
}
