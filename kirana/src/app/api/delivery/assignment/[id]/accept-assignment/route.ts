import { auth } from "@/auth";
import connectDb from "@/llib/db";
import emitEventHandler from "@/llib/emitEventHandler";
import Delivery from "@/models/delivery.model";
import Order from "@/models/order.modal";
import User from "@/models/user.model";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDb();
    const { id } = await context.params;
    const session = await auth();

    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });
    }

    const assignment = await Delivery.findById(id);
    if (!assignment) {
      return NextResponse.json(
        { message: "Assignment Not Found" },
        { status: 400 },
      );
    }
    if (assignment.status !== "brodcasted") {
      return NextResponse.json(
        { message: "Assignment Expired" },
        { status: 400 },
      );
    }

    const alreadyAssigned = await Delivery.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "Already Assigned To another order" },
        { status: 400 },
      );
    }

    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return NextResponse.json({ message: "Order Not Found" }, { status: 400 });
    }
    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    await order.populate("assignedDeliveryBoy");

    await emitEventHandler("order-assigned", {
      assignedDeliveryBoy: order.assignedDeliveryBoy,
      orderId: order._id,
    });

    await Delivery.updateMany(
      {
        _id: { $ne: assignment._id },
        brodcastedTo: deliveryBoyId,
        status: "brodcasted",
      },
      { $pull: { brodcastedTo: deliveryBoyId } },
    );

    return NextResponse.json(
      { message: "Order Accepted Succesfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Accept assigned error ${error} ` },
      { status: 500 },
    );
  }
}
