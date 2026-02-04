import React from "react";
import HeroSection from "./HeroSection";
import CategorySlider from "./CategorySlider";
import GroceryItemCard from "./GroceryItemCard";
import connectDb from "@/llib/db";
import Grocery, { IGrocery } from "@/models/grocery.model";
const UserDashboard = async ({ groceryList }: { groceryList: IGrocery[] }) => {
  await connectDb;
  const plainGrocery = JSON.parse(JSON.stringify(groceryList));

  console.log(plainGrocery);
  return (
    <>
      <HeroSection />
      <CategorySlider />
      <div className="px-10 ">
        <h2 className="text-4xl md:text-5xl font-extrabold text-black mt-1">
          Shop Popular Items
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {plainGrocery.map((item: any, idx: number) => (
          <GroceryItemCard key={idx} item={item} />
        ))}
      </div>
    </>
  );
};

export default UserDashboard;
