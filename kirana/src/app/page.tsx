import { auth } from "@/auth";
import AdminDashBoard from "@/components/AdminDashBoard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import connectDb from "@/llib/db";
import Grocery, { IGrocery } from "@/models/grocery.model";
import User from "@/models/user.model";
import { redirect } from "next/navigation";
import React from "react";

const Home = async (props: { searchParams: Promise<{ q: string }> }) => {
  const searchParams = await props.searchParams;
  console.log(searchParams);
  await connectDb();
  const session = await auth();
  console.log(session);

  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }

  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role === "user");
  if (inComplete) {
    return <EditRoleMobile />;
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  let groceryList: IGrocery[] = [];

  if (user.role === "user") {
    if (searchParams.q) {
      groceryList = await Grocery.find({
        $or: [
          { name: { $regex: searchParams?.q || "", $options: "i" } },
          { category: { $regex: searchParams?.q || "", $options: "i" } },
        ],
      });
    } else {
      groceryList = await Grocery.find({});
    }
  }

  return (
    <>
      <Nav user={plainUser} />
      <GeoUpdater userId={plainUser._id} />
      {user?.role == "user" ? (
        <UserDashboard groceryList={groceryList} />
      ) : user.role == "admin" ? (
        <AdminDashBoard />
      ) : (
        <DeliveryBoy />
      )}
      <Footer />
    </>
  );
};

export default Home;
