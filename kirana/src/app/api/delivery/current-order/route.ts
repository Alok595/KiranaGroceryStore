import { auth } from "@/auth";
import connectDb from "@/llib/db";
import Delivery from "@/models/delivery.model";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    const activeAssignment = await Delivery.findOne({
      assignedTo: deliveryBoyId,
      status: "assigned",
    })
      .populate({ path: "order", populate: { path: "address" } })
      .lean();

    if (!activeAssignment) {
      return NextResponse.json({ active: false }, { status: 200 });
    }

    return NextResponse.json(
      { active: true, assignment: activeAssignment },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `current order error ${error}` },
      { status: 500 },
    );
  }
}
