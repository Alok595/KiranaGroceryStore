import connectDb from "@/llib/db";
import Order from "@/models/order.modal";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,

      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Signature Vericfication Failed", error);
  }

  if (event?.type === "checkout.session.completed") {
    const session = event.data.object;
    await connectDb();
    await Order.findByIdAndUpdate(session?.metadata?.orderId, { isPaid: true });
  }
  return NextResponse.json({ recived: true }, { status: 200 });
}
