import connectDb from "@/llib/db";
import emitEventHandler from "@/llib/emitEventHandler";
import Delivery from "@/models/delivery.model";
import Order from "@/models/order.modal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, otp } = await req.json();

    if (!orderId || !otp) {
      return NextResponse.json(
        { message: "OrderId And Otp Not Found" },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order Not Found" }, { status: 400 });
    }

    if (order.deliveryOtp !== otp) {
      return NextResponse.json(
        { message: "Incorrect Or Expired OTP" },
        { status: 400 },
      );
    }
    order.status = "delivered";

    order.deliveryOtpVerification = true;
    order.deliveryAt = new Date();

    await order.save();
    await emitEventHandler("order-status-update", {
      orderId: order._id,
      status: order.status,
    });

    await Delivery.updateOne(
      { order: orderId },
      { $set: { assignedTo: null, status: "completed" } },
    );

    return NextResponse.json(
      { message: "Delivery Successfully Completed" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Otp Veify Error ${error}` },
      { status: 500 },
    );
  }
}
