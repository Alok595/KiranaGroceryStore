import { auth } from "@/auth";
import uploadOnCloudinary from "@/llib/cloudinary";
import connectDb from "@/llib/db";
import Grocery from "@/models/grocery.model";
import { image } from "motion/react-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are Not Admin" },
        { status: 400 },
      );
    }

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const groceryId = formData.get("groceryId") as string;

    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string;
    const price = formData.get("price") as string;
    const file = formData.get("image") as Blob | null;
    let imageUrl;
    if (file) {
      imageUrl = await uploadOnCloudinary(file);
    }

    const grocery = await Grocery.findByIdAndUpdate(groceryId, {
      name,
      category,
      unit,
      price,
      image: imageUrl,
    });

    return NextResponse.json(grocery, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Edit Grocery error${error}` },
      { status: 500 },
    );
  }
}



