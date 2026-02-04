import connectDb from "@/llib/db";

import Message from "@/models/message.model";
import Order from "@/models/order.modal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { roomId } = await req.json();

    const room = await Order.findById(roomId);

    if (!room) {
      return NextResponse.json(
        { message: "Room is not Found" },
        { status: 400 },
      );
    }

    const messages = await Message.find({ roomId: room._id });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Get Message Error ${error}` },
      { status: 500 },
    );
  }
}
