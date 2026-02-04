import connectDb from "@/llib/db";
import Order from "@/models/order.modal";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();

    if (!items || !userId || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { message: "Please Send All Details" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_BASE_URL}/user/order-success`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel`,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Kirana",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { orderId: newOrder._id.toString() },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `placeOrder error ${error}` },
      { status: 500 },
    );
  }
}
