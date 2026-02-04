import connectDb from "@/llib/db";
import emitEventHandler from "@/llib/emitEventHandler";
import Delivery from "@/models/delivery.model";
import Order from "@/models/order.modal";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    await connectDb();
    const { orderId } = await context.params;
    const { status } = await req.json();

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order Not Found" }, { status: 400 });
    }

    order.status = status;
    let deliveryBoysPaylod: any = [];
    if (status == "out of delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryboy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);
      const busyIds = await Delivery.find({
        assignedTo: { $in: nearByIds }, // ✅ $in takes an array
        status: { $nin: ["brodcasted", "completed"] }, // ✅ status at top level
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((b) => String(b)));
      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id)),
      );

      const candidates = availableDeliveryBoys.map((b) => b._id);
      if (candidates.length == 0) {
        await order.save();

        await emitEventHandler("order-status-update", {
          orderId: order._id,
          status: order.status,
        });
        return NextResponse.json(
          { message: "Delivery Boys Not Found" },
          { status: 200 },
        );
      }

      const deliveryAssignment = await Delivery.create({
        order: order._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });

      await deliveryAssignment.populate("order");

      for (const boyId of candidates) {
        const boy = await User.findById(boyId);
        if (boy.socketId) {
          await emitEventHandler(
            "new-assignment",
            deliveryAssignment,
            boy.socketId,
          );
        }
      }

      order.assignment = deliveryAssignment._id;
      // order.assignedDeliveryBoy = deliveryAssignment.assignedTo;

      deliveryBoysPaylod = availableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));

      await deliveryAssignment.populate("order");
    }

    await order.save();
    await order.populate("user");
    await emitEventHandler("order-status-update", {
      orderId: order._id,
      status: order.status,
    });

    return NextResponse.json(
      { assignment: order.assignment?._id, availableBoys: deliveryBoysPaylod },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Update Staus Error ${error}` },
      { status: 500 },
    );
  }
}
