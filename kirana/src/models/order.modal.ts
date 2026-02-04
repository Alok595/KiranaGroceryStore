import mongoose from "mongoose";
import { number } from "motion";

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullname: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: mongoose.Types.ObjectId;
  assignedDeliveryBoy?: mongoose.Types.ObjectId;
  isPaid: boolean;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
  deliveryOtp: string | null;
  deliveryOtpVerification: boolean;
  deliveryAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        grocery: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Grocery",
          required: true,
        },
        name: String,
        price: Number,
        unit: String,
        image: String,
        quantity: Number,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    totalAmount: Number,

    address: {
      fullname: String,
      mobile: String,
      city: String,
      state: String,
      pincode: String,
      fullAddress: String,
      latitude: Number,
      longitude: Number,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,

      enum: ["pending", "out of delivery", "delivered"],
      default: "pending",
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      default: null,
    },
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryOtp: {
      type: String,
      default: null,
    },
    deliveryOtpVerification: {
      type: Boolean,
      default: false,
    },
    deliveryAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Order = mongoose.models?.Order || mongoose.model("Order", orderSchema);

export default Order;
