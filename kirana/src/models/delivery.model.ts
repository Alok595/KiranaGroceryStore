import mongoose from "mongoose";

export interface IDelivery {
  _id?: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  brodcastedTo: mongoose.Types.ObjectId[];
  assignedTo: mongoose.Types.ObjectId | null;
  status: "brodcasted" | "assigned" | "completed";
  acceptedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const deliverySchema = new mongoose.Schema<IDelivery>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    brodcastedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["brodcasted", "assigned", "completed"],
      default: "brodcasted",
    },
    acceptedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);
const Delivery =
  mongoose.models?.Delivery || mongoose.model("Delivery", deliverySchema);

export default Delivery;
