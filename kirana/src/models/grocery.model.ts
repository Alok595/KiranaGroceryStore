import mongoose from "mongoose";

export interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const grocerySchema = new mongoose.Schema<IGrocery>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Fruits & Vegitables",
        "Biscuits & Cookies",
        "Soft Drinks",
        "Rice,Atta & Flour",
        "Baby & PetCare",
        "Household & Personal Care",
        "Dairy & Bakery",
        "Packaged Food",
      ],
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["Kg", "g", "litre", "ml", "piece", "pack"],
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Grocery =
  mongoose.models?.Grocery || mongoose.model("Grocery", grocerySchema);

export default Grocery;
