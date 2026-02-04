import connectDb from "@/llib/db";
import { sendMail } from "@/llib/mailer";
import Order from "@/models/order.modal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { orderId } = await req.json();
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 400 });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    order.deliveryOtp = otp;
    await order.save();

    await sendMail(
      order.user.email,
      "Your Delivery OTP",
      `<h2>Your Delivery OTP is <strong>${otp}</strong></h2>`,
    );

    return NextResponse.json(
      { message: "Otp Sent Successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Otp Sent Error ${error}` },
      { status: 500 },
    );
  }
}
