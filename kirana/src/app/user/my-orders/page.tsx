"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import UserOrderCard from "@/components/UserOrderCard";
import { getSocekt } from "@/llib/socket";

import { IUser } from "@/models/user.model";

interface IOrder {
  _id?: string;
  user: string;
  items: [
    {
      grocery: string;
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
  assignment?: string;
  assignedDeliveryBoy?: IUser;
  isPaid: boolean;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}
const MyOrder = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const result = await axios.get("/api/user/my-orders");
        setOrders(result.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getMyOrders();
  }, []);

  useEffect((): any => {
    const socket = getSocekt();
    socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }) => {
      setOrders((prev) =>
        prev?.map((o) =>
          o._id === orderId ? { ...o, assignedDeliveryBoy } : o,
        ),
      );
    });
    return () => {
      socket.off("order-assigned");
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 py-4 flex items-center gap-3">
        <motion.button
          onClick={() => router.push("/")}
          whileTap={{ scale: 0.9 }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white border shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 text-gray-700" />
        </motion.button>
        <h1 className="text-lg font-semibold text-gray-900">My Orders</h1>
      </div>

      {/* Orders or Empty State */}
      <div className="px-4 py-5">
        {orders.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-3">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              You haven’t placed any orders yet
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-5 w-full max-w-4xl mx-auto">
            {orders.map((order, index) => (
              <UserOrderCard key={index} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
