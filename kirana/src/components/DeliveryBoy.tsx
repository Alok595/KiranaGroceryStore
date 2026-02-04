import React from "react";
import DeliveryBoyDashboard from "./DeliveryBoyDashboard";
import { auth } from "@/auth";
import connectDb from "@/llib/db";
import Order from "@/models/order.modal";

const DeliveryBoy = async () => {
  await connectDb();
  const session = await auth();
  const deliveryBoyId = session?.user?.id;

  const orders = await Order.find({
    assignedDeliveryBoy: deliveryBoyId,
    deliveryOtpVerification: true,
  });

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.deliveryAt).toDateString() === today,
  ).length;

  const todayEarning = todayOrders * 40;

  console.log(todayEarning);

  return (
    <>
      <DeliveryBoyDashboard earning={todayEarning} />
    </>
  );
};

export default DeliveryBoy;
